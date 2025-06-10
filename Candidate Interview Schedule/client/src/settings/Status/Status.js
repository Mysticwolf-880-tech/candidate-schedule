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

// const Status = () => {
//   const [statuses, setStatuses] = useState([]);
//   const [filteredStatuses, setFilteredStatuses] = useState([]);
//   const [message, setMessage] = useState("");
//   const [variant, setVariant] = useState("success");
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Modal states
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editStatus, setEditStatus] = useState(null);
//   const [newName, setNewName] = useState("");

//   const fetchStatuses = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/status", {
//         params: {
//           page: currentPage,
//           limit: pageSize,
//           search
//         }
//       });
//       setStatuses(data.data || data);
//       setTotalPages(data.totalPages || 1);
//     } catch (error) {
//       setMessage("Failed to fetch statuses.");
//       setVariant("danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStatuses();
//   }, [currentPage, pageSize]);

//   // Filter statuses based on search term
//   useMemo(() => {
//     if (search) {
//       const filtered = statuses.filter(status =>
//         status.status_name.toLowerCase().includes(search.toLowerCase()) ||
//         (status.added_by && status.added_by.toLowerCase().includes(search.toLowerCase()))
//       );
//       setFilteredStatuses(filtered);
//     } else {
//       setFilteredStatuses(statuses);
//     }
//   }, [statuses, search]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this status?")) {
//       try {
//         await api.put(`/status/delete/${id}`);
//         setMessage("Status deleted.");
//         setVariant("success");
//         fetchStatuses();
//         setTimeout(() => setMessage(""), 3000);
//       } catch (error) {
//         setMessage("Delete failed.");
//         setVariant("danger");
//         setTimeout(() => setMessage(""), 3000);
//       }
//     }
//   };

//   const handleEdit = (status) => {
//     setEditStatus(status);
//     setNewName(status.status_name);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       await api.put(`/status/${editStatus.status_id}`, { status_name: newName });
//       setMessage("Status updated.");
//       setVariant("success");
//       setShowEditModal(false);
//       fetchStatuses();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (error) {
//       setMessage("Update failed.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   const handleAdd = async () => {
//     if (!newName.trim()) {
//       setMessage("Please enter a status name.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }

//     try {
//       await api.post("/status", { status_name: newName });
//       setMessage("Status added successfully!");
//       setVariant("success");
//       setShowAddModal(false);
//       setNewName("");
//       fetchStatuses();
//       setTimeout(() => setMessage(""), 3000);
//     } catch (error) {
//       setMessage("Failed to add status.");
//       setVariant("danger");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   if (loading) return <div className="text-center mt-4"><Spinner /></div>;

//   return (
//     <Container className="mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <h4>Statuses</h4>
//         <div className="d-flex align-items-center gap-2">
//           <Form.Control
//             type="text"
//             placeholder="Search by status name or added by"
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
//             <th>Status Name</th>
//             <th>Added By</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredStatuses.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center py-4">
//                 {search ? "No matching statuses found" : "No statuses available"}
//               </td>
//             </tr>
//           ) : (
//             filteredStatuses.map((status, index) => (
//               <tr key={status.status_id}>
//                 <td>{(currentPage - 1) * pageSize + index + 1}</td>
//                 <td>{status.status_name}</td>
//                 <td>{status.added_by}</td>
//                 <td className="text-center">
//                   <Dropdown align="end">
//                     <Dropdown.Toggle
//                       as="span"
//                       style={{ cursor: "pointer" }}
//                       id={`dropdown-${status.status_id}`}
//                     >
//                       <HiDotsVertical />
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleEdit(status)}>
//                         <HiPencil className="me-2" />
//                         Edit
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => handleDelete(status.status_id)}>
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
//           <Modal.Title>Update Status</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group controlId="updateName">
//             <Form.Label>Status Name</Form.Label>
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
//           <Modal.Title>Add Status</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group controlId="addName">
//             <Form.Label>Status Name</Form.Label>
//             <Form.Control
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               placeholder="Enter status name"
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

// export default Status;


import React, { useState, useEffect, useMemo } from "react";
import 'react-data-grid/lib/styles.css';
import {
  Container,
  Button,
  Alert,
  Dropdown,
  Modal,
  Form,
} from "react-bootstrap";
import { DataGrid }  from 'react-data-grid';
import api from "../../api";
import { HiPencil, HiTrash, HiDotsVertical } from "react-icons/hi";
import Spinner from '../../components/spinner/Spinner';

const Status = () => {
  const [statuses, setStatuses] = useState([]);
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
  const [editStatus, setEditStatus] = useState(null);
  const [newName, setNewName] = useState("");

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/status", {
        params: {
          page: currentPage,
          limit: pageSize,
          search
        }
      });
      setStatuses(data.data || data);
      setTotalPages(data.totalPages || 1);
      setTotalRows(data.totalCount || (data.data ? data.data.length : data.length));
    } catch (error) {
      setMessage("Failed to fetch statuses.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [currentPage, pageSize, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      try {
        await api.put(`/status/delete/${id}`);
        setMessage("Status deleted.");
        setVariant("success");
        fetchStatuses();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("Delete failed.");
        setVariant("danger");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleEdit = (status) => {
    setEditStatus(status);
    setNewName(status.status_name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/status/${editStatus.status_id}`, { status_name: newName });
      setMessage("Status updated.");
      setVariant("success");
      setShowEditModal(false);
      fetchStatuses();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Update failed.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      setMessage("Please enter a status name.");
      setVariant("danger");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await api.post("/status", { status_name: newName });
      setMessage("Status added successfully!");
      setVariant("success");
      setShowAddModal(false);
      setNewName("");
      fetchStatuses();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to add status.");
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
  { key: 'status_name', name: 'Status Name', resizable: true },
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
                  // id={`dropdown-${row.id}`}
                  id={`dropdown-${row.status_id}`}
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
          <Dropdown.Item onClick={() => handleDelete(row.status_id)}>
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
        <h4>Statuses</h4>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search by status name or added by"
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
          rows={statuses}
          rowHeight={40}
          onRowsChange={setStatuses}
          rowKeyGetter={row => row.status_id}
          style={{ width: '100%' , height: "100%"}}
          emptyRowsView={() => (
            <div className="text-center py-4">
              {search ? "No matching statuses found" : "No statuses available"}
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
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="updateName">
            <Form.Label>Status Name</Form.Label>
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
          <Modal.Title>Add Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="addName">
            <Form.Label>Status Name</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter status name"
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

export default Status;