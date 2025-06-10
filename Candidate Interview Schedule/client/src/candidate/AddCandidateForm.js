// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import Select from "react-select";
// import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";
// import api from "./../api";
// import Spinner from "./../components/spinner/Spinner";
// import {
//   FaUser,
//   FaGraduationCap,
//   FaBriefcase,
//   FaFileAlt,
//   FaComments,
//   FaArrowLeft,
// } from "react-icons/fa";

// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   phone: yup
//   .string()
//   .required("Phone is required")
//   .matches(/^[6-9]\d{9}$/, "Phone must be 10 digits and start with Range 6-9"),
//   gender: yup.string().required("Gender is required"),
//   location: yup.string().required("Location is required"),
//   education: yup.string().required("Education is required"),
//   passoutYear: yup
//     .number()
//     .transform((value, originalValue) =>
//       String(originalValue).trim() === "" ? null : value
//     )
//     .nullable()
//     .required("Year is required")
//     .typeError("Year must be a number"),
//   cgpa: yup.string().required("CGPA or marks are required"),
//   jobPosition: yup.string().required("Job position is required"),
//   resume: yup
//     .mixed()
//     .test("fileType", "Only PDF or DOCX files are allowed", (value) => {
//       if (!value || value.length === 0) return true; // Skip validation if no file (edit mode)
//       return [
//         "application/pdf",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ].includes(value[0]?.type);
//     })
//     .test("fileSize", "File is too large (max 2MB)", (value) => {
//       if (!value || value.length === 0) return true; // Skip validation if no file (edit mode)
//       return value[0]?.size <= 2 * 1024 * 1024; // 2MB
//     }),
//   hasExperience: yup.boolean(),
//   totalExperience: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Total experience is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
//   currentCompanyExperience: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Current company experience is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
//   companyName: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Company name is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
//   designation: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Designation is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
//   currentCtc: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Current CTC is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
//   noticePeriod: yup.string().when("hasExperience", {
//     is: true,
//     then: () => yup.string().required("Notice period is required"),
//     otherwise: () => yup.string().notRequired(),
//   }),
// });

// const AddCandidateForm = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isEditMode = !!id;
//   const [hasExperience, setHasExperience] = useState(false);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [interviewerNameOptions, setInterviewerNameOptions] = useState([]);
//   const [jobPositionOptions, setJobPositionOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [existingResume, setExistingResume] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     control,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: isEditMode
//       ? {
//           ...location.state.candidate,
//           hasExperience: location.state.candidate.hasExperience || false,
//         }
//       : {},
//   });

//   // Utility function to handle date conversion
//   const formatDateForInput = (dateString) => {
//     if (!dateString) return "";

//     try {
//       // Create date object in local timezone
//       const date = new Date(dateString);
//       // Adjust for timezone offset
//       const offset = date.getTimezoneOffset() * 60000;
//       const localDate = new Date(date.getTime() - offset);
//       return localDate.toISOString().split("T")[0];
//     } catch (e) {
//       console.error("Date formatting error:", e);
//       return dateString.split("T")[0] || "";
//     }
//   };

//   useEffect(() => {
//     if (isEditMode) {
//       const candidate = location.state.candidate;
//       setExistingResume(candidate.resumePath);
//       setHasExperience(candidate.hasExperience || false);
//       reset({
//         ...candidate,
//         hasExperience: candidate.hasExperience || false,
//       });
//     }
//   }, [isEditMode, location.state, reset]);

//   const onSubmit = async (data) => {
//     const payload = Object.fromEntries(
//         Object.entries(data).map(([key, value]) => [
//             key,
//             value === '' || value === undefined ? null : value
//         ])
//     );
//     try {
//       setLoading(true);
//       const formData = new FormData();

//       for (const key in payload) {
//         if (key === "resume") {
//           if (payload.resume[0]) {
//             formData.append("resume", payload.resume[0]);
//           }
//         } else {
//           formData.append(key, payload[key]);
//         }
//       }

//       if (isEditMode) {
//         await api.put(`/candidates/${location.state.candidate.id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         Swal.fire("Success!", "Candidate updated successfully!", "success");
//       } else {
//         await api.post("/candidates", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         Swal.fire("Success!", "Candidate added successfully!", "success");
//       }
//       navigate("/candidate");
//       if (!isEditMode) {
//         reset();
//         setExistingResume(null);
//         setHasExperience(false);
//         window.scrollTo(0, 0);
//         setValue("resume", null);
//         document.querySelector('input[type="file"]').value = "";
//       }
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.message || "Something went wrong",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sectionHeader = (icon, title) => (
//     <h5 className="card-title border-bottom pb-2 mb-3">
//       <span className="me-2">{icon}</span>
//       {title}
//     </h5>
//   );

//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       api.get("/interviewers"),
//       api.get("/status"),
//       api.get("/jobposition"),
//     ])
//       .then(([interviewersRes, statusesRes, jobsRes]) => {
//         setInterviewerNameOptions(
//           interviewersRes.data.data.map((i) => ({
//             value: i.name,
//             label: i.name,
//           }))
//         );
//         setStatusOptions(
//           statusesRes.data.data.map((s) => ({
//             value: s.status_name,
//             label: s.status_name,
//           }))
//         );
//         setJobPositionOptions(
//           jobsRes.data.data.map((j) => ({
//             value: j.job_name,
//             label: j.job_name,
//           }))
//         );
//       })
//       .catch((err) => {
//         console.error("Failed to fetch dropdown data", err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container my-4">
//       {loading && <Spinner />}
//       {isEditMode && (
//         <button
//           className="btn btn-outline-secondary mb-3"
//           onClick={() => navigate("/candidate")}
//         >
//           <FaArrowLeft className="me-2" />
//           Back to list
//         </button>
//       )}
//       <h2 className="text-center mb-4">
//         {isEditMode ? "Edit Candidate" : "Add New Candidate"}
//       </h2>
//       <form onSubmit={handleSubmit(onSubmit)} noValidate>
//         {/* Personal Info */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-body">
//             {sectionHeader(<FaUser />, "Personal Information")}
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">Name</label>
//                 <input {...register("name")} className="form-control" />
//                 <p className="text-danger">{errors.name?.message}</p>
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label">Email</label>
//                 <input {...register("email")} className="form-control" />
//                 <p className="text-danger">{errors.email?.message}</p>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Phone</label>
//                 <input {...register("phone")} className="form-control" />
//                 <p className="text-danger">{errors.phone?.message}</p>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Gender</label>
//                 <select {...register("gender")} className="form-select">
//                   <option value="">Select</option>
//                   <option>Male</option>
//                   <option>Female</option>
//                   <option>Other</option>
//                 </select>
//                 <p className="text-danger">{errors.gender?.message}</p>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Location</label>
//                 <input {...register("location")} className="form-control" />
//                 <p className="text-danger">{errors.location?.message}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Education */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-body">
//             {sectionHeader(<FaGraduationCap />, "Education")}
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <label className="form-label">Education</label>
//                 <input {...register("education")} className="form-control" />
//                 <p className="text-danger">{errors.education?.message}</p>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Year of Passout</label>
//                 <input {...register("passoutYear")} className="form-control" />
//                 <p className="text-danger">{errors.passoutYear?.message}</p>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">CGPA / Marks</label>
//                 <input {...register("cgpa")} className="form-control" />
//                 <p className="text-danger">{errors.cgpa?.message}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Others */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-body">
//             {sectionHeader(<FaFileAlt />, "Other Details")}
//             <div className="row g-3">
//               <div className="col-md-3">
//                 <label className="form-label">Resume</label>
//                 <input
//                   type="file"
//                   {...register("resume")}
//                   className="form-control"
//                 />
//                 {existingResume && (
//                   <div className="mt-2">
//                     <span className="text-muted">Current: </span>
//                     <a
//                       href={`http://localhost:5000/uploads/Resume/${existingResume}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View Resume
//                     </a>
//                   </div>
//                 )}
//                 <p className="text-danger">{errors.resume?.message}</p>
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Source</label>
//                 <input {...register("source")} className="form-control" />
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Expected CTC</label>
//                 <input {...register("expectedCtc")} className="form-control" />
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Position Applied</label>
//                 <Controller
//                   name="jobPosition"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={jobPositionOptions}
//                       value={jobPositionOptions.find(
//                         (option) => option.value === field.value
//                       )}
//                       onChange={(selectedOption) =>
//                         field.onChange(selectedOption?.value)
//                       }
//                       placeholder="Select Job Position"
//                       isClearable
//                     />
//                   )}
//                 />
//                 <p className="text-danger">{errors.jobPosition?.message}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Experience */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-body">
//             {sectionHeader(<FaBriefcase />, "Experience")}
//             <div className="form-check form-switch mb-3">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 {...register("hasExperience")}
//                 onChange={(e) => setHasExperience(e.target.checked)}
//               />
//               <label className="form-check-label">Has Experience</label>
//             </div>
//             {hasExperience && (
//               <div className="row g-3">
//                 <div className="col-md-3">
//                   <label className="form-label">
//                     Current Company Experience
//                   </label>
//                   <input
//                     className="form-control"
//                     {...register("currentCompanyExperience")}
//                   />
//                   <p className="text-danger">
//                     {errors.currentCompanyExperience?.message}
//                   </p>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Company Name</label>
//                   <input
//                     className="form-control"
//                     {...register("companyName")}
//                   />
//                   <p className="text-danger">{errors.companyName?.message}</p>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Designation</label>
//                   <input
//                     className="form-control"
//                     {...register("designation")}
//                   />
//                   <p className="text-danger">{errors.designation?.message}</p>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Current CTC</label>
//                   <input className="form-control" {...register("currentCtc")} />
//                   <p className="text-danger">{errors.currentCtc?.message}</p>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Notice Period</label>
//                   <input
//                     className="form-control"
//                     {...register("noticePeriod")}
//                   />
//                   <p className="text-danger">{errors.noticePeriod?.message}</p>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label">Total Experience</label>
//                   <input
//                     className="form-control"
//                     {...register("totalExperience")}
//                   />
//                   <p className="text-danger">
//                     {errors.totalExperience?.message}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Interview */}
//         <div className="card shadow-sm mb-4">
//           <div className="card-body">
//             {sectionHeader(<FaComments />, "Interview Details")}
//             <div className="row g-3">
//               <div className="col-md-3">
//                 <label className="form-label">Date</label>
//                 <input
//                   type="date"
//                   {...register("interviewDate")}
//                   className="form-control"
//                   value={formatDateForInput(watch("interviewDate"))}
//                 />
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Time</label>
//                 <input
//                   type="text"
//                   {...register("interviewTime")}
//                   className="form-control"
//                 />
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Interview Mode</label>
//                 <select className="form-select" {...register("interviewMode")}>
//                   <option>Offline</option>
//                   <option>Online</option>
//                 </select>
//               </div>
//               <div className="col-md-3">
//                 <label className="form-label">Round Type</label>
//                 <select {...register("roundType")} className="form-select">
//                   <option value="">Select Round Type</option>
//                   <option value="HR">HR</option>
//                   <option value="Technical">Technical</option>
//                   <option value="Managerial">Managerial</option>
//                   <option value="Final">Final</option>
//                 </select>
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Status</label>
//                 <Controller
//                   name="status"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={statusOptions}
//                       value={statusOptions.find(
//                         (option) => option.value === field.value
//                       )}
//                       onChange={(selectedOption) =>
//                         field.onChange(selectedOption?.value)
//                       }
//                       placeholder="Select Status"
//                       isClearable
//                     />
//                   )}
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Remark</label>
//                 <input {...register("remark")} className="form-control" />
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label">Interviewer Name</label>
//                 <Controller
//                   name="interviewerName"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       {...field}
//                       options={interviewerNameOptions}
//                       value={interviewerNameOptions.find(
//                         (option) => option.value === field.value
//                       )}
//                       onChange={(selectedOption) =>
//                         field.onChange(selectedOption?.value)
//                       }
//                       placeholder="Select Interviewer Name"
//                       isClearable
//                     />
//                   )}
//                 />
//               </div>

//               <div className="col-md-20">
//                 <label className="form-label">Feedback</label>
//                 <textarea
//                   {...register("feedback")}
//                   className="form-control"
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="text-end">
//           <button type="submit" className="btn btn-success px-4">
//             {isEditMode ? "Update Candidate" : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddCandidateForm;

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "./../api";
import Spinner from "./../components/spinner/Spinner";
import CreatableSelect from 'react-select/creatable';
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaComments,
  FaArrowLeft,
  FaFileExcel,
  FaUpload,
  FaDownload,
} from "react-icons/fa";
import * as XLSX from "xlsx";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(
      /^[6-9]\d{9}$/,
      "Phone must be 10 digits and start with Range 6-9"
    ),
  gender: yup.string().required("Gender is required"),
  location: yup.string().required("Location is required"),
  education: yup.string().required("Education is required"),
  passoutYear: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .required("Year is required")
    .typeError("Year must be a number"),
  cgpa: yup.string().required("CGPA or marks are required"),
  jobPosition: yup.string().required("Job position is required"),
  resume: yup
    .mixed()
    .test("fileType", "Only PDF or DOCX files are allowed", (value) => {
      if (!value || value.length === 0) return true;
      return [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(value[0]?.type);
    })
    .test("fileSize", "File is too large (max 2MB)", (value) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 2 * 1024 * 1024;
    }),
  hasExperience: yup.boolean(),
  totalExperience: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Total experience is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  currentCompanyExperience: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Current company experience is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  companyName: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Company name is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  designation: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Designation is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  currentCtc: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Current CTC is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  noticePeriod: yup.string().when("hasExperience", {
    is: true,
    then: () => yup.string().required("Notice period is required"),
    otherwise: () => yup.string().notRequired(),
  }),
});

const AddCandidateForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [hasExperience, setHasExperience] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [interviewerNameOptions, setInterviewerNameOptions] = useState([]);
  const [jobPositionOptions, setJobPositionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingResume, setExistingResume] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelError, setExcelError] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: isEditMode
      ? {
          ...location.state.candidate,
          hasExperience: location.state.candidate.hasExperience || false,
        }
      : {},
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split("T")[0];
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString.split("T")[0] || "";
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const candidate = location.state.candidate;
      setExistingResume(candidate.resumePath);
      setHasExperience(candidate.hasExperience || false);
      reset({
        ...candidate,
        hasExperience: candidate.hasExperience || false,
      });
    }
  }, [isEditMode, location.state, reset]);

  const onSubmit = async (data) => {
    
    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          !(value === "" || value === undefined || value === null)
      )
    );
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in payload) {
        if (key === "resume") {
          if (payload.resume[0]) {
            formData.append("resume", payload.resume[0]);
          }
        } else {
          formData.append(key, payload[key]);
        }
      }

      if (isEditMode) {
        await api.put(`/candidates/${location.state.candidate.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success!", "Candidate updated successfully!", "success");
      } else {
        await api.post("/candidates", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success!", "Candidate added successfully!", "success");
      }
      navigate("/candidate");
      if (!isEditMode) {
        reset();
        setExistingResume(null);
        setHasExperience(false);
        window.scrollTo(0, 0);
        setValue("resume", null);
        document.querySelector('input[type="file"]').value = "";
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Converts Excel date serial to YYYY-MM-DD
  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split("T")[0];
  };

  // Convert Excel time serial to HH:mm
  const excelTimeToJS = (value) => {
    const totalSeconds = Math.round(value * 24 * 60 * 60);
    let hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  };

  const downloadExcelTemplate = () => {
    const templateData = [
      {
        Name: "",
        Email: "",
        Phone: "",
        Gender: "",
        Location: "",
        Education: "",
        "Passout Year": "",
        "CGPA/Marks": "",
        "Job Position": "",
        Source: "",
        "Expected CTC": "",
        "Has Experience": "Yes/No",
        "Current Company Experience": "",
        "Company Name": "",
        Designation: "",
        "Current CTC": "",
        "Notice Period": "",
        "Total Experience": "",
        "Interview Date": "DD-MM-YYYY",
        "Interview Time": "HH:MM AM/PM",
        "Interview Mode": "",
        "Round Type": "",
        Status: "",
        Remark: "",
        "Interviewer Name": "",
        Feedback: "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidate Template");
    XLSX.writeFile(wb, "Candidate_Template.xlsx");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (file && fileTypes.includes(file.type)) {
      setExcelError(null);
      setExcelFile(file);
    } else {
      setExcelError("Please select only Excel file types");
      setExcelFile(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!excelFile) {
      setExcelError("Please select an Excel file first");
      return;
    }

    try {
      setLoading(true);
      const data = await excelFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        throw new Error("Excel file is empty");
      }

      const candidates = jsonData.map((row) => ({
        name: row.Name,
        email: row.Email,
        phone: row.Phone ? String(row.Phone) : "",
        gender: row.Gender,
        location: row.Location,
        education: row.Education,
        passoutYear: row["Passout Year"],
        cgpa: row["CGPA/Marks"],
        jobPosition: row["Job Position"],
        source: row.Source,
        expectedCtc: row["Expected CTC"],
        hasExperience: row["Has Experience"]?.toLowerCase() === "yes" ? 1 : 0,
        currentCompanyExperience: row["Current Company Experience"],
        companyName: row["Company Name"],
        designation: row.Designation,
        currentCtc: row["Current CTC"],
        noticePeriod: row["Notice Period"],
        totalExperience: row["Total Experience"],
        interviewDate:
          typeof row["Interview Date"] === "number"
            ? excelDateToJSDate(row["Interview Date"])
            : row["Interview Date"]
            ? new Date(row["Interview Date"]).toISOString().split("T")[0]
            : null,
        interviewTime:
          typeof row["Interview Time"] === "number"
            ? excelTimeToJS(row["Interview Time"])
            : row["Interview Time"] || "",
        interviewMode: row["Interview Mode"]?.trim() !== "" ? row["Interview Mode"].trim() : "Offline",
        roundType: row["Round Type"],
        status: row.Status?.trim() !== "" ? row.Status : "Pending",
        remark: row.Remark,
        interviewerName: row["Interviewer Name"],
        feedback: row.Feedback,
      }));
      const response = await api.post("/candidates/bulk", { candidates });
      const { successCount, errorCount, errors = [] } = response.data;

      Swal.fire({
        title: "Success!",
        text: `Successfully uploaded ${successCount} candidates.\n Failed: ${errorCount}`,
        icon: "success",
        showCancelButton: errors.length > 0,
        confirmButtonText: "OK",
        cancelButtonText: "Download Errors",
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel && errors.length > 0) {
          // Only include required fields in error export
          const formattedErrors = errors.map((err) => ({
            Name: err.name || "",
            Email: err.email || "",
            Phone: err.phone || "",
            Error: err.error || "Unknown error",
          }));
          const worksheet = XLSX.utils.json_to_sheet(formattedErrors);
          const errorWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(errorWorkbook, worksheet, "Errors");
          XLSX.writeFile(errorWorkbook, "candidatesUpload_errors.xlsx");
        }
        navigate("/candidate");
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Bulk upload failed",
        "error"
      );
    } finally {
      setLoading(false);
      setExcelFile(null);
      document.querySelector('input[type="file"]').value = "";
    }
  };

  const sectionHeader = (icon, title) => (
    <h5 className="card-title border-bottom pb-2 mb-3">
      <span className="me-2">{icon}</span>
      {title}
    </h5>
  );

  useEffect(() => {
  setLoading(true);
  Promise.all([
    api.get("/interviewers"),
    api.get("/status"),
    api.get("/jobposition"),
    api.get("/locations"), // Fetch locations
  ])
    .then(([interviewersRes, statusesRes, jobsRes, locationsRes]) => {
      setInterviewerNameOptions(
        interviewersRes.data.data.map((i) => ({
          value: i.name,
          label: i.name,
        }))
      );
      setStatusOptions(
        statusesRes.data.data.map((s) => ({
          value: s.status_name,
          label: s.status_name,
        }))
      );
      setJobPositionOptions(
        jobsRes.data.data.map((j) => ({
          value: j.job_name,
          label: j.job_name,
        }))
      );
      setLocationOptions(
        locationsRes.data.map((l) => ({
          value: l.location_name,
          label: l.location_name,
        }))
      );
    })
    .catch((err) => {
      console.error("Failed to fetch dropdown data", err);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  return (
    <div className="container my-4">
      {loading && <Spinner />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {isEditMode ? (
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/candidate")}
          >
            <FaArrowLeft className="me-2" />
            Back to list
          </button>
        ) : (
          <h2 className="mb-0">Add New Candidate</h2>
        )}

        {!isEditMode && (
          <div className="dropdown">
            <button
              className="btn btn-outline-success dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUpload className="me-1" />
              Upload Excel
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={downloadExcelTemplate}
                >
                  <FaDownload className="me-2" />
                  Download Format
                </button>
              </li>
              <li>
                <label className="dropdown-item" htmlFor="excelUpload">
                  <FaUpload className="me-2" />
                  Upload Bulk Data
                </label>
                <input
                  id="excelUpload"
                  type="file"
                  className="d-none"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </li>
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Personal Info */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {sectionHeader(<FaUser />, "Personal Information")}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input {...register("name")} className="form-control" />
                <p className="text-danger">{errors.name?.message}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input {...register("email")} className="form-control" />
                <p className="text-danger">{errors.email?.message}</p>
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input {...register("phone")} className="form-control" />
                <p className="text-danger">{errors.phone?.message}</p>
              </div>
              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select {...register("gender")} className="form-select">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <p className="text-danger">{errors.gender?.message}</p>
              </div>
              <div className="col-md-4">
  <label className="form-label">Location</label>
  <Controller
    name="location"
    control={control}
    render={({ field }) => (
      <CreatableSelect
        {...field}
        options={locationOptions}
        value={locationOptions.find((option) => option.value === field.value)}
        onChange={(selectedOption) => {
          const value = selectedOption ? selectedOption.value : "";
          field.onChange(value);
        }}
        placeholder="Select or type a location"
        isClearable
        isSearchable
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      />
    )}
  />
  <p className="text-danger">{errors.location?.message}</p>
</div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {sectionHeader(<FaGraduationCap />, "Education")}
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Education</label>
                <input {...register("education")} className="form-control" />
                <p className="text-danger">{errors.education?.message}</p>
              </div>
              <div className="col-md-4">
                <label className="form-label">Year of Passout</label>
                <input {...register("passoutYear")} className="form-control" />
                <p className="text-danger">{errors.passoutYear?.message}</p>
              </div>
              <div className="col-md-4">
                <label className="form-label">CGPA / Marks</label>
                <input {...register("cgpa")} className="form-control" />
                <p className="text-danger">{errors.cgpa?.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Others */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {sectionHeader(<FaFileAlt />, "Other Details")}
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Resume</label>
                <input
                  type="file"
                  {...register("resume")}
                  className="form-control"
                />
                {existingResume && (
                  <div className="mt-2">
                    <span className="text-muted">Current: </span>
                    <a
                      href={`http://localhost:5000/uploads/Resume/${existingResume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                <p className="text-danger">{errors.resume?.message}</p>
              </div>
              <div className="col-md-3">
                <label className="form-label">Source</label>
                <input {...register("source")} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Expected CTC</label>
                <input {...register("expectedCtc")} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Position Applied</label>
                <Controller
                  name="jobPosition"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={jobPositionOptions}
                      value={jobPositionOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      placeholder="Select Job Position"
                      isClearable
                    />
                  )}
                />
                <p className="text-danger">{errors.jobPosition?.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {sectionHeader(<FaBriefcase />, "Experience")}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                {...register("hasExperience")}
                onChange={(e) => setHasExperience(e.target.checked)}
              />
              <label className="form-check-label">Has Experience</label>
            </div>
            {hasExperience && (
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">
                    Current Company Experience
                  </label>
                  <input
                    className="form-control"
                    {...register("currentCompanyExperience")}
                  />
                  <p className="text-danger">
                    {errors.currentCompanyExperience?.message}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Company Name</label>
                  <input
                    className="form-control"
                    {...register("companyName")}
                  />
                  <p className="text-danger">{errors.companyName?.message}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    {...register("designation")}
                  />
                  <p className="text-danger">{errors.designation?.message}</p>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Current CTC</label>
                  <input className="form-control" {...register("currentCtc")} />
                  <p className="text-danger">{errors.currentCtc?.message}</p>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Notice Period</label>
                  <input
                    className="form-control"
                    {...register("noticePeriod")}
                  />
                  <p className="text-danger">{errors.noticePeriod?.message}</p>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Total Experience</label>
                  <input
                    className="form-control"
                    {...register("totalExperience")}
                  />
                  <p className="text-danger">
                    {errors.totalExperience?.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            {sectionHeader(<FaComments />, "Interview Details")}
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  {...register("interviewDate")}
                  className="form-control"
                  // value={formatDateForInput(("interviewDate"))}
                  value={formatDateForInput(watch("interviewDate"))}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  {...register("interviewTime")}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Interview Mode</label>
                <select className="form-select" {...register("interviewMode")}>
                  <option>Offline</option>
                  <option>Online</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Round Type</label>
                <select {...register("roundType")} className="form-select">
                  <option value="">Select Round Type</option>
                  <option value="HR">HR</option>
                  <option value="Technical">Technical</option>
                  <option value="Final">Final</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={statusOptions}
                      value={statusOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      placeholder="Select Status"
                      isClearable
                    />
                  )}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Remark</label>
                <input {...register("remark")} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Interviewer Name</label>
                <Controller
                  name="interviewerName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={interviewerNameOptions}
                      value={interviewerNameOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      placeholder="Select Interviewer Name"
                      isClearable
                    />
                  )}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Feedback</label>
                <textarea
                  {...register("feedback")}
                  className="form-control"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4">
            {isEditMode ? "Update Candidate" : "Submit"}
          </button>
        </div>
      </form>

      {excelFile && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Candidates</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setExcelFile(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Ready to upload {excelFile.name}?</p>
                {excelError && <p className="text-danger">{excelError}</p>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setExcelFile(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBulkUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCandidateForm;
