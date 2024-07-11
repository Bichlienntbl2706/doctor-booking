import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateDoctor.css";

const CreateDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    clinicName: "",
    clinicAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    price: "",
    specialization: "",
    degree: "",
    college: "",
    completionYear: "",
    experience: "",
    designation: "",
    award: "",
    awardYear: "",
    registration: "",
    year: "",
    experienceHospitalName: "",
    img: null,
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
        'http://localhost:5050/api/v1/doctor',
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
      console.error('Error saving doctor:', error.response ? error.response.data : error.message);

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while creating the account.");
      }
    }
  };

  return (
    <div className="create-doctor-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Create Doctor Acccount
      </button>
      <form className="create-doctor-form" onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
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
          <label>Clinic Name</label>
          <input
            type="text"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
          />
          {errors.clinicName && <div className="error">{errors.clinicName}</div>}
        </div>
        <div className="form-group">
          <label>Clinic Address</label>
          <input
            type="text"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
          />
          {errors.clinicAddress && <div className="error">{errors.clinicAddress}</div>}
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
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
          {errors.postalCode && <div className="error">{errors.postalCode}</div>}
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
          {errors.specialization && <div className="error">{errors.specialization}</div>}
        </div>
        <div className="form-group">
          <label>Degree</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
          />
          {errors.degree && <div className="error">{errors.degree}</div>}
        </div>
        <div className="form-group">
          <label>College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
          />
          {errors.college && <div className="error">{errors.college}</div>}
        </div>
        <div className="form-group">
          <label>Completion Year</label>
          <input
            type="text"
            name="completionYear"
            value={formData.completionYear}
            onChange={handleChange}
          />
          {errors.completionYear && <div className="error">{errors.completionYear}</div>}
        </div>
        <div className="form-group">
          <label>Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          {errors.experience && <div className="error">{errors.experience}</div>}
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
          {errors.designation && <div className="error">{errors.designation}</div>}
        </div>
        <div className="form-group">
          <label>Award</label>
          <input
            type="text"
            name="award"
            value={formData.award}
            onChange={handleChange}
          />
          {errors.award && <div className="error">{errors.award}</div>}
        </div>
        <div className="form-group">
          <label>Award Year</label>
          <input
            type="text"
            name="awardYear"
            value={formData.awardYear}
            onChange={handleChange}
          />
          {errors.awardYear && <div className="error">{errors.awardYear}</div>}
        </div>
        <div className="form-group">
          <label>Registration</label>
          <input
            type="text"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
          />
          {errors.registration && <div className="error">{errors.registration}</div>}
        </div>
        <div className="form-group">
          <label>Year</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
          {errors.year && <div className="error">{errors.year}</div>}
        </div>
        <div className="form-group">
          <label>Experience Hospital Name</label>
          <input
            type="text"
            name="experienceHospitalName"
            value={formData.experienceHospitalName}
            onChange={handleChange}
          />
          {errors.experienceHospitalName && <div className="error">{errors.experienceHospitalName}</div>}
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

export default CreateDoctor;
