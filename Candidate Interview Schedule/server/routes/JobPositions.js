const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Add Job Position
router.post("/jobposition", authenticateToken, (req, res) => {
  const { name } = req.body;
  const added_by = req.user.username;

  if (!name) {
    return res.status(400).json({ message: "Job name is required" });
  }

  const sql = `
    INSERT INTO jobPosition_master (job_name, added_by, status)
    VALUES (?, ?, 1)
  `;

  db.query(sql, [name, added_by], (err, result) => {
    if (err) {
      console.error("Error adding job position:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Job position added successfully",
      id: result.insertId,
    });
  });
});

// Get All Job Positions
// router.get("/jobposition", authenticateToken, (req, res) => {
//   const sql = `
//     SELECT job_id AS id, job_name AS name, added_by, added_on 
//     FROM jobPosition_master 
//     WHERE status = 1
//     ORDER BY job_id DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching job positions:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     res.status(200).json(results);
//   });
// });

// Get All Job Positions with Pagination and Search
router.get("/jobposition", (req, res) => {
  // Get query parameters
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;

  // Base SQL query
  let sql = `
    SELECT SQL_CALC_FOUND_ROWS * 
    FROM jobPosition_master
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
      console.error("Error fetching job positions:", err);
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

//Jobs Count
router.get("/job/count", (req, res) => {
  const sql = `
    SELECT COUNT(*) AS count 
    FROM jobPosition_master 
    WHERE status = 1
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching job count:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ count: result[0].count });
  });
  
});

// Update Job Position
router.put("/jobposition/:id", authenticateToken, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Job name is required" });
  }

  const sql = `
    UPDATE jobPosition_master 
    SET job_name = ?, status = 1
    WHERE job_id = ?
  `;
  db.query(sql, [name, id], (err) => {
    if (err) {
      console.error("Error updating job position:", err);
      return res.status(500).json({ message: "Update failed" });
    }

    res.status(200).json({ message: "Job position updated successfully" });
  });
});

// Soft Delete Job Position
router.put("/jobposition/delete/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE jobPosition_master 
    SET status = 0 
    WHERE job_id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting job position:", err);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.status(200).json({ message: "Job position deleted successfully" });
  });
});

module.exports = router;
