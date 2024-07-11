import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import {
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "../../../redux/api/doctorApi";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";
import { message } from "antd";
import pImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import { useForm } from "react-hook-form";
import ImageUpload from "../../UI/form/ImageUpload";
// import '../../../styles/profile.css'; // Adjust the path according to your project structure

const DoctorProfileAdmin = () => {
  const { data: adminData } = useAuthCheck(); // Assume this provides admin data
  const { id } = useParams();
  const { data: doctorData, isLoading, isError, error } = useGetDoctorQuery(id);

  const { register, handleSubmit, setValue } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const { data } = useAuthCheck();
  const [file, setFile] = useState(null);
  const [
    updateDoctor,
    { isLoading: updateLoading, isSuccess, isError: updateError },
  ] = useUpdateDoctorMutation(); // Sử dụng hook một cách chính xác

  useEffect(() => {
    if (doctorData) {
      // Set initial form values using setValue from react-hook-form
      setValue("firstName", doctorData.firstName);
      setValue("lastName", doctorData.lastName);
      setValue("email", doctorData.email);
      setValue(
        "dateOfBirth",
        moment(doctorData.dateOfBirth).format("YYYY-MM-DD")
      );
      setValue("mobile", doctorData.mobile);
      setValue("gender", doctorData.gender);
      setValue("specialization", doctorData.specialization);
      setValue("education", doctorData.education);
      setValue("experience", doctorData.experience);
      setValue("city", doctorData.city);
      setValue("state", doctorData.state);
      setValue("zipCode", doctorData.zipCode);
      setValue("country", doctorData.country);
      setValue("address", doctorData.address);
    }
  }, [doctorData, setValue]);

  useEffect(() => {
    if (isError) {
      message.error(error?.data?.message);
    }
    if (isSuccess) {
      message.success("Successfully updated doctor profile");
    }
  }, [isError, error, isSuccess]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      dateOfBirth: moment(data.dateOfBirth).toISOString(),
    };
    updateDoctor({ id: id, data: formData });
  };

  const canEdit = adminData?.role === "admin"; // Assume 'role' is a field in adminData indicating admin role

  if (isLoading || !doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ marginBottom: "10rem" }}>
      <div className="w-100 mb-3 rounded mb-5 p-2 profile-container">
        <h5 className="text-title mb-2 mt-3">Doctor Profile</h5>
        <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-md-12">
            <div className="form-group">
              <div className="change-avatar d-flex gap-2 align-items-center">
                <Link to={"/"} className="my-3 patient-img">
                  <img
                    src={selectedImage ? selectedImage : data?.img || pImage}
                    alt=""
                  />
                </Link>
                <div className="mt-3">
                  <ImageUpload
                    setSelectedImage={setSelectedImage}
                    setFile={setFile}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>First Name</label>
              <input
                {...register("firstName", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Last Name</label>
              <input
                {...register("lastName", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Email</label>
              <input
                {...register("email", { readOnly: true })}
                className="form-control"
                disabled
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Date of Birth</label>
              <DatePicker
                disabled={!canEdit}
                onChange={(date, dateString) =>
                  setValue("dateOfBirth", dateString)
                }
                format="YYYY-MM-DD"
                style={{ width: "100%", padding: "6px" }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Phone Number</label>
              <input
                {...register("mobile", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2">
              <label>Gender</label>
              <select
                {...register("gender", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className="form-label">Specialization</label>
              <input
                {...register("specialization", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className="form-label">Education</label>
              <input
                {...register("education", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className="form-label">Experience</label>
              <input
                {...register("experience", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className="form-label">City</label>
              <input
                {...register("city", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>State</label>
              <input
                {...register("state", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Zip Code</label>
              <input
                {...register("zipCode", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Country</label>
              <input
                {...register("country", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Address</label>
              <input
                {...register("address", { readOnly: !canEdit })}
                className="form-control"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="col-md-12 text-center">
            {canEdit && (
              <button
                type="submit"
                className="btn btn-primary my-3"
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileAdmin;
