import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Alert,
  Dropdown,
  Modal,
  Form,
} from "react-bootstrap";
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import api from "../../api";
import { HiPencil, HiTrash, HiDotsVertical } from "react-icons/hi";
import Spinner from '../../components/spinner/Spinner';

const Interviewers = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editInterviewer, setEditInterviewer] = useState(null);
  const [newName, setNewName] = useState("");

  const fetchInterviewers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/interviewers", {
        params: {
          page: currentPage,
          limit: pageSize,
          search
        }
      });
      setInterviewers(data.data || data);
      setTotalPages(data.totalPages || 1);
      setTotalRows(data.totalCount || (data.data ? data.data.length : data.length));
    } catch (error) {
      setMessage("Failed to fetch interviewers.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewers();
  }, [currentPage, pageSize, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this interviewer?")) {
      try {
        await api.put(`/interviewers/delete/${id}`);
        setMessage("Interviewer deleted.");
        setVariant("success");
        fetchInterviewers();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("Delete failed.");
        setVariant("danger");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleEdit = (interviewer) => {
    setEditInterviewer(interviewer);
    setNewName(interviewer.name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/interviewers/${editInterviewer.id}`, { name: newName });
      setMessage("Interviewer updated.");
      setVariant("success");
      setShowEditModal(false);
      fetchInterviewers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Update failed.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      setMessage("Please enter a name.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await api.post("/interviewers", { name: newName });
      setMessage("Interviewer added successfully!");
      setVariant("success");
      setShowAddModal(false);
      setNewName("");
      fetchInterviewers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to add interviewer.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const columns = [
    { 
      key: 'serial', 
      name: 'Sr. No.',
      width: 80,
      renderCell: ({ rowIdx }) => (currentPage - 1) * pageSize + rowIdx + 1
    },
    { key: 'name', name: 'Name', resizable: true },
    { key: 'added_by', name: 'Added By', resizable: true },
    { 
      key: 'actions', 
      name: 'Actions',
      width: 120,
      renderCell: ({ row }) => (
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          position: "relative",
          zIndex: 1000
        }}>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              size="sm"
              id={`dropdown-${row.id}`}
              className="text-dark p-0"
              style={{ zIndex: 1001 }}
            >
              <HiDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{
              position: "absolute",
              right: 0,
              zIndex: 1001,
              marginTop: "5px"
            }}>
              <Dropdown.Item onClick={() => handleEdit(row)}>
                <HiPencil className="me-2" />
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDelete(row.id)}>
                <HiTrash className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ),
    }
  ];

  if (loading) return <div className="text-center mt-4"><Spinner /></div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4>Interviewers</h4>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search by name or added by"
            style={{ maxWidth: "250px" }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          <Button 
            variant="primary" 
            onClick={() => { 
              setShowAddModal(true); 
              setNewName(""); 
            }}
          >
            Add
          </Button>
        </div>
      </div>

      {message && <Alert variant={variant}>{message}</Alert>}

      <div style={{ height: 450 }}>
        <DataGrid
          columns={columns}
          rows={interviewers}
          rowHeight={40}
          onRowsChange={setInterviewers}
          rowKeyGetter={row => row.id}
          style={{ width: '100%', height: "100%" }}
          emptyRowsView={() => (
            <div className="text-center py-4">
              {search ? "No matching interviewers found" : "No interviewers available"}
            </div>
          )}
        />
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
        <div>
          <label className="me-2">Show per page:</label>
          <Form.Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            style={{ width: "auto", display: "inline-block" }}
            size="sm"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </div>
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Interviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="updateName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Interviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="addName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter interviewer name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
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
      `}</style>
    </Container>
  );
};

export default Interviewers;

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Container,
//   Button,
//   Alert,
//   Dropdown,
//   Modal,
//   Form,
// } from "react-bootstrap";
// import api from "../../api";
// import { HiPencil, HiTrash, HiDotsVertical } from "react-icons/hi";
// import Spinner from '../../components/spinner/Spinner';

// const Interviewers = () => {
//   const [interviewers, setInterviewers] = useState([]);
//   const [filteredInterviewers, setFilteredInterviewers] = useState([]);
//   const [message, setMessage] = useState("");
//   const [variant, setVariant] = useState("success");
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Modal states
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editInterviewer, setEditInterviewer] = useState(null);
//   const [newName, setNewName] = useState("");

//   const fetchInterviewers = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/interviewers", {
//         params: {
//           page: currentPage,
//           limit: pageSize,
//           search
//         }
//       });
//       setInterviewers(data.data || data);
//       setTotalPages(data.totalPages || 1);
//     } catch (err) {
//       console.error("Error fetching interviewers:", err);
//       setMessage("Failed to fetch interviewers.");
//       setVariant("danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInterviewers();
//   }, [currentPage, pageSize]);

//   // Filter interviewers based on search term
//   useMemo(() => {
//     if (search) {
//       const filtered = interviewers.filter(interviewer =>
//         interviewer.name.toLowerCase().includes(search.toLowerCase()) ||
//         interviewer.added_by.toLowerCase().includes(search.toLowerCase())
//       );
//       setFilteredInterviewers(filtered);
//     } else {
//       setFilteredInterviewers(interviewers);
//     }
//   }, [interviewers, search]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this interviewer?")) {
//       try {
//         await api.put(`/interviewers/delete/${id}`);
//         setMessage("Interviewer deleted.");
//         setVariant("success");
//         fetchInterviewers();
//         setTimeout(() => setMessage(""), 3000);
//       } catch (error) {
//         setMessage("Delete failed.");
//         setVariant("danger");
//         setTimeout(() => setMessage(""), 3000);
//       }
//     }
//   };

//   const handleEdit = (interviewer) => {
//     setEditInterviewer(interviewer);
//     setNewName(interviewer.name);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.put(`/interviewers/${editInterviewer.id}`, { name: newName });
//       setMessage("Interviewer updated.");
//       setVariant("success");
//       setShowEditModal(false);
//       fetchInterviewers();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (error) {
//       setMessage("Update failed.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const handleAdd = async () => {
//     if (!newName.trim()) {
//       setMessage("Please enter a name.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }

//     try {
//       await api.post("/interviewers", { name: newName });
//       setMessage("Interviewer added successfully!");
//       setVariant("success");
//       setShowAddModal(false);
//       setNewName("");
//       fetchInterviewers();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (error) {
//       setMessage("Failed to add interviewer.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   if (loading) return <div className="text-center mt-4"><Spinner /></div>;

//   return (
//     <Container className="mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <h4>Interviewers</h4>
//         <div className="d-flex align-items-center gap-2">
//           <Form.Control
//             type="text"
//             placeholder="Search by name or added by"
//             style={{ maxWidth: "250px" }}
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1); // Reset to first page when searching
//             }}
//           />
//           <Button 
//             variant="primary" 
//             onClick={() => { 
//               setShowAddModal(true); 
//               setNewName(""); 
//             }}
//           >
//             Add
//           </Button>
//         </div>
//       </div>

//       {message && <Alert variant={variant}>{message}</Alert>}

//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Sr. No.</th>
//             <th>Name</th>
//             <th>Added By</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredInterviewers.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center py-4">
//                 {search ? "No matching interviewers found" : "No interviewers available"}
//               </td>
//             </tr>
//           ) : (
//             filteredInterviewers.map((interviewer, index) => (
//               <tr key={interviewer.id}>
//                 <td>{(currentPage - 1) * pageSize + index + 1}</td>
//                 <td>{interviewer.name}</td>
//                 <td>{interviewer.added_by}</td>
//                 <td className="text-center">
//                   <Dropdown align="end">
//                     <Dropdown.Toggle
//                       as="span"
//                       style={{ cursor: "pointer" }}
//                       id={`dropdown-${interviewer.id}`}
//                     >
//                       <HiDotsVertical />
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleEdit(interviewer)}>
//                         <HiPencil className="me-2" />
//                         Edit
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => handleDelete(interviewer.id)}>
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

//       {/* Pagination */}
//       <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//         <div>
//           <label className="me-2">Show per page:</label>
//           <Form.Select
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setCurrentPage(1); // Reset to first page when changing page size
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

//       {/* Edit Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Interviewer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group controlId="updateName">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleUpdate}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Interviewer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group controlId="addName">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               placeholder="Enter interviewer name"
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleAdd}>
//             Add
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Interviewers;