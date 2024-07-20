import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { bloodGrupOptions } from "../../../constant/global";
import { useGetPatientQuery } from "../../../redux/api/patientApi";
import { message } from "antd";
import pImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import AdminLayout from "../AdminLayout/AdminLayout";

const PatientProfileAdmin = () => {
  const { id } = useParams();
  const { data: patientData, isLoading, isError, error } = useGetPatientQuery(id);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (patientData) {
      if (patientData.dateOfBirth) {
        setDate(moment(patientData.dateOfBirth));
      }
    }
  }, [patientData]);

  useEffect(() => {
    if (!isLoading && isError) {
      message.error(error?.data?.message);
    }
  }, [isLoading, isError, error]);

  if (isLoading || !patientData) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: "10rem" }}>
        <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: "#f8f9fa" }}>
          <h5 className="text-title mb-2 mt-3">Patient Profile</h5>
          <form className="row form-row">
            <div className="col-md-12">
              <div className="form-group">
                <div className="change-avatar d-flex gap-2 align-items-center">
                  <Link to={'/'} className="my-3 patient-img">
                    <img src={patientData?.img || pImage} alt="" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>First Name <span className="text-danger">*</span></label>
                <input value={patientData?.firstName} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Last Name <span className="text-danger">*</span></label>
                <input value={patientData?.lastName} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Email <span className="text-danger">*</span></label>
                <input value={patientData?.email} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Date of Birth {moment(patientData?.dateOfBirth).format('LL')}</label>
                <DatePicker value={date ? moment(date) : null} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Phone Number</label>
                <input value={patientData?.mobile} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label>Gender</label>
                <input value={patientData?.gender} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6 row pr-4">
              <div className="form-group mb-2 col-md-6">
                <label className='form-label'>Blood Group</label>
                <input value={patientData?.bloodGroup} className="form-control" disabled />
              </div>
              <div className="form-group mb-2 col-md-6">
                <label className='form-label'>Weight</label>
                <input value={patientData?.weight} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2">
                <label className='form-label'>City</label>
                <input value={patientData?.city} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>State</label>
                <input value={patientData?.state} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Zip Code</label>
                <input value={patientData?.zipCode} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Country</label>
                <input value={patientData?.country} className="form-control" disabled />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group mb-2 card-label">
                <label>Address</label>
                <input value={patientData?.address} className="form-control" disabled />
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientProfileAdmin;
