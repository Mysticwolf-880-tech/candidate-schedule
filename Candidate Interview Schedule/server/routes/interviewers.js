const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Add Interviewers
router.post("/interviewers", authenticateToken, (req, res) => {
  const { name } = req.body;
  const added_by = req.user.username; 

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const sql = `
    INSERT INTO interviewers_master (name, added_by, status)
    VALUES (?, ?, 1)
  `;

  db.query(sql, [name, added_by], (err, result) => {
    if (err) {
      console.error("Error adding interviewer:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Interviewer added successfully",
      id: result.insertId,
    });
  });
});

// Get All Interviewers with Pagination and Search
router.get("/interviewers", (req, res) => {
  // Get query parameters
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;

  // Base SQL query
  let sql = `
    SELECT SQL_CALC_FOUND_ROWS * 
    FROM interviewers_master 
    WHERE status = 1
  `;

  // Add search conditions if search term exists
  const searchParams = [];
  if (search) {
    sql += ` AND (name LIKE ? OR added_by LIKE ?)`;
    searchParams.push(`%${search}%`, `%${search}%`);
  }

  // Add pagination
  sql += ` LIMIT ? OFFSET ?`;
  searchParams.push(parseInt(limit), parseInt(offset));

  db.query(sql, searchParams, (err, results) => {
    if (err) {
      console.error("Error fetching interviewers:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Get total count
    db.query('SELECT FOUND_ROWS() AS total', (err, countResult) => {
      if (err) {
        console.error("Error getting total count:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        data: results,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: total
      });
    });
  });
});

//Update Interviewers
router.put("/interviewers/:id", authenticateToken, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  const sql = "UPDATE interviewers_master SET name = ?, status = 1 WHERE id = ?";
  db.query(sql, [name, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.status(200).json({ message: "Updated successfully" });
  });
});

// Soft Delete Interviewers
router.put("/interviewers/delete/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE interviewers_master SET status = 0 WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.status(200).json({ message: "Deleted successfully" });
  });
});


module.exports = router;
