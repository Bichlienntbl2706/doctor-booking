import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout/AdminLayout";
import { Modal, Input } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [confirmBanModalVisible, setConfirmBanModalVisible] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPhoneTerm, setSearchPhoneTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/doctor");

        if (response.status === 200 && response.data.success) {
          setDoctors(response.data.data.data);
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
      await axios.post(`http://localhost:5050/api/v1/admin/block/doctor/${selectedDoctorId}`, { reason: blockReason });

      const response = await axios.get("http://localhost:5050/api/v1/doctor");
      if (response.status === 200 && response.data.success) {
        setDoctors(response.data.data.data);
        setLoading(false);
        toast.success("You Blocked a Doctor!");
      } else {
        console.error("Error fetching doctors:", response.data.message);
      }

      setConfirmBanModalVisible(false);
      setSelectedDoctorId(null);
      setBlockReason("");
    } catch (error) {
      console.error("Error blocking doctor:", error);
      toast.error("Có lỗi xảy ra khi block bác sĩ.");
    }
  };

  const handleCancelBan = () => {
    setConfirmBanModalVisible(false);
    setSelectedDoctorId(null);
    setBlockReason("");
  };

  const handleUnbanClick = async (id) => {
    try {
      await axios.post(`http://localhost:5050/api/v1/admin/unblock/doctor/${id}`);

      const response = await axios.get(`http://localhost:5050/api/v1/doctor/${id}`);
      if (response.status === 200 && response.data.success) {
        const updatedDoctor = response.data.data;
        const updatedDoctors = doctors.map((doctor) =>
          doctor._id === id ? { ...updatedDoctor, isBlocked: false } : doctor
        );
        setDoctors(updatedDoctors);
        toast.success("You Unblocked a Doctor!");
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
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder='Search "Doctors"'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="input-group ms-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Phone Number"
              value={searchPhoneTerm}
              onChange={handlePhoneSearchChange}
            />
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
                  <th>Doctor</th>
                  <th>Created At</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className={doctor.isBlocked ? "table-secondary" : ""}>
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
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleActionClick(doctor._id)}
                      >
                        ...
                      </button>
                      {activeDropdown === doctor._id && (
                        <div className="dropdown-menu show">
                          {doctor.isBlocked ? (
                            <button
                              className="dropdown-item"
                              onClick={() => handleUnbanClick(doctor._id)}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              className="dropdown-item"
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
                ))}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan="5">No doctors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <Link to="/admin/createDoctor">
          <button className="btn btn-primary btn-lg rounded-circle position-fixed" style={{ bottom: '2rem', right: '2rem', width: '4rem', height: '4rem' }}>
            +
          </button>
        </Link>

        {/* Ban Confirmation Modal */}
        <Modal
          title="Ban Doctor"
          visible={confirmBanModalVisible}
          onOk={handleConfirmBan}
          onCancel={handleCancelBan}
          okButtonProps={{ disabled: !blockReason }}
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
      </div>
    </AdminLayout>
  );
};

export default Doctors;
