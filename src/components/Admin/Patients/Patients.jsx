// Import necessary components and libraries
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./Patients.css";
import { Modal } from "antd"; // Import Modal from Ant Design
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [confirmBanModalVisible, setConfirmBanModalVisible] = useState(false); // State to control ban confirmation modal
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State to store selected patient ID
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [selectedGender, setSelectedGender] = useState(""); // State to store selected gender
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/patient"
        );
        if (response.status === 200 && response.data.success) {
          setPatients(response.data.data);
          setLoading(false);
        } else {
          console.error("Error fetching patients:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleActionClick = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleBanClick = (id) => {
    setSelectedPatientId(id);
    setConfirmBanModalVisible(true);
  };

  const handleConfirmBan = async () => {
    try {
      // Call API to block patient
      await axios.post(
        `http://localhost:5050/api/v1/admin/block/patient/${selectedPatientId}`
      );

      // Update patient list after successful block
      const response = await axios.get("http://localhost:5050/api/v1/patient");
      if (response.status === 200 && response.data.success) {
        setPatients(response.data.data);
        setLoading(false);
        toast.success("You Blocked A Patient !"); // Display toast notification
      } else {
        console.error("Error fetching patients:", response.data.message);
      }

      // Close modal after successful block
      setConfirmBanModalVisible(false);
      setSelectedPatientId(null); // Clear selected patient ID
    } catch (error) {
      console.error("Error blocking patient:", error);
      toast.error("Có lỗi xảy ra khi ban bệnh nhân.");
    }
  };

  const handleCancelBan = () => {
    setConfirmBanModalVisible(false);
    setSelectedPatientId(null);
  };

  const handleUnbanClick = async (id) => {
    try {
      // Call API to unblock patient
      await axios.post(
        `http://localhost:5050/api/v1/admin/unblock/patient/${id}`
      );

      // Update patient list after successful unblock
      const response = await axios.get(
        `http://localhost:5050/api/v1/patient/${id}`
      );
      if (response.status === 200 && response.data.success) {
        const updatedPatient = response.data.data;
        const updatedPatients = patients.map((patient) =>
          patient._id === id ? { ...updatedPatient, isBlocked: false } : patient
        );
        setPatients(updatedPatients);
        toast.success("You Unblocked A Patient !"); // Display toast notification
      } else {
        console.error(
          "Error fetching updated patient data:",
          response.data.message
        );
        toast.error("Có lỗi xảy ra khi unban bệnh nhân.");
      }
    } catch (error) {
      console.error("Error unblocking patient:", error);
      toast.error("Có lỗi xảy ra khi unban bệnh nhân.");
    }
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".actions")) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenderChange = (event) => {
  setSelectedGender(event.target.value);
};

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearchTerm = `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender
      ? patient.gender && patient.gender.toLowerCase() === selectedGender.toLowerCase()
      : true;
    const matchesDate = selectedDate
      ? new Date(patient.createdAt).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;
    return matchesSearchTerm && matchesGender && matchesDate;
  });

  return (
    <AdminLayout>
      <div className="form-wrapper">
        <input
          type="text"
          placeholder='Search "Patients"'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={selectedGender} onChange={handleGenderChange}>
          <option value="">Gender...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="patient-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Created At</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient._id}
                  className={`patient-row ${
                    patient.isBlocked ? "blocked" : ""
                  }`}
                >
                  <td>
                    <Link to={`/admin/patient/${patient._id}`}>
                      {`${patient.firstName} ${patient.lastName}`}
                    </Link>
                  </td>
                  <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td>{patient.email}</td>
                  <td>{patient.gender}</td>
                  <td className="actions">
                    <button
                      className="action-btn"
                      onClick={() => handleActionClick(patient._id)}
                    >
                    </button>
                    {activeDropdown === patient._id && (
                      <div className="dropdown-content show">
                        {patient.isBlocked ? (
                          <button onClick={() => handleUnbanClick(patient._id)}>
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanClick(patient._id)}
                            disabled={patient.isBlocked}
                          >
                            Block
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Link to="/admin/createPatient">
        <button className="floating-action-btn">+</button>
      </Link>

      {/* Ban Confirmation Modal */}
      <Modal
        title="Ban Patient"
        open={confirmBanModalVisible}
        onOk={handleConfirmBan}
        onCancel={handleCancelBan}
      >
        <p>Are you sure you want to ban this patient?</p>
      </Modal>

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </AdminLayout>
  );
};

export default Patients;
