import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import { Input, Modal } from "antd"; // Import Modal from Ant Design
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [confirmBanModalVisible, setConfirmBanModalVisible] = useState(false); // State to control ban confirmation modal
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State to store selected patient ID
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [selectedGender, setSelectedGender] = useState(""); // State to store selected gender
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [confirmUnbanModalVisible, setConfirmUnbanModalVisible] = useState(false);
  const [selectedUnbanPatient, setSelectedUnbanPatient] = useState(null);

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

  const [blockReason, setBlockReason] = useState(""); // State to store block reason

  const handleBlockReasonChange = (event) => {
    setBlockReason(event.target.value);
  };

  const handleConfirmBan = async () => {
    try {
      const patientToBlock = patients.find((patient) => patient._id === selectedPatientId);
      if (!patientToBlock) {
        console.error("Patient not found for blocking.");
        return;
      }
  
      await axios.post(`http://localhost:5050/api/v1/admin/block/patient/${selectedPatientId}`, { reason: blockReason });
  
      // Cập nhật trạng thái bệnh nhân trong danh sách mà không cần tải lại trang
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === selectedPatientId
            ? { ...patient, isBlocked: true }
            : patient
        )
      );
  
      toast.success(`You blocked patient. ${patientToBlock.firstName} ${patientToBlock.lastName}!`);
  
      setConfirmBanModalVisible(false);
      setSelectedPatientId(null);
      setBlockReason("");
    } catch (error) {
      console.error("Error blocking patient:", error);
      toast.error("Có lỗi xảy ra khi block patient.");
    }
  };

  const handleCancelBan = () => {
    setConfirmBanModalVisible(false);
    setSelectedPatientId(null);
  };

  const handleUnbanClick = (id) => {
    const selectedPatient = patients.find((patient) => patient._id === id);
    setSelectedUnbanPatient(selectedPatient);
    setConfirmUnbanModalVisible(true);
  };

  const handleConfirmUnban = async () => {
    try {
      await axios.post(`http://localhost:5050/api/v1/admin/unblock/patient/${selectedUnbanPatient._id}`);
  
      // Cập nhật trạng thái bệnh nhân trong danh sách mà không cần tải lại trang
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient._id === selectedUnbanPatient._id
            ? { ...patient, isBlocked: false }
            : patient
        )
      );
  
      toast.success(`You unblocked Patient. ${selectedUnbanPatient.firstName} ${selectedUnbanPatient.lastName}!`);
  
      setConfirmUnbanModalVisible(false);
      setSelectedUnbanPatient(null);
    } catch (error) {
      console.error("Error unblocking patient:", error);
      toast.error("Có lỗi xảy ra khi unban bệnh nhân.");
    }
  };

  const handleCancelUnban = () => {
    setConfirmUnbanModalVisible(false);
    setSelectedUnbanPatient(null);
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

  const filteredPatients = (patients || []).filter((patient) => {
    const matchesSearchTerm = `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender
      ? patient.gender &&
        patient.gender.toLowerCase() === selectedGender.toLowerCase()
      : true;
    const matchesDate = selectedDate
      ? new Date(patient.createdAt).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;
    return matchesSearchTerm && matchesGender && matchesDate;
  });

  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder='Search "Patients"'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="input-group ms-3">
            <select
              className="form-select"
              value={selectedGender}
              onChange={handleGenderChange}
            >
              <option value="">Gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="input-group ms-3">
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="table-responsive">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-hover">
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
                    className={patient.isBlocked ? "table-secondary" : ""}
                    style={{
                      backgroundColor: patient.isBlocked
                        ? "#d3d3d3"
                        : "#ffffff",
                    }}
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
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleActionClick(patient._id)}
                      >
                        ...
                      </button>
                      {activeDropdown === patient._id && (
                        <div className="dropdown-menu show">
                          {patient.isBlocked ? (
                            <button
                              className="dropdown-item"
                              onClick={() => handleUnbanClick(patient._id)}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="dropdown-item"
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
          <button
            className="btn btn-primary btn-lg rounded-circle position-fixed"
            style={{
              bottom: "2rem",
              right: "2rem",
              width: "4rem",
              height: "4rem",
            }}
          >
            +
          </button>
        </Link>

        <Modal
          title="Ban Patient"
          visible={confirmBanModalVisible}
          onOk={handleConfirmBan}
          onCancel={handleCancelBan}
          okButtonProps={{ disabled: !blockReason }}
        >
          <p>
            Are you sure you want to block patient. {selectedPatientId?.firstName}{" "}
            {selectedPatientId?.lastName}?
          </p>
          <Input
            placeholder="Enter reason for blocking"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
          />
        </Modal>

        <Modal
          title="Unban Patient"
          visible={confirmUnbanModalVisible}
          onOk={handleConfirmUnban}
          onCancel={handleCancelUnban}
        >
          <p>
            Are you sure you want to unblock Patient.{" "}
            {selectedUnbanPatient?.firstName} {selectedUnbanPatient?.lastName}?
          </p>
        </Modal>

        <ToastContainer />
      </div>
    </AdminLayout>
  );
};

export default Patients;
