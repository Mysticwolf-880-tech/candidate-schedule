const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get All Statuses with Pagination and Search
router.get("/status", (req, res) => {
  // Get query parameters
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;

  // Base SQL query
  let sql = `
    SELECT * 
    FROM status_master 
    WHERE status = 1
  `;

  // Add search conditions if search term exists
  const searchParams = [];
  if (search) {
    sql += ` AND (status_name LIKE ? OR added_by LIKE ?)`;
    searchParams.push(`%${search}%`, `%${search}%`);
  }

  // Add pagination
  sql += ` LIMIT ? OFFSET ?`;
  searchParams.push(parseInt(limit), parseInt(offset));

  db.query(sql, searchParams, (err, results) => {
    if (err) {
      console.error("Error fetching statuses:", err);
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

router.get("/status/count", (req, res) => {
  const sql = `SELECT COUNT(*) AS count FROM status_master WHERE status = 1`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching status count:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ count: result[0].count });
  });
});

// POST add new status
router.post("/status", authenticateToken, (req, res) => {
  const { status_name } = req.body;
  const added_by = req.user?.username;

  if (!status_name || !added_by) {
    return res.status(400).json({ error: "status_name is required." });
  }

  const sql = "INSERT INTO status_master (status_name, added_by) VALUES (?, ?)";
  db.query(sql, [status_name, added_by], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Status added successfully.", id: result.insertId });
  });
});

// PUT update a status 
router.put("/status/:id", authenticateToken, (req, res) => {
  const { status_name } = req.body;
  const { id } = req.params;

  if (!status_name) {
    return res.status(400).json({ error: "status_name is required." });
  }

  const sql = "UPDATE status_master SET status_name = ? WHERE status_id = ?";
  db.query(sql, [status_name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Status updated successfully." });
  });
});

// PUT soft delete a status 
router.put("/status/delete/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE status_master SET status = 0 WHERE status_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Status soft deleted." });
  });
});

module.exports = router;
