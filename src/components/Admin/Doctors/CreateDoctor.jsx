import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
        "http://localhost:5050/api/v1/doctor",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("You have successfully created a new account!");

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving doctor:",
        error.response ? error.response.data : error.message
      );

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
        &larr; Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <div className="border border-info rounded p-3 text-center">
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              className="form-control"
            />
            <p className="mt-2 mb-1">Drag your image here</p>
            <span className="text-muted">
              (Only *.jpeg and *.png images will be accepted)
            </span>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.firstName && (
            <div className="text-danger">{errors.firstName}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.lastName && (
            <div className="text-danger">{errors.lastName}</div>
          )}
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
          {errors.dateOfBirth && (
            <div className="text-danger">{errors.dateOfBirth}</div>
          )}
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
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
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
          {errors.address && (
            <div className="text-danger">{errors.address}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Clinic Name</label>
          <input
            type="text"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.clinicName && (
            <div className="text-danger">{errors.clinicName}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Clinic Address</label>
          <input
            type="text"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            className="form-control"
          />
          {errors.clinicAddress && (
            <div className="text-danger">{errors.clinicAddress}</div>
          )}
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
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-control"
          />
          {errors.country && (
            <div className="text-danger">{errors.country}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="form-control"
          />
          {errors.postalCode && (
            <div className="text-danger">{errors.postalCode}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
          />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="form-control"
          />
          {errors.specialization && (
            <div className="text-danger">{errors.specialization}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Degree</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="form-control"
          />
          {errors.degree && <div className="text-danger">{errors.degree}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="form-control"
          />
          {errors.college && (
            <div className="text-danger">{errors.college}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Completion Year</label>
          <input
            type="text"
            name="completionYear"
            value={formData.completionYear}
            onChange={handleChange}
            className="form-control"
          />
          {errors.completionYear && (
            <div className="text-danger">{errors.completionYear}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="form-control"
          />
          {errors.experience && (
            <div className="text-danger">{errors.experience}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="form-control"
          />
          {errors.designation && (
            <div className="text-danger">{errors.designation}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Award</label>
          <input
            type="text"
            name="award"
            value={formData.award}
            onChange={handleChange}
            className="form-control"
          />
          {errors.award && <div className="text-danger">{errors.award}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Award Year</label>
          <input
            type="text"
            name="awardYear"
            value={formData.awardYear}
            onChange={handleChange}
            className="form-control"
          />
          {errors.awardYear && (
            <div className="text-danger">{errors.awardYear}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Registration</label>
          <input
            type="text"
            name="registration"
            value={formData.registration}
            onChange={handleChange}
            className="form-control"
          />
          {errors.registration && (
            <div className="text-danger">{errors.registration}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-control"
          />
          {errors.year && <div className="text-danger">{errors.year}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Experience Hospital Name</label>
          <input
            type="text"
            name="experienceHospitalName"
            value={formData.experienceHospitalName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.experienceHospitalName && (
            <div className="text-danger">{errors.experienceHospitalName}</div>
          )}
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

export default CreateDoctor;
