import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { bloodGrupOptions } from '../../../constant/global';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { message } from 'antd';
import pImage from '../../../images/avatar.jpg';
import axios from 'axios';

const PatientProfile = () => {
  const { data } = useAuthCheck();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/v1/patient/${patientId}`);
        if (response.status === 200 && response.data.success) {
          setPatient(response.data.data);
          setLoading(false);
        } else {
          console.error("Error fetching patient:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!patient) {
    return <p>No patient found.</p>;
  }

  return (
    <div style={{ marginBottom: '10rem' }}>
      <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
        <h5 className="text-title mb-2 mt-3">Patient Information</h5>
        <div className="row form-row">
          <div className="col-md-12">
            <div className="form-group">
              <div className='change-avatar d-flex gap-2 align-items-center'>
                <Link to={'/'} className="my-3 patient-img">
                  <img src={patient.img || pImage} alt="" />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>First Name</label>
              <p className="form-control-static">{patient.firstName}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Last Name</label>
              <p className="form-control-static">{patient.lastName}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Email</label>
              <p className="form-control-static">{patient.email}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Date of Birth</label>
              <p className="form-control-static">{moment(patient.dateOfBirth).format('LL')}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Phone Number</label>
              <p className="form-control-static">{patient.mobile}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2">
              <label>Gender</label>
              <p className="form-control-static">{patient.gender}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className='form-label'>Blood Group</label>
              <p className="form-control-static">{bloodGrupOptions.find(option => option.value === patient.bloodGroup)?.label}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2">
              <label className='form-label'>City</label>
              <p className="form-control-static">{patient.city}</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>State</label>
              <p className="form-control-static">{patient.state}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Zip Code</label>
              <p className="form-control-static">{patient.zipCode}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Country</label>
              <p className="form-control-static">{patient.country}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-2 card-label">
              <label>Address</label>
              <p className="form-control-static">{patient.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile;
