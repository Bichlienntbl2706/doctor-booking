import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { bloodGrupOptions } from "../../../constant/global";
import { useUpdateAdminMutation } from "../../../redux/api/adminApi";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";
import { message } from "antd";
import ImageUpload from "../../UI/form/ImageUpload";
import pImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import AdminLayout from "../AdminLayout/AdminLayout";

const Profile = () => {
  const { data } = useAuthCheck();
  const { register, handleSubmit, setValue } = useForm({});
  const [userId, setUserId] = useState("");
  const [selectBloodGroup, setSelectBloodGroup] = useState("");
  const [selectValue, setSelectValue] = useState({});
  const [updateAdmin, { isSuccess, isError, error, isLoading }] =
    useUpdateAdminMutation();
  const [date, setDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  console.log(data);
  const onChange = (date, dateString) => {
    setDate(moment(dateString).format());
  };

  useEffect(() => {
    if (data) {
      setUserId(data._id);
      setSelectBloodGroup(data?.bloodGroup);
      setValue("gender", data.gender);

    }
  }, [data]);

  useEffect(() => {
    if (!isLoading && isError) {
      message.error(error?.data?.message);
    }
    if (isSuccess) {
      message.success("Successfully Profile Updated");
    }
  }, [isLoading, isError, error, isSuccess]);

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
    if (e.target.name === "bloodGroup") {
      setSelectBloodGroup(e.target.value);
    }
  };

  const onSubmit = (data) => {
    const obj = data;
    const newObj = { ...obj, ...selectValue };
    date && (newObj["dateOfBirth"] = date);
    const changedValue = Object.fromEntries(
      Object.entries(newObj).filter(([key, value]) => value !== "")
    );
    const formData = new FormData();
    selectedImage && formData.append("file", file);
    const changeData = JSON.stringify(changedValue);
    formData.append("data", changeData);
    updateAdmin({ data: formData, id: userId });
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: "10rem" }}>
        <div
          className="w-100 mb-3 rounded mb-5 p-2"
          style={{ background: "#f8f9fa" }}
        >
          <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
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
                <label>
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  defaultValue={data?.firstName}
                  {...register("firstName")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  defaultValue={data?.lastName}
                  {...register("lastName")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  defaultValue={data?.email}
                  disabled
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  Date of Birth {moment(data?.dateOfBirth).format("LL")}
                </label>
                <DatePicker
                  onChange={onChange}
                  format={"YYYY-MM-DD"}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Phone Number</label>
                <input
                  defaultValue={data?.mobile}
                  {...register("mobile")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2">
                <label>Gender</label>
                <select {...register("gender")} className="form-control">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="col-md-6 row pr-4">
              <div className="form-group mb-2 col-md-6">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-control select"
                  onChange={handleChange}
                  name="bloodGroup"
                  value={selectBloodGroup}
                >
                  {bloodGrupOptions.map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      className="text-capitalize"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-2 col-md-6">
                <label className="form-label">Weight</label>
                <input
                  defaultValue={data?.weight}
                  {...register("weight")}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label className="form-label">City</label>
                <input
                  defaultValue={data?.city}
                  {...register("city")}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>State</label>
                <input
                  defaultValue={data?.state}
                  {...register("state")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Zip Code</label>
                <input
                  defaultValue={data?.zipCode}
                  {...register("zipCode")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Country</label>
                <input
                  defaultValue={data?.country}
                  {...register("country")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Address</label>
                <input
                  defaultValue={data?.address}
                  {...register("address")}
                  className="form-control"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary my-3"
                disabled={isLoading ? true : false}
              >
                {isLoading ? "Updating.." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
