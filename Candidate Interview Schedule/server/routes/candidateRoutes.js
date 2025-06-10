const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const router = express.Router();

const upload = require("../middlewares/uploads");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { log } = require("console");
const { callbackify } = require("util");
const { validateHeaderValue } = require("http");
const { ifError } = require("assert");

// Helper function to handle file upload
const handleFileUpload = (file, uploadDir) => {
  if (!file) return null;

  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext);
  const uniqueName = `${base}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${ext}`;
  const fullPath = path.join(uploadDir, uniqueName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(fullPath, file.buffer);
  return uniqueName;
};

// Add Candidate Details
router.post(
  "/candidates",
  authenticateToken,
  upload.single("resume"),
  (req, res) => {
    const requiredFields = ["name", "email", "phone", "location"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing: ${missingFields.join(", ")}` });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const uploadDir = path.join(__dirname, "../uploads/Resume");
    const resumePath = handleFileUpload(req.file, uploadDir);
    const {
      name,
      email,
      phone,
      gender,
      location,
      education,
      passoutYear,
      cgpa,
      source,
      expectedCtc,
      jobPosition,
      hasExperience,
      currentCompanyExperience,
      companyName,
      designation,
      currentCtc,
      noticePeriod,
      totalExperience,
      interviewDate,
      interviewTime,
      interviewMode,
      roundType,
      status = "Pending",
      remark,
      interviewerName,
      feedback,
    } = req.body;

    const added_by = req.user.username;

    // 1. Check for duplicate
    db.query(
      `SELECT id FROM Candidate_Master WHERE email = ? OR phone = ? LIMIT 1`,
      [email, phone],
      (err, dupResults) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ message: "DB error" });
        }

        if (dupResults.length > 0) {
          fs.unlink(path.join(uploadDir, resumePath), () => {});
          return res
            .status(409)
            .json({ message: "Candidate with email/phone exists" });
        }

        // 2. Check or Insert Location
        db.query(
          `SELECT id FROM Location_Master WHERE location_name = ? LIMIT 1`,
          [location],
          (err, locResults) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "DB error while checking location" });
            }

            const insertCandidate = (locationId) => {
              // 3. Insert Candidate
              db.query(
                `INSERT INTO Candidate_Master (
                  name, email, phone, gender, location, location_id, education, passoutYear, cgpa,
                  source, expectedCtc, jobPosition, hasExperience, currentCompanyExperience,
                  companyName, designation, currentCtc, noticePeriod, totalExperience,
                  interviewDate, interviewTime, interviewMode, roundType, status, remark,
                  interviewerName, feedback, resumePath, added_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  name,
                  email,
                  phone,
                  gender,
                  location,
                  locationId,
                  education,
                  passoutYear,
                  cgpa,
                  source || null,
                  expectedCtc || null,
                  jobPosition || null,
                  hasExperience === "true" ? 1 : 0,
                  currentCompanyExperience || null,
                  companyName || null,
                  designation || null,
                  currentCtc || null,
                  noticePeriod || null,
                  totalExperience || null,
                  interviewDate || null,
                  interviewTime || null,
                  interviewMode || null,
                  roundType || null,
                  status,
                  remark || null,
                  interviewerName || null,
                  feedback || null,
                  resumePath,
                  added_by,
                ],
                (err, result) => {
                  if (err) {
                    fs.unlink(path.join(uploadDir, resumePath), () => {});
                    return res
                      .status(500)
                      .json({ message: "DB error during insert", error: err });
                  }

                  res.status(201).json({
                    message: "Candidate added successfully",
                    candidateId: result.insertId,
                  });
                }
              );
            };

            // Insert location if not found
            if (locResults.length === 0) {
              db.query(
                `INSERT INTO Location_Master (location_name, added_by) VALUES (?, ?)`,
                [location, added_by],
                (err, insertLocRes) => {
                  if (err) {
                    return res.status(500).json({
                      message: "DB error while inserting location",
                    });
                  }
                  insertCandidate(insertLocRes.insertId);
                }
              );
            } else {
              insertCandidate(locResults[0].id);
            }
          }
        );
      }
    );
  }
);

// Add a new route to fetch locations
router.get("/locations", (req, res) => {
  db.execute(
    "SELECT id, location_name FROM Location_Master ORDER BY location_name",
    (err, results) => {
      if (err) {
        console.error("Error fetching locations:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    }
  );
});

// Bulk upload candidates and locations
router.post("/candidates/bulk", authenticateToken, async (req, res) => {
  try {
    const { candidates } = req.body;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: "No candidate data provided" });
    }

    const added_by = req.user.username;
    const errors = [];
    let successCount = 0;

    for (const [index, row] of candidates.entries()) {
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        const {
          name,
          email,
          phone,
          gender,
          location,
          education,
          passoutYear,
          cgpa,
          source,
          expectedCtc,
          jobPosition,
          hasExperience,
          currentCompanyExperience,
          companyName,
          designation,
          currentCtc,
          noticePeriod,
          totalExperience,
          interviewDate,
          interviewTime,
          interviewMode,
          roundType,
          status = "Pending",
          remark,
          interviewerName,
          feedback,
        } = row;

        // Required field checks
        if (!name || !email || !phone ) {
          errors.push({
            row: index + 1,
            name: name || "",
            email: email || "",
            phone: phone || "",
            error: "Missing required fields",
          });
          continue;
        }

        // Validate formats
        if (!emailRegex.test(email)) {
          errors.push({ row: index + 1, email, error: "Invalid email format" });
          continue;
        }
        if (!phoneRegex.test(phone)) {
          errors.push({ row: index + 1, phone, error: "Invalid phone number" });
          continue;
        }

        // Check for duplicate candidate
        const [dupResults] = await db
          .promise()
          .execute(
            `SELECT id FROM Candidate_Master WHERE email = ? OR phone = ? LIMIT 1`,
            [email, phone]
          );

        if (dupResults.length > 0) {
          errors.push({
            row: index + 1,
            email,
            phone,
            error: "Candidate with email/phone already exists",
          });
          continue;
        }

        // Check or insert location
        const trimmedLocation = location.trim();
        let locationId;

        const [locResults] = await db
          .promise()
          .execute(
            `SELECT id FROM Location_Master WHERE LOWER(location_name) = LOWER(?) LIMIT 1`,
            [trimmedLocation]
          );

        if (locResults.length > 0) {
          locationId = locResults[0].id;
        } else {
          const [insertLoc] = await db
            .promise()
            .execute(
              `INSERT INTO Location_Master (location_name, added_by) VALUES (?, ?)`,
              [trimmedLocation, added_by]
            );
          locationId = insertLoc.insertId;
        }

        // Insert into Candidate_Master
        await db.promise().execute(
          `INSERT INTO Candidate_Master (
            name, email, phone, gender, location, location_id, education, passoutYear, cgpa,
            source, expectedCtc, jobPosition, hasExperience, currentCompanyExperience,
            companyName, designation, currentCtc, noticePeriod, totalExperience,
            interviewDate, interviewTime, interviewMode, roundType, status, remark,
            interviewerName, feedback, added_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name,
            email,
            phone,
            gender,
            trimmedLocation,
            locationId,
            education || null,
            passoutYear || null,
            cgpa || null,
            source || null,
            expectedCtc || null,
            jobPosition || null,
            hasExperience === true || hasExperience === "true" ? 1 : 0,
            currentCompanyExperience || null,
            companyName || null,
            designation || null,
            currentCtc || null,
            noticePeriod || null,
            totalExperience || null,
            interviewDate || null,
            interviewTime || null,
            interviewMode || null,
            roundType || null,
            status,
            remark || null,
            interviewerName || null,
            feedback || null,
            added_by,
          ]
        );

        successCount++;
      } catch (err) {
        errors.push({
          row: index + 1,
          name: row.name,
          email: row.email,
          phone: row.phone,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      message: `Bulk upload completed with ${successCount} success and ${errors.length} failed.`,
      successCount,
      errorCount: errors.length,
      errors,
    });
  } catch (err) {
    console.error("Bulk Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// router.post(
//   "/candidates",
//   authenticateToken,
//   upload.single("resume"),
//   (req, res) => {
//     const requiredFields = ["name", "email", "phone"];
//     const missingFields = requiredFields.filter((field) => !req.body[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Resume file is required" });
//     }

//     const uploadDir = path.join(__dirname, "../uploads/Resume");
//     const resumePath = handleFileUpload(req.file, uploadDir);
//     if (!resumePath) {
//       return res.status(500).json({ message: "Error saving resume file" });
//     }
//     const normalize = (val, fallback = null) =>
//       val === "" || val === undefined ? fallback : val;
//     const {
//       name,
//       email,
//       phone,
//       gender,
//       location,
//       education,
//       passoutYear,
//       cgpa,
//       source,
//       expectedCtc,
//       jobPosition,
//       hasExperience,
//       currentCompanyExperience,
//       companyName,
//       designation,
//       currentCtc,
//       noticePeriod,
//       totalExperience,
//       interviewDate,
//       interviewTime,
//       interviewMode,
//       roundType,
//       status,
//       remark,
//       interviewerName,
//       feedback,
//     } = req.body;

//     const added_by = req.user.username;

//     // Check for duplicate candidate
//     db.execute(
//       `SELECT id FROM Candidate_Master WHERE email = ? OR phone = ? LIMIT 1`,
//       [email, phone],
//       (dupErr, dupResults) => {
//         if (dupErr) {
//           console.error("Duplicate Check Error:", dupErr);
//           return res
//             .status(500)
//             .json({ message: "Database error during duplicate check" });
//         }

//         if (dupResults.length > 0) {
//           fs.unlink(path.join(uploadDir, resumePath), () => {});
//           return res.status(409).json({
//             message: "Candidate with same email or phone already exists",
//           });
//         }

//         const sql = `
//         INSERT INTO Candidate_Master (
//           name, email, phone, gender, location, education, passoutYear, cgpa,
//           source, expectedCtc, jobPosition, hasExperience, currentCompanyExperience,
//           companyName, designation, currentCtc, noticePeriod, totalExperience,
//           interviewDate, interviewTime, interviewMode, roundType, status, remark,
//           interviewerName, feedback, resumePath, added_by
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//         const values = [
//           name,
//           email,
//           phone,
//           gender,
//           location,
//           education,
//           passoutYear,
//           cgpa,
//           normalize(source),
//           normalize(expectedCtc),
//           normalize(jobPosition),
//           hasExperience === "true" || hasExperience === true ? 1 : 0,
//           normalize(currentCompanyExperience),
//           normalize(companyName),
//           normalize(designation),
//           normalize(currentCtc),
//           normalize(noticePeriod),
//           normalize(totalExperience),
//           normalize(interviewDate),
//           normalize(interviewTime),
//           normalize(interviewMode),
//           normalize(roundType),
//           normalize(status, "Pending"), 
//           normalize(remark),
//           normalize(interviewerName),
//           normalize(feedback),
//           resumePath,
//           added_by,
//         ];

//         db.execute(sql, values, (err, results) => {
//           if (err) {
//             console.error("DB Insert Error:", err);
//             fs.unlink(path.join(uploadDir, resumePath), () => {});
//             return res
//               .status(500)
//               .json({ message: "Database error", error: err.message });
//           }
//           res.status(201).json({
//             message: "Candidate added successfully",
//             candidateId: results.insertId,
//           });
//         });
//       }
//     );
//   }
// );

// Bulk upload candidates from Excel
// router.post("/candidates/bulk", authenticateToken, async (req, res) => {
//   try {
//     const { candidates } = req.body;

//     if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
//       return res.status(400).json({ message: "No candidate data provided" });
//     }

//     const added_by = req.user.username;
//     const validCandidates = [];
//     const errors = [];

//     for (const [index, row] of candidates.entries()) {
//       try {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^[6-9]\d{9}$/;

//         if (!row.name || !row.email || !row.phone) {
//           errors.push({
//             row: index + 1,
//             name: row.name || "",
//             email: row.email || "",
//             phone: row.phone || "",
//             error: "Missing required fields",
//           });
//           continue;
//         }
//         if (!emailRegex.test(row.email)) {
//           errors.push({
//             row: index + 1,
//             name: row.name,
//             email: row.email,
//             phone: row.phone,
//             error: "Invalid email format",
//           });
//           continue;
//         }

//         if (!phoneRegex.test(row.phone)) {
//           errors.push({
//             row: index + 1,
//             name: row.name,
//             email: row.email,
//             phone: row.phone,
//             error: "Invalid phone number (must be 10 digits starting with 6-9)",
//           });
//           continue;
//         }

//         const [dupResults] = await db
//           .promise()
//           .execute(
//             `SELECT id FROM Candidate_Master WHERE email = ? OR phone = ? LIMIT 1`,
//             [row.email, row.phone]
//           );

//         if (dupResults.length > 0) {
//           errors.push({
//             row: index + 1,
//             name: row.name,
//             email: row.email,
//             phone: row.phone,
//             error: "Duplicate candidate",
//           });
//           continue;
//         }

//         validCandidates.push([
//           row.name,
//           row.email,
//           row.phone,
//           row.gender,
//           row.location,
//           row.education,
//           row.passoutYear,
//           row.cgpa,
//           row.source,
//           row.expectedCtc,
//           row.jobPosition,
//           row.hasExperience ? 1 : 0,
//           row.currentCompanyExperience,
//           row.companyName,
//           row.designation,
//           row.currentCtc,
//           row.noticePeriod,
//           row.totalExperience,
//           row.interviewDate,
//           row.interviewTime,
//           row.interviewMode,
//           row.roundType,
//           row.status,
//           row.remark,
//           row.interviewerName,
//           row.feedback,
//           added_by,
//         ]);
//       } catch (err) {
//         errors.push({
//           row: index + 1,
//           name: row.name,
//           email: row.email,
//           phone: row.phone,
//           error: err.message,
//         });
//       }
//     }
//     let successCount = 0;
//     if (validCandidates.length > 0) {
//       for (const candidate of validCandidates) {
//         try {
//           await db.promise().execute(
//           `INSERT INTO Candidate_Master (
//         name, email, phone, gender, location, education, passoutYear, cgpa,
//         source, expectedCtc, jobPosition, hasExperience, currentCompanyExperience,
//         companyName, designation, currentCtc, noticePeriod, totalExperience,
//         interviewDate, interviewTime, interviewMode, roundType, status, remark,
//         interviewerName, feedback, added_by
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [...candidate]
//           );
//           successCount++;
//         } catch (err) {
//           errors.push({
//             name: candidate[0],
//             email: candidate[1],
//             phone: candidate[2],
//             error: err.message,
//           });
//         }
//       }
//     }

//     res.status(201).json({
//       message: `Bulk upload completed with ${validCandidates.length} success and ${errors.length} failed.`,
//       successCount: validCandidates.length,
//       errorCount: errors.length,
//       errors,
//     });
//   } catch (err) {
//     console.error("Bulk Upload Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

//Get All Candidates

router.get("/candidates", (req, res) => {
  let { page = 1, limit = 10, status, search, all, jobPosition, locations, experience, education } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  let whereClause = "WHERE delete_status = 1";
  let values = [];

  // Add search filter
  if (search) {
    whereClause += " AND (name LIKE ? OR email LIKE ?)";
    const searchTerm = `%${search}%`;
    values.push(searchTerm, searchTerm);
  }
  
  // Add status filter
  if (status) {
    whereClause += " AND status = ?";
    values.push(status);
  }

  // Add job position filter
  if (jobPosition) {
    whereClause += " AND jobPosition = ?";
    values.push(jobPosition);
  }

  // Add location filter
  if (locations) {
    let locationIds;
    try {
      // Handle both string (comma-separated) and array formats
      locationIds = Array.isArray(locations) 
        ? locations.map(id => parseInt(id))
        : locations.split(',').map(id => parseInt(id));
      
      // Remove any NaN values that might have resulted from invalid inputs
      locationIds = locationIds.filter(id => !isNaN(id));

      if (locationIds.length > 0) {
        whereClause += " AND location_id IN (?)";
        values.push(locationIds);
      }
    } catch (err) {
      console.error("Error processing locations:", err);
      // Continue without location filter if there's an error
    }
  }

  // Add experience filter
  if (experience) {
    whereClause += " AND totalExperience >= ?";
    values.push(parseInt(experience));
  }

  // Add education filter
  if (education) {
    whereClause += " AND education LIKE ?";
    values.push(`%${education}%`);
  }

  // Modify query based on 'all' parameter
  let dataQuery = `
    SELECT * FROM candidate_master
    ${whereClause}
    ORDER BY id DESC
  `;

  // If not requesting all data, add pagination
  if (!all) {
    dataQuery += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);
  }

  const countQuery = `
    SELECT COUNT(*) AS count FROM candidate_master
    ${whereClause}
  `;

  const statusCountQuery = `
    SELECT status, COUNT(*) AS count
    FROM candidate_master
    WHERE delete_status = 1
    GROUP BY status
  `;

  db.query(dataQuery, values, (err, candidates) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      return res.status(500).json({ message: "Database error" });
    }

    db.query(countQuery, values, (err, countResult) => {
      if (err) {
        console.error("Error counting candidates:", err);
        return res.status(500).json({ message: "Database count error" });
      }

      const total = countResult[0].count;
      const totalPages = all ? 1 : Math.ceil(total / limit);

      // Get full status counts
      db.query(statusCountQuery, (err, statusCountsResult) => {
        if (err) {
          console.error("Error fetching status counts:", err);
          return res.status(500).json({ message: "Status count error" });
        }
        
        // Format counts
        const statusCounts = {};
        statusCountsResult.forEach((row) => {
          statusCounts[row.status] = row.count;
        });

        res.status(200).json({
          data: candidates,
          total,
          page: all ? 1 : page,
          totalPages,
          statusCounts,
        });
      });
    });
  });
});

// router.get("/candidates", (req, res) => {
//   let { page = 1, limit = 10, status, search, all } = req.query;
//   page = parseInt(page);
//   limit = parseInt(limit);
//   const offset = (page - 1) * limit;

//   let whereClause = "WHERE delete_status = 1";
//   let values = [];

//   if (search) {
//     whereClause += " AND (name LIKE ? OR email LIKE ?)";
//     const searchTerm = `%${search}%`;
//     values.push(searchTerm, searchTerm);
//   }

//   if (status) {
//     whereClause += " AND status = ?";
//     values.push(status);
//   }

//   const dataQuery = all === 'true'
//     ? `SELECT * FROM candidate_master ${whereClause} ORDER BY id DESC`
//     : `SELECT * FROM candidate_master ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;

//   const countQuery = `SELECT COUNT(*) AS count FROM candidate_master ${whereClause}`;

//   const statusCountQuery = `
//     SELECT status, COUNT(*) AS count
//     FROM candidate_master
//     WHERE delete_status = 1
//     GROUP BY status
//   `;

//   db.query(dataQuery, all === 'true' ? values : [...values, limit, offset], (err, candidates) => {
//     if (err) {
//       console.error("Error fetching candidates:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (all === 'true') {
//       return res.status(200).json({ data: candidates });
//     }

//     db.query(countQuery, values, (err, countResult) => {
//       if (err) {
//         console.error("Error counting candidates:", err);
//         return res.status(500).json({ message: "Database count error" });
//       }

//       const total = countResult[0].count;
//       const totalPages = Math.ceil(total / limit);

//       db.query(statusCountQuery, (err, statusCountsResult) => {
//         if (err) {
//           console.error("Error fetching status counts:", err);
//           return res.status(500).json({ message: "Status count error" });
//         }

//         const statusCounts = {};
//         statusCountsResult.forEach((row) => {
//           statusCounts[row.status] = row.count;
//         });

//         res.status(200).json({
//           data: candidates,
//           total,
//           page,
//           totalPages,
//           statusCounts,
//         });
//       });
//     });
//   });
// });


//Count Candidates
router.get("/candidates/count", (req, res) => {
  const query = `
    SELECT MONTH(added_on) AS month_number,
    DATE_FORMAT(MIN(added_on), '%M') AS month,
    COUNT(*) AS count
    FROM candidate_interviews.candidate_master
    WHERE YEAR(added_on) = YEAR(CURDATE())
    GROUP BY MONTH(added_on)
    ORDER BY MONTH(added_on)
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching candidate count by month:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Update candidates Details
router.put(
  "/candidates/:id",
  authenticateToken,
  upload.single("resume"),
  (req, res) => {
    const candidateId = req.params.id;
    const uploadDir = path.join(__dirname, "../uploads/Resume");
    let resumePath = req.body.resumePath;

    const emptyToNull = (value) => {
      return value === "" ||
        value === "null" ||
        value === null ||
        value === undefined
        ? null
        : value;
    };

    db.execute(
      `SELECT resumePath FROM Candidate_Master WHERE id = ?`,
      [candidateId],
      (fetchErr, fetchResults) => {
        if (fetchErr) {
          console.error("DB Fetch Error:", fetchErr);
          return res
            .status(500)
            .json({ message: "Error fetching candidate data" });
        }

        if (fetchResults.length === 0) {
          return res.status(404).json({ message: "Candidate not found" });
        }

        const oldResumePath = fetchResults[0].resumePath;

        // Handle new file upload if present
        if (req.file) {
          try {
            // Delete old resume file if it exists
            if (oldResumePath) {
              const oldFullPath = path.join(uploadDir, oldResumePath);
              if (fs.existsSync(oldFullPath)) {
                fs.unlinkSync(oldFullPath);
              }
            }

            // Upload new resume file
            resumePath = handleFileUpload(req.file, uploadDir);
            if (!resumePath) {
              throw new Error("Failed to upload new resume");
            }
          } catch (err) {
            console.error("File Update Error:", err);
            return res
              .status(500)
              .json({ message: "Error updating resume file" });
          }
        }

        // Process all fields with emptyToNull conversion
        const {
          name,
          email,
          phone,
          gender,
          location,
          education,
          passoutYear,
          cgpa,
          source,
          expectedCtc,
          jobPosition,
          hasExperience,
          currentCompanyExperience,
          companyName,
          designation,
          currentCtc,
          noticePeriod,
          totalExperience,
          interviewDate,
          interviewTime,
          interviewMode,
          roundType,
          status,
          remark,
          interviewerName,
          feedback,
        } = req.body;
        const added_by = req.user.username;
        const formatDateForDB = (dateString) => {
          if (!dateString) return null;
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              return null;
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          } catch (e) {
            console.error("Date formatting error:", e);
            return null;
          }
        };

        const formattedInterviewDate = formatDateForDB(interviewDate);

        const sql = `
                UPDATE Candidate_Master SET
                    name = ?, email = ?, phone = ?, gender = ?, location = ?,
                    education = ?, passoutYear = ?, cgpa = ?, source = ?, expectedCtc = ?,
                    jobPosition = ?, hasExperience = ?, currentCompanyExperience = ?,
                    companyName = ?, designation = ?, currentCtc = ?, noticePeriod = ?,
                    totalExperience = ?, interviewDate = ?, interviewTime = ?, interviewMode = ?,
                    roundType = ?, status = ?, remark = ?, interviewerName = ?, feedback = ?,
                    resumePath = ?, added_by = ?
                WHERE id = ?
            `;

        const values = [
          emptyToNull(name),
          emptyToNull(email),
          emptyToNull(phone),
          emptyToNull(gender),
          emptyToNull(location),
          emptyToNull(education),
          emptyToNull(passoutYear),
          emptyToNull(cgpa),
          emptyToNull(source),
          emptyToNull(expectedCtc),
          emptyToNull(jobPosition),
          hasExperience === "true" || hasExperience === true ? 1 : 0,
          emptyToNull(currentCompanyExperience),
          emptyToNull(companyName),
          emptyToNull(designation),
          emptyToNull(currentCtc),
          emptyToNull(noticePeriod),
          emptyToNull(totalExperience),
          formattedInterviewDate,
          emptyToNull(interviewTime),
          emptyToNull(interviewMode),
          emptyToNull(roundType),
          emptyToNull(status),
          emptyToNull(remark),
          emptyToNull(interviewerName),
          emptyToNull(feedback),
          emptyToNull(resumePath),
          added_by,
          candidateId,
        ];
        db.execute(sql, values, (err, results) => {
          if (err) {
            console.error("DB Update Error:", err);
            // Clean up newly uploaded file if update failed
            if (req.file && resumePath) {
              fs.unlink(path.join(uploadDir, resumePath), () => {});
            }
            return res
              .status(500)
              .json({ message: "Error updating candidate" });
          }

          res.json({
            message: "Candidate updated successfully",
            candidateId: candidateId,
          });
        });
      }
    );
  }
);

// Update candidate status
router.put("/candidates/:id/status", async (req, res) => {
  const candidateId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  db.query(
    "UPDATE Candidate_Master SET status = ? WHERE id = ?",
    [status, candidateId],
    (err, result) => {
      if (err) {
        console.error("Error updating candidate status:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.json({ message: "Status updated successfully" });
    }
  );
});

// Soft Delete candidate mens Candidate delete_Status = 0 (Active and Inactive)
router.put("/candidates/delete/:id", (req, res) => {
  const candidateId = req.params.id;
  const sql = "UPDATE candidate_master SET delete_status = 0 WHERE id = ?";
  db.query(sql, [candidateId], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.status(200).json({ message: "Deleted successfully" });
  });
});

module.exports = router;
