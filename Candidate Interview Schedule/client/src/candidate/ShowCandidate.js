// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import Spinner from "../components/spinner/Spinner";
// import {
//   Button,
//   Dropdown,
//   Alert,
//   Container,
//   Table,
//   Form,
//   Modal,
//   Row,
//   Col,
//   InputGroup,
// } from "react-bootstrap";
// import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import { FaDownload, FaFileExcel } from "react-icons/fa";

// const ShowCandidate = () => {
//   const navigate = useNavigate();
//   const [candidates, setCandidates] = useState([]);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [updatedStatus, setUpdatedStatus] = useState("");
//   const [search, setSearch] = useState("");
//   const [statusStages, setStatusStages] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({});
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [message, setMessage] = useState("");
//   const [variant, setVariant] = useState("success");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [jobPositions, setJobPositions] = useState([]);

//   const filteredCandidates = useMemo(() => {
//     let result = [...candidates];
//     if (search) {
//       result = result.filter(
//         (c) =>
//           c.name?.toLowerCase().includes(search.toLowerCase()) ||
//           c.email?.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     if (selectedStatus) {
//       result = result.filter((c) => c.status === selectedStatus);
//     }
//     return result;
//   }, [candidates, search, selectedStatus]);

//   const fetchStatuses = async () => {
//     try {
//       const res = await api.get("/status");
//       const statuses = res.data.data.map((s) => s.status_name);
//       setStatusStages(statuses);
//       const initialCounts = {};
//       statuses.forEach((status) => {
//         initialCounts[status] = 0;
//       });
//       setStatusCounts(initialCounts);
//     } catch (err) {
//       console.error("Failed to fetch statuses", err);
//       setMessage("Failed to load status stages");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const fetchCandidates = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/candidates", {
//         params: {
//           page: currentPage,
//           limit: pageSize,
//           search,
//           status: selectedStatus,
//         },
//       });
//       console.log(data);

//       setCandidates(data.data || data);
//       setTotalPages(data.totalPages || 1);

//       if (data.statusCounts) {
//         setStatusCounts(data.statusCounts);
//       } else {
//         const counts = (data.data || data).reduce((acc, c) => {
//           acc[c.status] = (acc[c.status] || 0) + 1;
//           return acc;
//         }, {});
//         statusStages.forEach((status) => {
//           counts[status] = counts[status] || 0;
//         });
//         setStatusCounts(counts);
//       }
//     } catch (err) {
//       console.error("Error fetching candidates:", err);
//       setError("Failed to load candidates");
//       setMessage("Failed to load candidates. Please try again.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, pageSize, selectedStatus, statusStages]);

//   const handleStatusClick = (status) => {
//     setSelectedStatus((prev) => (prev === status ? "" : status));
//     setCurrentPage(1);
//   };
// const submitStatusChange = async (candidateId) => {
//     try {
//       await api.put(`/candidates/${candidateId}/status`, {
//         status: updatedStatus,
//       });
//       setEditingStatusId(null);
//       fetchCandidates();
//       setMessage("Status updated successfully");
//       setVariant("success");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setMessage("Failed to update status");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

// const handleDelete = async (candidateId) => {
//   const result = await Swal.fire({
//     title: 'Are you sure?',
//     text: 'Do you really want to delete this candidate?',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//     confirmButtonText: 'Yes, delete it!',
//     cancelButtonText: 'Cancel',
//   });

//   if (result.isConfirmed) {
//     try {
//       await api.put(`/candidates/delete/${candidateId}`);
//       setMessage("Candidate deleted successfully");
//       setVariant("success");
//       fetchCandidates();
//       setTimeout(() => setMessage(""), 3000);

//       Swal.fire({
//         title: 'Deleted!',
//         text: 'Candidate has been deleted.',
//         icon: 'success',
//         timer: 2000,
//         showConfirmButton: false
//       });
//     } catch (error) {
//       setMessage("Delete failed. Please try again.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);

//       Swal.fire({
//         title: 'Error!',
//         text: 'Failed to delete the candidate.',
//         icon: 'error',
//         timer: 2000,
//         showConfirmButton: false
//       });
//     }
//   }
// };

//   const fetchJobPositions = async () => {
//     try {
//       const { data } = await api.get("/jobposition");
//       setJobPositions(data);
//     } catch (error) {
//       console.error("Failed to fetch job positions", error);
//       setMessage("Failed to load job positions");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };
// //  const exportToExcel = () => {
// //     // Prepare data for export
// //     const dataToExport = filteredCandidates.map(candidate => ({
// //       Name: candidate.name,
// //       Email: candidate.email,
// //       Phone: candidate.phone,
// //       Gender: candidate.gender,
// //       Location: candidate.location,
// //       Education: candidate.education,
// //       "Passout Year": candidate.passoutYear,
// //       "CGPA/Marks": candidate.cgpa,
// //       "Job Position": candidate.jobPosition,
// //       Source: candidate.source ,
// //       "Expected CTC": candidate.expectedCtc ,
// //       "Has Experience": candidate.hasExperience ? 'Yes' : 'No',
// //       "Current Company Experience": candidate.currentCompanyExperience,
// //       "Company Name": candidate.companyName,
// //       Designation: candidate.designation,
// //       "Current CTC": candidate.currentCtc,
// //       "Notice Period": candidate.noticePeriod,
// //       "Total Experience": candidate.totalExperience,
// //       "Interview Date": candidate.interviewDate? new Date(candidate.interviewDate).toLocaleDateString(): "",
// //       "Interview Time": candidate.interviewTime,
// //       "Interview Mode": candidate.interviewMode,
// //       "Round Type": candidate.roundType,
// //       Status: candidate.status,
// //       Remark: candidate.remark,
// //       "Interviewer Name": candidate.interviewerName,
// //       Feedback: candidate.feedback
// //       // 'Resume Available': candidate.resumePath ? 'Yes' : 'No'
// //     }));

// //     // Create workbook and worksheet
// //     const wb = XLSX.utils.book_new();
// //     const ws = XLSX.utils.json_to_sheet(dataToExport);

// //     // Add worksheet to workbook
// //     XLSX.utils.book_append_sheet(wb, ws, "Candidates");

// //     // Generate Excel file and download
// //     XLSX.writeFile(wb, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
// //   };

// const exportToExcel = async () => {
//   try {
//     const { data } = await api.get("/candidates", {
//       params: {
//         all: true, // tell backend to skip pagination
//         search,
//         status: selectedStatus,
//       },
//     });

//     const candidatesToExport = data.data || data;

//     const dataToExport = candidatesToExport.map(candidate => ({
//       Name: candidate.name,
//       Email: candidate.email,
//       Phone: candidate.phone,
//       Gender: candidate.gender,
//       Location: candidate.location,
//       Education: candidate.education,
//       "Passout Year": candidate.passoutYear,
//       "CGPA/Marks": candidate.cgpa,
//       "Job Position": candidate.jobPosition,
//       Source: candidate.source,
//       "Expected CTC": candidate.expectedCtc,
//       "Has Experience": candidate.hasExperience ? 'Yes' : 'No',
//       "Current Company Experience": candidate.currentCompanyExperience,
//       "Company Name": candidate.companyName,
//       Designation: candidate.designation,
//       "Current CTC": candidate.currentCtc,
//       "Notice Period": candidate.noticePeriod,
//       "Total Experience": candidate.totalExperience,
//       "Interview Date": candidate.interviewDate ? new Date(candidate.interviewDate).toLocaleDateString() : "",
//       "Interview Time": candidate.interviewTime,
//       "Interview Mode": candidate.interviewMode,
//       "Round Type": candidate.roundType,
//       Status: candidate.status,
//       Remark: candidate.remark,
//       "Interviewer Name": candidate.interviewerName,
//       Feedback: candidate.feedback,
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(dataToExport);
//     XLSX.utils.book_append_sheet(wb, ws, "Candidates");
//     XLSX.writeFile(wb, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
//   } catch (err) {
//     console.error("Error exporting candidates:", err);
//   }
// };

//   useEffect(() => {
//     fetchStatuses();
//     fetchJobPositions();
//   }, []);

//   useEffect(() => {
//     if (statusStages.length > 0) {
//       fetchCandidates();
//     }
//   }, [statusStages, currentPage, pageSize, selectedStatus, fetchCandidates]);

//   if (loading)
//     return (
//       <div className="text-center mt-4">
//         <Spinner />
//       </div>
//     );

//   return (
//     <Container className="mt-3">
//       {message && (
//         <Alert variant={variant} onClose={() => setMessage("")} dismissible>
//           {message}
//         </Alert>
//       )}

//       <div className="d-flex justify-content-end align-items-center mb-3 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search by name or email"
//             className="form-control"
//             style={{ maxWidth: "200px" }}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <Button
//             variant="success"
//             onClick={exportToExcel}
//             className="d-flex align-items-center gap-1"
//           >
//             <FaFileExcel /><FaDownload />
//           </Button>
//           <Button variant="primary" onClick={() => navigate("/add-candidate")}>
//             Add
//           </Button>
//         </div>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
//         <h5 className="mb-0">Candidate Stages</h5>
//       </div>

//       <div className="card mb-3">
//         <div className="d-flex justify-content-between text-center flex-wrap bg-light">
//           {statusStages.map((status) => (
//             <div
//               key={status}
//               className={`flex-fill py-2 rounded ${
//                 selectedStatus === status ? "bg-primary text-white" : "bg-light"
//               }`}
//               style={{
//                 minWidth: "100px",
//                 borderRight: "1px solid #eee",
//                 cursor: "pointer",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//               onClick={() => handleStatusClick(status)}
//             >
//               <div className="fw-bold fs-5">{statusCounts[status] || 0}</div>
//               <div
//                 className={
//                   selectedStatus === status ? "text-white" : "text-muted"
//                 }
//               >
//                 {status}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Table striped bordered hover responsive className="align-middle">
//         <thead className="table-light">
//           <tr>
//             <th>Name</th>
//             <th className="d-none d-sm-table-cell">Email</th>
//             <th className="d-none d-md-table-cell">Phone</th>
//             <th className="d-none d-lg-table-cell">Location</th>
//             <th className="d-none d-lg-table-cell">Education</th>
//             <th className="d-none d-md-table-cell">Position</th>
//             <th className="d-none d-md-table-cell">Resume</th>
//             <th>Status</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredCandidates.length === 0 ? (
//             <tr>
//               <td colSpan="9" className="text-center py-5">
//                 <h5>No candidates found</h5>
//                 <p>Try adjusting your search or filters</p>
//               </td>
//             </tr>
//           ) : (
//             filteredCandidates.map((candidate) => (
//               <tr key={candidate.id}>
//                 <td>{candidate.name}</td>
//                 <td className="d-none d-sm-table-cell">{candidate.email}</td>
//                 <td className="d-none d-md-table-cell">{candidate.phone}</td>
//                 <td className="d-none d-lg-table-cell">{candidate.location}</td>
//                 <td className="d-none d-lg-table-cell">
//                   {candidate.education}
//                 </td>
//                 <td className="d-none d-md-table-cell">
//                   {candidate.jobPosition}
//                 </td>
//                 <td className="d-none d-md-table-cell">
//                   {candidate.resumePath ? (
//                     <a
//                       href={`http://localhost:5000/uploads/Resume/${candidate.resumePath}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="btn btn-sm btn-outline-primary"
//                     >
//                       View
//                     </a>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>
//                   {editingStatusId === candidate.id ? (
//                     <select
//                       className="form-select form-select-sm"
//                       value={updatedStatus}
//                       onChange={(e) => setUpdatedStatus(e.target.value)}
//                       onBlur={() => submitStatusChange(candidate.id)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") submitStatusChange(candidate.id);
//                       }}
//                       autoFocus
//                     >
//                       {statusStages.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   ) : (
//                     <span
//                       onClick={() => {
//                         setEditingStatusId(candidate.id);
//                         setUpdatedStatus(candidate.status);
//                       }}
//                       className="badge bg-secondary"
//                       style={{ cursor: "pointer" }}
//                     >
//                       {candidate.status}
//                     </span>
//                   )}
//                 </td>
//                 <td className="text-center" style={{ minWidth: "100px" }}>
//                   <Dropdown align="end">
//                     <Dropdown.Toggle
//                       as="span"
//                       style={{ cursor: "pointer" }}
//                       id={`dropdown-${candidate.id}`}
//                     >
//                       <HiDotsVertical />
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item
//                         onClick={() =>
//                           // navigate("/add-candidate", { state: { candidate } })
//                           navigate(`/update-candidate/${candidate.id}`, { state: { candidate } })
//                         }
//                       >
//                         <HiPencil className="me-2" />
//                         Edit
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => handleDelete(candidate.id)}>
//                         <HiTrash className="me-2" />
//                         Delete
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </Table>

//       <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//         <div>
//           <label className="me-2">Show per page:</label>
//           <Form.Select
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             style={{ width: "auto", display: "inline-block" }}
//             size="sm"
//           >
//             {[10, 25, 50, 100].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </Form.Select>
//         </div>
//         <div>
//           <Button
//             variant="outline-secondary"
//             size="sm"
//             className="me-2"
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             variant="outline-secondary"
//             size="sm"
//             className="ms-2"
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages || totalPages === 0}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default ShowCandidate;

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import Spinner from "../components/spinner/Spinner";
// import {
//   Button,
//   Dropdown,
//   Alert,
//   Container,
//   Form,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import { HiDotsVertical, HiPencil, HiTrash, HiFilter } from "react-icons/hi";
// import {
//   FaDownload,
//   FaFileExcel,
//   FaFilePdf,
//   FaTable,
//   FaThList,
//   FaTh,
// } from "react-icons/fa";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import { DataGrid } from "react-data-grid";
// import "react-data-grid/lib/styles.css";

// const ShowCandidate = () => {
//   const navigate = useNavigate();
//   const [candidates, setCandidates] = useState([]);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [updatedStatus, setUpdatedStatus] = useState("");
//   const [search, setSearch] = useState("");
//   const [statusStages, setStatusStages] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({});
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [message, setMessage] = useState("");
//   const [variant, setVariant] = useState("success");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [jobPositions, setJobPositions] = useState([]);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState("NONE");
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [filterToggle, setFilterToggle] = useState(false);

//   const [filters, setFilters] = useState({
//     jobPosition: "",
//     location: "",
//     experience: "",
//     education: "",
//   });

//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({ ...prev, [filterName]: value }));
//     setCurrentPage(1); // Reset to first page when filters change
//   };

//   const toggleFilter = () => {
//     setFilterToggle(!filterToggle);
//   };

//   const fetchStatuses = async () => {
//     try {
//       const res = await api.get("/status");
//       const statuses = res.data.data.map((s) => s.status_name);
//       setStatusStages(statuses);
//       const initialCounts = {};
//       statuses.forEach((status) => {
//         initialCounts[status] = 0;
//       });
//       setStatusCounts(initialCounts);
//     } catch (err) {
//       console.error("Failed to fetch statuses", err);
//       setMessage("Failed to load status stages");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const fetchCandidates = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/candidates", {
//         params: {
//           page: currentPage,
//           limit: pageSize,
//           search,
//           status: selectedStatus,
//           jobPosition: filters.jobPosition,
//           location: filters.location,
//           experience: filters.experience,
//           education: filters.education
//         }
//       });

//       setCandidates(data.data);
//       setTotalPages(data.totalPages || 1);
//       setStatusCounts(data.statusCounts || {});
//     } catch (err) {
//       console.error("Error fetching candidates:", err);
//       setError("Failed to load candidates");
//       setMessage("Failed to load candidates. Please try again.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, pageSize, selectedStatus, search, filters]);

//   const handleStatusClick = (status) => {
//     setSelectedStatus((prev) => (prev === status ? "" : status));
//     setCurrentPage(1);
//   };

//   const submitStatusChange = async (candidateId) => {
//     try {
//       await api.put(`/candidates/${candidateId}/status`, {
//         status: updatedStatus,
//       });
//       setEditingStatusId(null);
//       fetchCandidates();
//       setMessage("Status updated successfully");
//       setVariant("success");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setMessage("Failed to update status");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const handleDelete = async (candidateId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you really want to delete this candidate?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       try {
//         await api.put(`/candidates/delete/${candidateId}`);
//         setMessage("Candidate deleted successfully");
//         setVariant("success");
//         fetchCandidates();
//         setTimeout(() => setMessage(""), 3000);

//         Swal.fire({
//           title: "Deleted!",
//           text: "Candidate has been deleted.",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       } catch (error) {
//         setMessage("Delete failed. Please try again.");
//         setVariant("danger");
//         setTimeout(() => setMessage(""), 3000);

//         Swal.fire({
//           title: "Error!",
//           text: "Failed to delete the candidate.",
//           icon: "error",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       }
//     }
//   };

//   const fetchJobPositions = async () => {
//     try {
//       const { data } = await api.get("/jobposition");
//       setJobPositions(Array.isArray(data) ? data : data?.data || []);
//     } catch (error) {
//       console.error("Failed to fetch job positions", error);
//       setJobPositions([]);
//       setMessage("Failed to load job positions");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const exportToExcel = async () => {
//     try {
//       const { data } = await api.get("/candidates", {
//         params: {
//           all: true,
//           search,
//           status: selectedStatus,
//           jobPosition: filters.jobPosition,
//           location: filters.location,
//           experience: filters.experience,
//           education: filters.education
//         }
//       });

//       const candidatesToExport = data.data || data;

//       const dataToExport = candidatesToExport.map((candidate) => ({
//         Name: candidate.name,
//         Email: candidate.email,
//         Phone: candidate.phone,
//         Gender: candidate.gender,
//         Location: candidate.location,
//         Education: candidate.education,
//         "Passout Year": candidate.passoutYear,
//         "CGPA/Marks": candidate.cgpa,
//         "Job Position": candidate.jobPosition,
//         Source: candidate.source,
//         "Expected CTC": candidate.expectedCtc,
//         "Has Experience": candidate.hasExperience ? "Yes" : "No",
//         "Current Company Experience": candidate.currentCompanyExperience,
//         "Company Name": candidate.companyName,
//         Designation: candidate.designation,
//         "Current CTC": candidate.currentCtc,
//         "Notice Period": candidate.noticePeriod,
//         "Total Experience": candidate.totalExperience,
//         "Interview Date": candidate.interviewDate
//           ? new Date(candidate.interviewDate).toLocaleDateString()
//           : "",
//         "Interview Time": candidate.interviewTime,
//         "Interview Mode": candidate.interviewMode,
//         "Round Type": candidate.roundType,
//         Status: candidate.status,
//         Remark: candidate.remark,
//         "Interviewer Name": candidate.interviewerName,
//         Feedback: candidate.feedback,
//       }));

//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet(dataToExport);
//       XLSX.utils.book_append_sheet(wb, ws, "Candidates");
//       XLSX.writeFile(
//         wb,
//         `candidates_${new Date().toISOString().split("T")[0]}.xlsx`
//       );
//     } catch (err) {
//       console.error("Error exporting candidates:", err);
//       setMessage("Failed to export data");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const columns = useMemo(() => {
//     const baseColumns = [
//       {
//         key: "name",
//         name: "Name",
//         resizable: true,
//         sortable: true,
//       },
//       {
//         key: "email",
//         name: "Email",
//         resizable: true,
//         sortable: true,
//       },
//       {
//         key: "phone",
//         name: "Phone",
//         resizable: true,
//         sortable: true,
//       },
//       {
//         key: "location",
//         name: "Location",
//         resizable: true,
//         sortable: true,
//       },
//       {
//         key: "jobPosition",
//         name: "Position",
//         resizable: true,
//         sortable: true,
//       },
//       {
//         key: "resumePath",
//         name: "Resume",
//         renderCell: ({ row }) => (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//             }}
//           >
//             {row.resumePath ? (
//               <Button
//                 variant="outline-primary"
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   window.open(
//                     `${api.defaults.baseURL}/uploads/Resume/${row.resumePath}`,
//                     "_blank"
//                   );
//                 }}
//                 style={{ minWidth: "60px" }}
//               >
//                 View
//               </Button>
//             ) : (
//               <span
//                 style={{
//                   color: "#888",
//                 }}
//               >
//                 N/A
//               </span>
//             )}
//           </div>
//         ),
//       },
//       {
//         key: "status",
//         name: "Status",
//         renderCell: ({ row }) => (
//           <div onClick={(e) => e.stopPropagation()}>
//             {editingStatusId === row.id ? (
//               <select
//                 className="form-select form-select-sm"
//                 value={updatedStatus}
//                 onChange={(e) => setUpdatedStatus(e.target.value)}
//                 onBlur={() => submitStatusChange(row.id)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") submitStatusChange(row.id);
//                 }}
//                 autoFocus
//               >
//                 {statusStages.map((status) => (
//                   <option key={status} value={status}>
//                     {status}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <span
//                 onClick={() => {
//                   setEditingStatusId(row.id);
//                   setUpdatedStatus(row.status);
//                 }}
//                 className="badge bg-secondary"
//                 style={{
//                   cursor: "pointer",
//                 }}
//               >
//                 {row.status}
//               </span>
//             )}
//           </div>
//         ),
//       },
//       {
//         key: "actions",
//         name: "Actions",
//         renderCell: ({ row }) => (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//               position: "relative",
//               zIndex: 1000,
//             }}
//           >
//             <Dropdown>
//               <Dropdown.Toggle
//                 variant="link"
//                 size="sm"
//                 id={`dropdown-${row.id}`}
//                 className="text-dark p-0"
//                 style={{ zIndex: 1001 }}
//               >
//                 <HiDotsVertical />
//               </Dropdown.Toggle>
//               <Dropdown.Menu
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   zIndex: 1001,
//                   marginTop: "5px",
//                 }}
//               >
//                 <Dropdown.Item
//                   onClick={() =>
//                     navigate(`/update-candidate/${row.id}`, {
//                       state: { candidate: row },
//                     })
//                   }
//                 >
//                   <HiPencil className="me-2" /> Edit
//                 </Dropdown.Item>
//                 <Dropdown.Item onClick={() => handleDelete(row.id)}>
//                   <HiTrash className="me-2" /> Delete
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </div>
//         ),
//       },
//     ];

//     return baseColumns;
//   }, [ editingStatusId, updatedStatus, statusStages]);

//   const sortedRows = useMemo(() => {
//     if (sortDirection === "NONE") return candidates;

//     return [...candidates].sort((a, b) => {
//       const aValue = a[sortColumn];
//       const bValue = b[sortColumn];

//       if (aValue === bValue) return 0;
//       if (aValue == null) return sortDirection === "ASC" ? -1 : 1;
//       if (bValue == null) return sortDirection === "ASC" ? 1 : -1;

//       return sortDirection === "ASC"
//         ? String(aValue).localeCompare(String(bValue))
//         : String(bValue).localeCompare(String(aValue));
//     });
//   }, [candidates, sortColumn, sortDirection]);

//   const handleSort = (columnKey, direction) => {
//     setSortColumn(columnKey);
//     setSortDirection(direction);
//   };

//   useEffect(() => {
//     fetchStatuses();
//     fetchJobPositions();
//   }, []);

//   useEffect(() => {
//     if (statusStages.length > 0) {
//       fetchCandidates();
//     }
//   }, [statusStages, currentPage, pageSize, selectedStatus, search, filters, fetchCandidates]);

//   if (loading)
//     return (
//       <div className="text-center mt-4">
//         <Spinner />
//       </div>
//     );

//   return (
//     <div className="content">
//       <Container className="mt-3">
//         {message && (
//           <Alert variant={variant} onClose={() => setMessage("")} dismissible>
//             {message}
//           </Alert>
//         )}

//         <div className="row justify-content-between mb-3">
//           <h4 className="col-md-6 mb-0">Candidate Management</h4>
//           <div className="col-md-6 text-end">
//             <input
//               type="text"
//               className="form-control d-inline-block me-2"
//               style={{ width: "200px" }}
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <OverlayTrigger
//               placement="bottom"
//               overlay={<Tooltip>Export to Excel</Tooltip>}
//             >
//               <Button
//                 variant="outline-secondary"
//                 className="me-2"
//                 onClick={exportToExcel}
//               >
//                 <FaFileExcel />
//               </Button>
//             </OverlayTrigger>
//             <Button
//               variant="outline-secondary"
//               className="me-2"
//               onClick={toggleFilter}
//             >
//               <HiFilter />
//             </Button>
//             <Button
//               variant="primary"
//               className="ms-2"
//               onClick={() => navigate("/add-candidate")}
//             >
//               Add Candidate
//             </Button>
//           </div>
//         </div>

//         {/* Status Stages */}
//         <div className="card mb-3">
//           <div className="d-flex justify-content-between text-center flex-wrap bg-light">
//             {statusStages.map((status) => (
//               <div
//                 key={status}
//                 className={`flex-fill py-2 rounded ${
//                   selectedStatus === status
//                     ? "bg-primary text-white"
//                     : "bg-light"
//                 }`}
//                 style={{
//                   minWidth: "100px",
//                   borderRight: "1px solid #eee",
//                   cursor: "pointer",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}
//                 onClick={() => handleStatusClick(status)}
//               >
//                 <div className="fw-bold fs-5">{statusCounts[status] || 0}</div>
//                 <div
//                   className={
//                     selectedStatus === status ? "text-white" : "text-muted"
//                   }
//                 >
//                   {status}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sidebar + Table Layout */}
//         <div className="table-layout-wrapper">
//           <div
//             className={`table-sidebar-wrapper ${filterToggle ? "" : "toggled"}`}
//           >
//             {/* Sidebar Filter */}
//             <div id="sidebar-wrapper">
//               <div className="row g-4 p-3">
//                 <div className="col-12">
//                   <div className="card shadow-none border border-300 my-2">
//                     <div className="row justify-content-center d-flex p-3">
//                       <div className="col-md-12 mb-3">
//                         <label className="form-label" htmlFor="jobPosition">
//                           Job Position
//                         </label>
//                         <select
//                           className="form-select form-select-sm"
//                           id="jobPosition"
//                           value={filters.jobPosition}
//                           onChange={(e) => handleFilterChange('jobPosition', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           {Array.isArray(jobPositions) &&
//                             jobPositions.map((position) => (
//                               <option
//                                 key={position.job_id}
//                                 value={position.job_name}
//                               >
//                                 {position.job_name}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       <div className="col-md-12 mb-3">
//                         <label className="form-label" htmlFor="location">
//                           Location
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           id="location"
//                           value={filters.location}
//                           onChange={(e) => handleFilterChange('location', e.target.value)}
//                           placeholder="Enter location"
//                         />
//                       </div>

//                       <div className="col-md-12 mb-3">
//                         <label className="form-label" htmlFor="experience">
//                           Min Experience (years)
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           id="experience"
//                           value={filters.experience}
//                           onChange={(e) => handleFilterChange('experience', e.target.value)}
//                           placeholder="0"
//                           min="0"
//                         />
//                       </div>

//                       <div className="col-md-12 mb-3">
//                         <label className="form-label" htmlFor="education">
//                           Education
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control form-control-sm"
//                           id="education"
//                           value={filters.education}
//                           onChange={(e) => handleFilterChange('education', e.target.value)}
//                           placeholder="Enter education"
//                         />
//                       </div>

//                       <div className="col-md-12 text-center">
//                         <button
//                           type="button"
//                           className="btn btn-primary btn-sm"
//                           onClick={fetchCandidates}
//                         >
//                           Apply Filters
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Table Content */}
//             <div className="table-content-wrapper">
//               <div
//                 style={{
//                   height: "calc(119vh - 300px)",
//                   width: "100%",
//                   overflow: "hidden",
//                 }}
//               >
//                 <DataGrid
//                   columns={columns}
//                   rows={sortedRows}
//                   rowHeight={50}
//                   rowKeyGetter={(row) => row.id}
//                   style={{ width: "100%", height: "100%", contain: "none" }}
//                   emptyRowsView={() => (
//                     <div className="text-center py-5">
//                       <h5>No candidates found</h5>
//                       <p>Try adjusting your search or filters</p>
//                     </div>
//                   )}
//                   onSort={handleSort}
//                   sortColumn={sortColumn}
//                   sortDirection={sortDirection}
//                   onRowClick={(row) => navigate(`/candidate/${row.id}`)}
//                   rowClass={(row) =>
//                     selectedRows.has(row.id) ? "selected-row" : ""
//                   }
//                 />
//               </div>

//               {/* Pagination */}
//               <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//                 <div>
//                   <label className="me-2">Show per page:</label>
//                   <Form.Select
//                     value={pageSize}
//                     onChange={(e) => {
//                       setPageSize(Number(e.target.value));
//                       setCurrentPage(1);
//                     }}
//                     style={{ width: "auto", display: "inline-block" }}
//                     size="sm"
//                   >
//                     {[10, 25, 50, 100].map((size) => (
//                       <option key={size} value={size}>
//                         {size}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </div>
//                 <div>
//                   <Button
//                     variant="outline-secondary"
//                     size="sm"
//                     className="me-2"
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                   >
//                     Previous
//                   </Button>
//                   <span>
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <Button
//                     variant="outline-secondary"
//                     size="sm"
//                     className="ms-2"
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(p + 1, totalPages))
//                     }
//                     disabled={currentPage === totalPages || totalPages === 0}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Container>

//       {/* Custom Styles */}
//       <style>{`
//         .table-layout-wrapper {
//           position: relative;
//           width: 100%;
//         }

//         #sidebar-wrapper {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 250px;
//           height: 90%;
//           background: #f8f9fa;
//           border-right: 1px solid #dee2e6;
//           transition: transform 0.3s ease-in-out;
//           z-index: 1000;
//         }

//         .table-sidebar-wrapper.toggled #sidebar-wrapper {
//           transform: translateX(-100%);
//         }

//         .table-content-wrapper {
//           width: 100%;
//           transition: all 0.3s ease-in-out;
//         }

//         .rdg-cell {
//           overflow: visible !important;
//           contain: none !important;
//         }

//         .rdg-row {
//           contain: none !important;
//         }

//         .dropdown-menu {
//           position: absolute !important;
//           z-index: 1050 !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ShowCandidate;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Spinner from "../components/spinner/Spinner";
import {
  Button,
  Dropdown,
  Alert,
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
  Offcanvas,
  Row,
  Col,
} from "react-bootstrap";
import { HiDotsVertical, HiPencil, HiTrash, HiFilter } from "react-icons/hi";
import { FaFileExcel } from "react-icons/fa";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import QueryString from "qs";
import Select from "react-select";

const ShowCandidate = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusStages, setStatusStages] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [jobPositions, setJobPositions] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("NONE");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [filters, setFilters] = useState({
    jobPosition: "",
    locations: [],
    experience: "",
    education: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleFilterChange = (filterName, value) => {
  //   setFilters((prev) => ({ ...prev, [filterName]: value }));
  //   setCurrentPage(1);
  // };
  //   const handleFilterChange = (filterName, value) => {
  //     if (filterName === "locations") {
  //         setFilters(prev => {
  //             // Toggle location in the array
  //             const newLocations = prev.locations.includes(value)
  //                 ? prev.locations.filter(loc => loc !== value)
  //                 : [...prev.locations, value];
  //             return { ...prev, locations: newLocations };
  //         });
  //     } else {
  //         setFilters(prev => ({ ...prev, [filterName]: value }));
  //     }
  //     setCurrentPage(1);
  // };
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
    
    // Close sidebar on mobile after selecting a filter
    if (isMobile && filterName !== "locations") {
      setShowFilters(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations");
        console.log("Locations API response:", response.data);

        // Keep full objects with id and location_name
        const filteredLocations = response.data.filter(
          (loc) => loc.location_name?.trim() !== ""
        );

        setAvailableLocations(filteredLocations); // ✅ store full objects
      } catch (err) {
        console.error("Failed to fetch locations", err);
        setAvailableLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/status");
      const statuses = res.data.data.map((s) => s.status_name);
      setStatusStages(statuses);
      const initialCounts = {};
      statuses.forEach((status) => {
        initialCounts[status] = 0;
      });
      setStatusCounts(initialCounts);
    } catch (err) {
      console.error("Failed to fetch statuses", err);
      setMessage("Failed to load status stages");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/candidates", {
        params: {
          page: currentPage,
          limit: pageSize,
          search,
          status: selectedStatus,
          jobPosition: filters.jobPosition,
          // location: filters.location,
          locations: filters.locations.join(","),
          experience: filters.experience,
          education: filters.education,
        },
        paramsSerializer: (params) => {
          return QueryString.stringify(params, { arrayFormat: "comma" });
        },
      });

      setCandidates(data.data);
      setTotalPages(data.totalPages || 1);
      setStatusCounts(data.statusCounts || {});
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to load candidates");
      setMessage("Failed to load candidates. Please try again.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, search, filters]);

  const handleStatusClick = (status) => {
    setSelectedStatus((prev) => (prev === status ? "" : status));
    setCurrentPage(1);
  };

  const submitStatusChange = async (candidateId) => {
    try {
      await api.put(`/candidates/${candidateId}/status`, {
        status: updatedStatus,
      });
      setEditingStatusId(null);
      fetchCandidates();
      setMessage("Status updated successfully");
      setVariant("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update status");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (candidateId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this candidate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/candidates/delete/${candidateId}`);
        setMessage("Candidate deleted successfully");
        setVariant("success");
        fetchCandidates();
        setTimeout(() => setMessage(""), 3000);

        Swal.fire({
          title: "Deleted!",
          text: "Candidate has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        setMessage("Delete failed. Please try again.");
        setVariant("danger");
        setTimeout(() => setMessage(""), 3000);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete the candidate.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const fetchJobPositions = async () => {
    try {
      const { data } = await api.get("/jobposition");
      setJobPositions(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch job positions", error);
      setJobPositions([]);
      setMessage("Failed to load job positions");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const exportToExcel = async () => {
    try {
      const filtersExist =
        search ||
        selectedStatus ||
        filters.jobPosition ||
        (filters.locations && filters.locations.length > 0) ||
        filters.experience ||
        filters.education;

      const { data } = await api.get("/candidates", {
        params: {
          all: true,
          ...(filtersExist && {
            search,
            status: selectedStatus,
            jobPosition: filters.jobPosition,
            locations: filters.locations, // ✅ must match backend 'locations'
            experience: filters.experience,
            education: filters.education,
          }),
        },
      });

      const candidatesToExport = data.data || [];

      const dataToExport = candidatesToExport.map((candidate) => ({
        Name: candidate.name,
        Email: candidate.email,
        Phone: candidate.phone,
        Gender: candidate.gender,
        Location: candidate.location,
        Education: candidate.education,
        "Passout Year": candidate.passoutYear,
        "CGPA/Marks": candidate.cgpa,
        "Job Position": candidate.jobPosition,
        Source: candidate.source,
        "Expected CTC": candidate.expectedCtc,
        "Has Experience": candidate.hasExperience ? "Yes" : "No",
        "Current Company Experience": candidate.currentCompanyExperience,
        "Company Name": candidate.companyName,
        Designation: candidate.designation,
        "Current CTC": candidate.currentCtc,
        "Notice Period": candidate.noticePeriod,
        "Total Experience": candidate.totalExperience,
        "Interview Date": candidate.interviewDate
          ? new Date(candidate.interviewDate).toLocaleDateString()
          : "",
        "Interview Time": candidate.interviewTime,
        "Interview Mode": candidate.interviewMode,
        "Round Type": candidate.roundType,
        Status: candidate.status,
        Remark: candidate.remark,
        "Interviewer Name": candidate.interviewerName,
        Feedback: candidate.feedback,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(wb, ws, "Candidates");
      XLSX.writeFile(
        wb,
        `candidates_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (err) {
      console.error("Error exporting candidates:", err);
      setMessage("Failed to export data");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "name",
        name: "Name",
        resizable: true,
        sortable: true,
        minWidth: 120,
      },
      {
        key: "email",
        name: "Email",
        resizable: true,
        sortable: true,
        minWidth: 150,
      },
      {
        key: "phone",
        name: "Phone",
        resizable: true,
        sortable: true,
        minWidth: 120,
      },
      {
        key: "location",
        name: "Location",
        resizable: true,
        sortable: true,
        minWidth: 120,
      },
      {
        key: "jobPosition",
        name: "Position",
        resizable: true,
        sortable: true,
        minWidth: 120,
      },
      {
        key: "resumePath",
        name: "Resume",
        width: 100,
        renderCell: ({ row }) => (
          <div className="d-flex justify-content-center align-items-center h-100">
            {row.resumePath ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `${api.defaults.baseURL}/uploads/Resume/${row.resumePath}`,
                    "_blank"
                  );
                }}
                className="w-100"
              >
                View
              </Button>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </div>
        ),
      },
      {
        key: "status",
        name: "Status",
        width: 150,
        renderCell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            {editingStatusId === row.id ? (
              <select
                className="form-select form-select-sm"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                onBlur={() => submitStatusChange(row.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitStatusChange(row.id);
                }}
                autoFocus
              >
                {statusStages.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            ) : (
              <span
                onClick={() => {
                  setEditingStatusId(row.id);
                  setUpdatedStatus(row.status);
                }}
                className="badge bg-secondary"
                style={{ cursor: "pointer" }}
              >
                {row.status}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "actions",
        name: "Actions",

        width: 80,
        renderCell: ({ row }) => (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                size="sm"
                id={`dropdown-${row.id}`}
                className="text-dark p-0"
              >
                <HiDotsVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    navigate(`/update-candidate/${row.id}`, {
                      state: { candidate: row },
                    })
                  }
                >
                  <HiPencil className="me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDelete(row.id)}>
                  <HiTrash className="me-2" /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ),
      },
    ];

    // For mobile devices, show fewer columns
    if (isMobile) {
      return baseColumns
        .filter((col) =>
          ["name", "phone", "status", "actions"].includes(col.key)
        )
        .map((col) => ({
          ...col,
          width:
            col.key === "name"
              ? 120
              : col.key === "phone"
              ? 100
              : col.key === "status"
              ? 120
              : 60,
        }));
    }

    return baseColumns;
  }, [editingStatusId, updatedStatus, statusStages, isMobile, navigate]);

  const sortedRows = useMemo(() => {
    if (!sortColumn || sortDirection === "NONE") return candidates;

    return [...candidates].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "ASC" ? 1 : -1;
      if (bValue == null) return sortDirection === "ASC" ? -1 : 1;

      // Numeric sorting if both values are numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "ASC" ? aValue - bValue : bValue - aValue;
      }

      // String sorting
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      return sortDirection === "ASC"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [candidates, sortColumn, sortDirection]);

  const handleSort = (columnKey, direction) => {
    setSortColumn(columnKey);
    setSortDirection(direction || "NONE");
  };

  useEffect(() => {
    fetchStatuses();
    fetchJobPositions();
  }, []);

  useEffect(() => {
    if (statusStages.length > 0) {
      fetchCandidates();
    }
  }, [
    statusStages,
    currentPage,
    pageSize,
    selectedStatus,
    search,
    filters,
    fetchCandidates,
  ]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner />
      </div>
    );

  return (
    <div className="content">
      <Container fluid className="py-3">
        {message && (
          <Alert variant={variant} onClose={() => setMessage("")} dismissible>
            {message}
          </Alert>
        )}

        <Row className="justify-content-between mb-3">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <h4 className="mb-0">Candidate Management</h4>
          </Col>
          <Col xs={12} md={6} className="d-flex flex-wrap justify-content-end">
            <div
              className="d-flex mb-2 mb-md-0 w-0"
              style={{ maxWidth: "300px" }}
            >
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearch(searchInput); // trigger actual search
                    setCurrentPage(1); // reset to first page
                  }
                }}
                onBlur={() => {
                  if (search !== searchInput) {
                    setSearch(searchInput); // apply search when field loses focus
                    setCurrentPage(1);
                  }
                }}
                className="me-2"
              />

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Export to Excel</Tooltip>}
              >
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={exportToExcel}
                >
                  <FaFileExcel />
                </Button>
              </OverlayTrigger>
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={toggleFilters}
              >
                <HiFilter />
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/add-candidate")}
              >
                Add
              </Button>
            </div>
          </Col>
        </Row>

        {/* Status Stages - Horizontal scroll for mobile */}
        <div className="card mb-3">
          <div className="d-flex overflow-auto">
            <div
              className="d-flex flex-nowrap text-center bg-light"
              style={{ minWidth: "100%" }}
            >
              {statusStages.map((status) => (
                <div
                  key={status}
                  className={`py-2 px-3 ${
                    selectedStatus === status
                      ? "bg-primary text-white"
                      : "bg-light"
                  }`}
                  style={{
                    // minWidth: "100px",
                    cursor: "pointer",
                    // whiteSpace: "nowrap",
                    borderRight: "1px solid #eee",
                  }}
                  onClick={() => handleStatusClick(status)}
                >
                  <div className="fw-bold fs-5">
                    {statusCounts[status] || 0}
                  </div>
                  <div
                    className={
                      selectedStatus === status ? "text-white" : "text-muted"
                    }
                  >
                    {status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Offcanvas for mobile */}
        <Offcanvas
          show={showFilters}
          onHide={toggleFilters}
          placement={isMobile ? "bottom" : "start"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="card shadow-none border border-300 my-2">
              <div className="p-3">
                <Form.Group className="mb-3">
                  <Form.Label>Job Position</Form.Label>
                  <Select
                    isSearchable
                    options={[
                      { value: "", label: "All" },
                      ...jobPositions.map((position) => ({
                        value: position.job_name,
                        label: position.job_name,
                      })),
                    ]}
                    value={
                      filters.jobPosition
                        ? {
                            value: filters.jobPosition,
                            label: filters.jobPosition,
                          }
                        : { value: "", label: "All" }
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange("jobPosition", selectedOption.value)
                    }
                    placeholder="Search job positions..."
                    classNamePrefix="react-select"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Locations</Form.Label>
                  <Select
                    isMulti
                    isSearchable
                    options={availableLocations.map((loc) => ({
                      value: loc.id,
                      label: loc.location_name,
                    }))}
                    value={filters.locations
                      .map((id) => {
                        const match = availableLocations.find(
                          (loc) => loc.id === id
                        );
                        return match
                          ? { value: match.id, label: match.location_name }
                          : null;
                      })
                      .filter(Boolean)}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map(
                        (opt) => opt.value
                      );
                      handleFilterChange("locations", selectedIds);
                    }}
                    placeholder="Select locations..."
                    classNamePrefix="react-select"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="experience">
                    Min Experience (years)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    id="experience"
                    value={filters.experience}
                    onChange={(e) =>
                      handleFilterChange("experience", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    size="sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="education">Education</Form.Label>
                  <Form.Control
                    type="text"
                    id="education"
                    value={filters.education}
                    onChange={(e) =>
                      handleFilterChange("education", e.target.value)
                    }
                    placeholder="Enter education"
                    size="sm"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      fetchCandidates();
                      if (isMobile) toggleFilters();
                      toggleFilters();
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setFilters({
                        jobPosition: "",
                        locations: [],
                        experience: "",
                        education: "",
                      });
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Data Grid */}
        <div className="card">
          <div className="card-body p-0">
            <div
              style={{
                height: isMobile ? "400px" : "calc(120vh - 300px)",
                width: isMobile ? "370px" : "100%",
                position: "relative", // Add this
              }}
            >
              <DataGrid
                columns={columns}
                rows={sortedRows}
                rowHeight={50}
                rowKeyGetter={(row) => row.id}
                style={{
                  width: "100%",
                  height: "100%",
                  contain: "strict", // Add this to help with layout calculations
                }}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true,
                }}
                sortColumns={
                  sortColumn
                    ? [
                        {
                          columnKey: sortColumn,
                          direction: sortDirection.toLowerCase(),
                        },
                      ]
                    : []
                }
                onSortColumnsChange={(sortColumns) => {
                  if (sortColumns.length > 0) {
                    const { columnKey, direction } = sortColumns[0];
                    handleSort(columnKey, direction.toUpperCase());
                  } else {
                    handleSort(null, "NONE");
                  }
                }}
                emptyRowsView={() => (
                  <div className="text-center py-5">
                    <h5>No candidates found</h5>
                    <p>Try adjusting your search or filters</p>
                  </div>
                )}
                onRowClick={(row) => navigate(`/candidate/${row.id}`)}
                rowClass={(row) =>
                  selectedRows.has(row.id) ? "selected-row" : ""
                }
              />
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
          <div className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Show per page:</Form.Label>
            <Form.Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: "auto" }}
              size="sm"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Container>

      {/* Custom Styles */}
      <style>{`
        .rdg-cell {
          overflow: visible !important;
          contain: none !important;
        }

        .rdg-row {
          contain: none !important;
        }

        .dropdown-menu {
          position: absolute !important;
          z-index: 1050 !important;
        }

        @media (max-width: 767.98px) {
          .rdg {
            min-width: 100% !important;
            width: auto !important;
          }
          
          .status-container {
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowCandidate;
