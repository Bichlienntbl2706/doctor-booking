import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./Doctors.css";
import { Modal, Input } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [confirmBanModalVisible, setConfirmBanModalVisible] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [blockReason, setBlockReason] = useState(""); // State for block reason
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPhoneTerm, setSearchPhoneTerm] = useState(""); // State for phone number search
  const [selectedDate, setSelectedDate] = useState("");

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/doctor");
        console.log("API response:", response);

        if (response.status === 200 && response.data.success) {
          const doctorsData = response.data.data.data;
          console.log("Doctors data:", doctorsData);

          if (Array.isArray(doctorsData)) {
            setDoctors(doctorsData);
          } else {
            console.error("Fetched doctors data is not an array:", doctorsData);
          }
          setLoading(false);
        } else {
          console.error("Error fetching doctors:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleActionClick = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleBanClick = (id) => {
    setSelectedDoctorId(id);
    setConfirmBanModalVisible(true);
  };

  const handleConfirmBan = async () => {
    try {
      // Call API to block doctor with reason
      await axios.post(`http://localhost:5050/api/v1/admin/block/doctor/${selectedDoctorId}`, { reason: blockReason });

      // Update doctor list after successful block
      const response = await axios.get("http://localhost:5050/api/v1/doctor");
      if (response.status === 200 && response.data.success) {
        const doctorsData = response.data.data.data;
        setDoctors(doctorsData); // Update state with updated doctors list
        setLoading(false);
        toast.success("You Blocked a Doctor!"); // Display toast notification
      } else {
        console.error("Error fetching doctors:", response.data.message);
      }

      // Close modal after successful block
      setConfirmBanModalVisible(false);
      setSelectedDoctorId(null); // Clear selected doctor ID
      setBlockReason(""); // Clear block reason
    } catch (error) {
      console.error("Error blocking doctor:", error);
      toast.error("Có lỗi xảy ra khi block bác sĩ.");
    }
  };

  const handleCancelBan = () => {
    setConfirmBanModalVisible(false);
    setSelectedDoctorId(null);
    setBlockReason(""); // Clear block reason
  };

  const handleUnbanClick = async (id) => {
    try {
      // Call API to unblock doctor
      await axios.post(`http://localhost:5050/api/v1/admin/unblock/doctor/${id}`);

      // Update doctor list after successful unblock
      const response = await axios.get(`http://localhost:5050/api/v1/doctor/${id}`);
      if (response.status === 200 && response.data.success) {
        const updatedDoctor = response.data.data;
        const updatedDoctors = doctors.map((doctor) =>
          doctor._id === id ? { ...updatedDoctor, isBlocked: false } : doctor
        );
        setDoctors(updatedDoctors);
        toast.success("You Unblocked a Doctor!"); // Display toast notification
      } else {
        console.error("Error fetching updated doctor data:", response.data.message);
        toast.error("Có lỗi xảy ra khi unban bác sĩ.");
      }
    } catch (error) {
      console.error("Error unblocking doctor:", error);
      toast.error("Có lỗi xảy ra khi unban bác sĩ.");
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

  const handlePhoneSearchChange = (event) => {
    setSearchPhoneTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearchTerm = `${doctor.firstName} ${doctor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPhoneTerm = searchPhoneTerm
      ? String(doctor.phone).includes(searchPhoneTerm)
      : true;
    const matchesDate = selectedDate
      ? new Date(doctor.createdAt).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;
    return matchesSearchTerm && matchesPhoneTerm && matchesDate;
  });

  return (
    <AdminLayout>
      <div className="form-wrapper">
        <input
          type="text"
          placeholder='Search "Doctors"'
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <input
          type="text"
          placeholder='Search by Phone Number'
          value={searchPhoneTerm}
          onChange={handlePhoneSearchChange}
        />

        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="doctor-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Created At</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredDoctors) && filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className={`doctor-row ${doctor.isBlocked ? 'blocked' : ''}`}>
                    <td>
                      <Link to={`/admin/doctor/${doctor._id}`}>
                        {`${doctor.firstName} ${doctor.lastName}`}
                      </Link>
                    </td>
                    <td>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td className="actions">
                      <button
                        className="action-btn"
                        onClick={() => handleActionClick(doctor._id)}
                      >
                      </button>
                      {activeDropdown === doctor._id && (
                        <div className="dropdown-content show">
                          {doctor.isBlocked ? (
                            <button onClick={() => handleUnbanClick(doctor._id)}>
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanClick(doctor._id)}
                              disabled={doctor.isBlocked}
                            >
                              Block
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No doctors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <Link to="/admin/createDoctor">
        <button className="floating-action-btn">+</button>
      </Link>

      {/* Ban Confirmation Modal */}
      <Modal
        title="Ban Doctor"
        visible={confirmBanModalVisible}
        onOk={handleConfirmBan}
        onCancel={handleCancelBan}
        okButtonProps={{ disabled: !blockReason }} // Disable OK button if blockReason is empty
      >
        <p>Are you sure you want to ban this doctor?</p>
        <Input
          placeholder="Enter reason for blocking"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
        />
      </Modal>

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </AdminLayout>
  );
};

export default Doctors;
