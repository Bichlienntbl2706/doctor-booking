import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import {
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "../../../redux/api/doctorApi";
import { message } from "antd";
import dImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import { useForm } from "react-hook-form";
import ImageUpload from "../../UI/form/ImageUpload";
import AdminLayout from "../AdminLayout/AdminLayout";

const DoctorProfileAdmin = () => {
  const { id } = useParams(); // Lấy ID của bác sĩ từ URL
  const { data: doctorData, isLoading, isError, error } = useGetDoctorQuery(id); // Lấy dữ liệu bác sĩ từ API

  const { register, handleSubmit, setValue } = useForm({}); // Thiết lập form sử dụng react-hook-form
  const [selectedImage, setSelectedImage] = useState(null); // Quản lý hình ảnh được chọn
  const [date, setDate] = useState(null); // Quản lý ngày sinh
  const [file, setFile] = useState(null); // Quản lý file hình ảnh tải lên
  const [selectValue, setSelectValue] = useState({});

  const [
    updateDoctor,
    {
      isLoading: updateLoading,
      isSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateDoctorMutation(); // Hook cập nhật bác sĩ

  const onChange = (date, dateString) => {
    setDate(moment(dateString).format());
  };
  // const { data: adminData } = useAuthCheck(); // Kiểm tra dữ liệu admin để xác định quyền chỉnh sửa
  // const canEdit = adminData?.role === "admin"; // Kiểm tra quyền chỉnh sửa dựa trên vai trò admin

  useEffect(() => {
    if (doctorData) {
      // Thiết lập giá trị ban đầu cho form khi có dữ liệu bác sĩ
      setValue("firstName", doctorData.firstName);
      setValue("lastName", doctorData.lastName);
      setValue("email", doctorData.email);
      setValue(
        "dateOfBirth",
        moment(doctorData?.dob).format("YYYY-MM-DD")
      );
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
      message.error(error?.data?.message); // Hiển thị lỗi nếu có
    }
    if (isSuccess) {
      message.success("Successfully Profile Updated"); // Hiển thị thành công khi cập nhật
    }
    if (!updateLoading && isUpdateError) {
      message.error(updateError?.data?.message); // Hiển thị lỗi khi cập nhật thất bại
    }
  }, [
    isLoading,
    isError,
    error,
    isSuccess,
    updateLoading,
    isUpdateError,
    updateError,
  ]);

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
    updateDoctor({ data: formData, id });
  };

  if (isLoading || !doctorData) {
    return <p>Loading...</p>; // Hiển thị loading khi dữ liệu đang được tải
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
                <input {...register("firstName")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Last Name</label>
                <input {...register("lastName")} className="form-control" />
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
                <label>
                  Date of Birth {moment(doctorData?.dob).format("LL")}
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
                <input {...register("phone")} className="form-control" />
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

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label className="form-label">Specialization</label>
                <input
                  {...register("specialization")}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label className="form-label">Education</label>
                <input {...register("education")} className="form-control" />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label className="form-label">Experience</label>
                <input {...register("experience")} className="form-control" />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>City</label>
                <input {...register("city")} className="form-control" />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>State</label>
                <input {...register("state")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Zip Code</label>
                <input {...register("zipCode")} className="form-control" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Country</label>
                <input {...register("country")} className="form-control" />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group mb-2 card-label">
                <label>Address</label>
                <input {...register("address")} className="form-control" />
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

export default DoctorProfileAdmin;
