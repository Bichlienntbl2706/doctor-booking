import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePatient.css";

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
    <div className="create-patient-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Create Patient Account
      </button>
      <form className="create-patient-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profile Image</label>
          <div className="profile-image-upload">
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
            />
            <p>Drag your image here</p>
            <span>(Only *.jpeg and *.png images will be accepted)</span>
          </div>
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}
        </div>
        <div className="form-group">
          <label>Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          />
          {errors.bloodGroup && <div className="error">{errors.bloodGroup}</div>}
        </div>
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <div className="error">{errors.mobile}</div>}
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <div className="error">{errors.city}</div>}
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && <div className="error">{errors.state}</div>}
        </div>
        <div className="form-group">
          <label>Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
          {errors.zipCode && <div className="error">{errors.zipCode}</div>}
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="error">{errors.gender}</div>}
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
          {errors.country && <div className="error">{errors.country}</div>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="error">{errors.address}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreatePatient;
