import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CreatePatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bloodGroup: "",
    mobile: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "",
    country: "",
    email: "",
    address: "",
    img: null,
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, img: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      img: formData.img ? URL.createObjectURL(formData.img) : null,
    };

    try {
      const response = await axios.post(
        'http://localhost:5050/api/v1/patient',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success("You have successfully created a new account!");

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error('Error saving patient:', error.response ? error.response.data : error.message);

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while creating the account.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        &larr; Create Patient Account
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <div className="mb-3 p-3 border border-primary rounded text-center">
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              className="form-control"
            />
            <p className="mt-2">Drag your image here</p>
            <span className="text-muted">(Only *.jpeg and *.png images will be accepted)</span>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-control"
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-control"
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-control"
          />
          {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="form-control"
          />
          {errors.bloodGroup && <div className="text-danger">{errors.bloodGroup}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="form-control"
          />
          {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-control"
          />
          {errors.city && <div className="text-danger">{errors.city}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="form-control"
          />
          {errors.state && <div className="text-danger">{errors.state}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="form-control"
          />
          {errors.zipCode && <div className="text-danger">{errors.zipCode}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-control"
          />
          {errors.country && <div className="text-danger">{errors.country}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-info">
            Save Changes
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreatePatient;
