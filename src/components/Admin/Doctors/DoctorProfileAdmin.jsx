import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useGetDoctorQuery } from "../../../redux/api/doctorApi";
import { Button, message, Select } from "antd";
import dImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import AdminLayout from "../AdminLayout/AdminLayout";
import { doctorSpecialistOptions } from "../../../constant/global";

const DoctorProfileAdmin = () => {
  const { id } = useParams();
  const { data: doctorData, isLoading, isError, error } = useGetDoctorQuery(id);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (doctorData) {
      if (doctorData.dob) {
        setDate(moment(doctorData.dob));
      }
    }
  }, [doctorData]);

  if (isLoading || !doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: "10rem" }}>
        <div
          className="w-100 mb-3 rounded mb-5 p-2"
          style={{ background: "#f8f9fa" }}
        >
          <h5 className="text-title mb-2 mt-3">Doctor's Profile</h5>
          <form className="row form-row">
            <div className="col-md-12 mb-5">
              <div className="form-group">
                <div className="change-avatar d-flex gap-2 align-items-center">
                  <Link to={"/"} className="my-3 patient-img">
                    <img
                      src={doctorData?.img || dImage}
                      alt=""
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  First Name <span className="text-danger">*</span>
                </label>
                <input value={doctorData.firstName} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  Last Name <span className="text-danger">*</span>
                </label>
                <input value={doctorData.lastName} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Email</label>
                <input value={doctorData.email} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Phone Number</label>
                <input value={doctorData.phone} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Gender</label>
                <input value={doctorData.gender} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>
                  Date of Birth{" "}
                  {doctorData?.dob && moment(doctorData.dob).format("LL")}
                </label>
                <DatePicker
                  disabled
                  value={date ? moment(date) : null}
                  format={"YYYY-MM-DD"}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 mt-2">
                <div className="card-body">
                  <h6 className="card-title text-secondary">About Me</h6>
                  <div className="form-group mb-2 card-label">
                    <label>Biography</label>
                    <textarea
                      value={doctorData.biography}
                      className="form-control"
                      rows={5}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">Clinic Info</h6>
                <div className="row form-row">
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Clinic Name</label>
                      <input
                        value={doctorData.clinicName}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Clinic Address</label>
                      <input
                        value={doctorData.clinicAddress}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">Contact Details</h6>
                <div className="row form-row">
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Address Line</label>
                      <input
                        value={doctorData.address}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>City</label>
                      <input
                        value={doctorData.city}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>State / Province</label>
                      <input
                        value={doctorData.state}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Country</label>
                      <input
                        value={doctorData.country}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Postal Code</label>
                      <input
                        value={doctorData.postalCode}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">Pricing</h6>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>30 Min Fee</label>
                      <input
                        value={doctorData.price}
                        type="number"
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">
                  Services and Specialization
                </h6>
                <div className="row form-row">
                  <div className="form-group mb-2 card-label">
                    <label>Services</label>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      value={doctorData.services}
                      disabled
                      options={doctorSpecialistOptions}
                    />
                  </div>
                  <div className="form-group mb-2 card-label">
                    <label>Specialization </label>
                    <input
                      value={doctorData.specialization}
                      className="input-tags form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">Education</h6>
                <div className="row form-row">
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Degree</label>
                      <input
                        value={doctorData.degree}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>College</label>
                      <input
                        value={doctorData.college}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Year of Completion</label>
                      <input
                        value={doctorData.yearOfCompletion}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card mb-2 p-3 mt-2">
                <h6 className="card-title text-secondary">Professional Info</h6>
                <div className="row form-row">
                  <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                      <label>Experience (Years)</label>
                      <input
                        value={doctorData.experience}
                        type="number"
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoctorProfileAdmin;
