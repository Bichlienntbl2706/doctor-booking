import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import { Badge, Button } from "react-bootstrap";
import { Tag } from "antd";
import { FaRegEye } from "react-icons/fa";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/prescription"
        );
        if (response.status === 200 && response.data.success) {
          const prescriptionsData = response.data.data;
          setPrescriptions(prescriptionsData);
        } else {
          console.error("Error fetching prescriptions:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error.message);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleView = (id) => {
    navigate(`/admin/prescriptions/${id}`);
  };

  return (
    <AdminLayout>
      <div className="form-wrapper">
        {/* Add any filters or search inputs if needed */}
      </div>
      <div className="prescription-list">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Appointment Id</th>
                <th>Disease</th>
                <th>Archived</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td>
                      <Badge bg="warning" text="dark">
                        {prescription.appointmentId.trackingId}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="success">{prescription.disease}</Badge>
                    </td>
                    <td>
                      <Tag color={prescription.isArchived ? "#87d068" : "#108ee9"}>{prescription.isArchived ? "Yes" : "No"}</Tag>
                      {/* <Badge bg={prescription.isArchived ? "danger" : "info"}>
                        {prescription.isArchived ? "Yes" : "No"}
                      </Badge> */}
                    </td>
                    <td>
                      {new Date(prescription.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(prescription._id)}
                      >
                        <FaRegEye /> View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No prescriptions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Prescriptions;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminLayout from "../AdminLayout/AdminLayout";
// import axios from "axios";
// import { Badge, Button } from "react-bootstrap";

// const Prescriptions = () => {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPrescriptions = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5050/api/v1/prescription"
//         );
//         if (response.status === 200 && response.data.success) {
//           const prescriptionsData = response.data.data;
//           setPrescriptions(prescriptionsData);
//         } else {
//           console.error("Error fetching prescriptions:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching prescriptions:", error.message);
//       }
//     };

//     fetchPrescriptions();
//   }, []);

//   const handleView = (id) => {
//     navigate(`/admin/prescriptions/${id}`);
//   };

//   return (
//     <AdminLayout>
//       <div className="form-wrapper">
//         {/* Add any filters or search inputs if needed */}
//       </div>
//       <div className="prescription-list">
//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead>
//               <tr>
//                 <th>Appointment Id</th>
//                 <th>Disease</th>
//                 <th>Follow-Up Date</th>
//                 <th>Archived</th>
//                 <th>Created At</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {prescriptions.length > 0 ? (
//                 prescriptions.map((prescription) => (
//                   <tr key={prescription._id}>
//                     <td>
//                       <Badge bg="warning" text="dark">
//                         {prescription.appointmentId.trackingId}
//                       </Badge>
//                     </td>
//                     <td>
//                       <Badge bg="success">{prescription.disease}</Badge>
//                     </td>
//                     <td>{prescription.followUpdate}</td>
//                     <td>
//                       <Badge bg={prescription.isArchived ? "danger" : "info"}>
//                         {prescription.isArchived ? "Yes" : "No"}
//                       </Badge>
//                     </td>
//                     <td>
//                       {new Date(prescription.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                           hour: "numeric",
//                           minute: "numeric",
//                           hour12: true,
//                         }
//                       )}
//                     </td>
//                     <td>
//                       <Button
//                         variant="primary"
//                         size="sm"
//                         onClick={() => handleView(prescription._id)}
//                       >
//                         👁️ View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6">No prescriptions found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Prescriptions;
