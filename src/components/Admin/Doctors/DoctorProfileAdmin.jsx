import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useGetDoctorQuery, useUpdateDoctorMutation } from "../../../redux/api/doctorApi";
import { message } from "antd";
import dImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import { useForm } from "react-hook-form";
import ImageUpload from "../../UI/form/ImageUpload";
import AdminLayout from "../AdminLayout/AdminLayout";

const DoctorProfileAdmin = () => {
  const { id } = useParams();
  const { data: doctorData, isLoading, isError, error } = useGetDoctorQuery(id);

  const { register, handleSubmit, setValue } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [date, setDate] = useState(null);
  const [file, setFile] = useState(null);
  const [selectValue, setSelectValue] = useState({});

  const [updateDoctor, { isLoading: updateLoading, isSuccess, isError: isUpdateError, error: updateError }] = useUpdateDoctorMutation();

  const onChange = (date, dateString) => {
    setDate(moment(dateString).format());
  };

  useEffect(() => {
    if (doctorData) {
      setValue("firstName", doctorData.firstName);
      setValue("lastName", doctorData.lastName);
      setValue("email", doctorData.email);
      setValue("dateOfBirth", moment(doctorData?.dob).format("YYYY-MM-DD"));
      setValue("phone", doctorData.phone);
      setValue("specialization", doctorData.specialization);
      setValue("education", doctorData.education);
      setValue("experience", doctorData.experience);
      setValue("city", doctorData.city);
      setValue("state", doctorData.state);
      setValue("zipCode", doctorData.zipCode);
      setValue("country", doctorData.country);
      setValue("address", doctorData.address);
      setValue("dob", moment(doctorData.dob).format("YYYY-MM-DD"));
      setValue("gender", doctorData.gender);
    }
  }, [doctorData, setValue]);

  useEffect(() => {
    if (!isLoading && isError) {
      message.error(error?.data?.message);
    }
    if (isSuccess) {
      message.success("Profile updated successfully");
    }
    if (!updateLoading && isUpdateError) {
      message.error(updateError?.data?.message);
    }
  }, [isLoading, isError, error, isSuccess, updateLoading, isUpdateError, updateError]);

  const onSubmit = (data) => {
    const obj = data;
    const newObj = { ...obj, ...selectValue };
    if (date) {
      newObj["dateOfBirth"] = date;
    }
    const changedValue = Object.fromEntries(Object.entries(newObj).filter(([key, value]) => value !== ""));
    const formData = new FormData();
    if (selectedImage) {
      formData.append("file", file);
    }
    const changeData = JSON.stringify(changedValue);
    formData.append("data", changeData);
    updateDoctor({ data: formData, id });
  };

  if (isLoading || !doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: "10rem" }}>
        <div className="w-100 mb-3 rounded mb-5 p-2 profile-container">
          <h5 className="text-title mb-2 mt-3">Doctor Profile</h5>
          <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-md-12">
              <div className="form-group">
                <div className="change-avatar d-flex gap-2 align-items-center">
                  <Link to={"/"} className="my-3 patient-img">
                    <img src={selectedImage ? selectedImage : dImage} alt="" />
                  </Link>
                  <div className="mt-3">
                    <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>First Name</label>
                <input {...register("firstName")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Last Name</label>
                <input {...register("lastName")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Email</label>
                <input {...register("email", { readOnly: true })} className="form-control" disabled />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "10px"}}>Date of Birth {moment(doctorData?.dob).format("LL")}</label>
                <DatePicker onChange={onChange} format={"YYYY-MM-DD"} style={{ width: "100%", padding: "6px" }} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Phone Number</label>
                <input {...register("phone")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label >Gender</label>
                <select {...register("gender")} className="form-control">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Specialization</label>
                <input {...register("specialization")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Education</label>
                <input {...register("education")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Experience</label>
                <input {...register("experience")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>City</label>
                <input {...register("city")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>State</label>
                <input {...register("state")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Zip Code</label>
                <input {...register("zipCode")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Country</label>
                <input {...register("country")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label style={{ marginBottom: "20px"}}>Address</label>
                <input {...register("address")} className="form-control" />
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary my-3" disabled={updateLoading}>
                {updateLoading ? "Updating.." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoctorProfileAdmin;
