import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout/AdminLayout";
import axios from "axios";
import "./Prescriptions.css";

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
          const prescriptionsData = response.data.data; // Lấy dữ liệu đơn thuốc từ phản hồi
          setPrescriptions(prescriptionsData); // Lưu dữ liệu vào state
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
        <table>
          <thead>
            <tr>
              <th>Appointment Id</th>
              <th>Disease</th>
              <th>Follow-Up Date</th>
              <th>Archived</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                // Prescriptions.js

                <tr key={prescription._id}>
                  <td>
                    <span className="appointment-id">
                      {prescription.appointmentId.trackingId}
                    </span>
                  </td>
                  <td>
                    <span className="disease">{prescription.disease}</span>
                  </td>
                  <td className="follow-up-date">
                    {prescription.followUpdate}
                  </td>
                  <td className="archived">
                    <span className="status">
                      {prescription.isArchived ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="created-at">
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
                    <button onClick={() => handleView(prescription._id)}>
                      👁️
                    </button>
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
    </AdminLayout>
  );
};

export default Prescriptions;
