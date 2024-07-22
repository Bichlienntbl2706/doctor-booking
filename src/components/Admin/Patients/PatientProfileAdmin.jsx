import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bloodGrupOptions } from "../../../constant/global";
import {
  useGetPatientQuery,
  useUpdatePatientMutation,
} from "../../../redux/api/patientApi";
import useAuthCheck from "../../../redux/hooks/useAuthCheck";
import { Button, message } from "antd";
import pImage from "../../../images/avatar.jpg";
import { DatePicker } from "antd";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import AdminLayout from "../AdminLayout/AdminLayout";
import ImageUpload from "../../UI/form/ImageUpload";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const PatientProfileAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: patientData,
    isLoading,
    isError,
    error,
  } = useGetPatientQuery(id);
  const { register, handleSubmit, setValue } = useForm({});
  const [selectBloodGroup, setSelectBloodGroup] = useState("");
  const [selectValue, setSelectValue] = useState({});
  const [date, setDate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [
    updatePatient,
    {
      isLoading: updateLoading,
      isSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdatePatientMutation();

  useEffect(() => {
    if (patientData) {
      setSelectBloodGroup(patientData?.bloodGroup);
      setValue("firstName", patientData.firstName);
      setValue("lastName", patientData.lastName);
      setValue("email", patientData.email);
      setValue(
        "dateOfBirth",
        moment(patientData.dateOfBirth).format("YYYY-MM-DD")
      );
      setValue("mobile", patientData.mobile);
      setValue("gender", patientData.gender);
      setValue("bloodGroup", patientData.bloodGroup);
      setValue("weight", patientData.weight);
      setValue("city", patientData.city);
      setValue("state", patientData.state);
      setValue("zipCode", patientData.zipCode);
      setValue("country", patientData.country);
      setValue("address", patientData.address);
      
      
      if (patientData.dateOfBirth) {
        setDate(moment(patientData.dateOfBirth));
      }
    }
    
  }, [patientData, setValue]);


  useEffect(() => {
    if (!isLoading && isError) {
      message.error(error?.data?.message);
    }
    if (isSuccess) {
      message.success("Successfully Profile Updated");
    }
    if (!updateLoading && isUpdateError) {
      message.error(updateError?.data?.message);
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

  const handleChange = (e) => {
    setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
    if (e.target.name === "bloodGroup") {
      setSelectBloodGroup(e.target.value);
    }
  };

  const onSubmit = (data) => {
    const obj = data;
    const newObj = { ...obj, ...selectValue };
    date && (newObj['dateOfBirth'] = date);
    const changedValue = Object.fromEntries(Object.entries(newObj).filter(([key, value]) => value !== ''));
    const formData = new FormData();
    selectedImage && formData.append('file', file);
    const changeData = JSON.stringify(changedValue);
    formData.append('data', changeData)
    updatePatient({ data: formData, id})
};
  if (isLoading || !patientData) {
    return <p>Loading...</p>;
  }

  const handleClick = () => {
    navigate('/admin/patients');
  };

  return (
    <>
    <div className="container mb-2 mt-3" >
        <Button type="primary" 
        icon={<FaArrowAltCircleLeft />} size='medium'
        onClick={handleClick}
        >
          Back
        </Button>
      </div>
    <div className="container" style={{ marginBottom: '10rem' }}>
        <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
            <h5 className="text-title mb-2 mt-3"> Patient Profile</h5>
            <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-md-12">
                    <div className="form-group">
                        <div className='change-avatar d-flex gap-2 align-items-center'>
                            <Link to={'/'} className="my-3 patient-img">
                                <img src={selectedImage ? selectedImage : patientData?.img || pImage} alt="" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>First Name <span className="text-danger">*</span></label>
                        <input readOnly defaultValue={patientData?.firstName} {...register("firstName")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Last Name <span className="text-danger">*</span></label>
                        <input readOnly defaultValue={patientData?.lastName} {...register("lastName")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Email <span className="text-danger">*</span></label>
                        <input defaultValue={patientData?.email} readOnly className="form-control" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Date of Birth</label>
                        <input type="text" defaultValue={moment(patientData?.dateOfBirth).format('LL')} readOnly style={{ width: '100%', padding: '6px' }} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Phone Number</label>
                        <input readOnly defaultValue={patientData?.mobile} {...register("mobile")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Gender</label>
                        <input className="form-control" readOnly defaultValue={patientData?.gender} />
                    </div>
                </div>

                <div className="col-md-6 row pr-4">
                    <div className="form-group mb-2 col-md-6 card-label">
                        <label className='form-label'>Blood Group</label>
                        <select className="form-control select"
                            onChange={handleChange}
                            name='bloodGroup'
                            value={selectBloodGroup}
                            disabled
                        >
                            {
                                bloodGrupOptions.map((option, index) => (
                                    <option  key={index} value={option.value} className='text-capitalize'>{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="form-group mb-2 col-md-6 card-label">
                        <label className='form-label'>Weight</label>
                        <input style={{width: "313px"}} readOnly defaultValue={patientData?.weight} {...register("weight")} className="form-control" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group mb-2 card-label" style={{marginBottom: "0.5rem", marginLeft:"24px", width: "100%"}}>
                        <label className='form-label'>City</label>
                        <input readOnly defaultValue={patientData?.city} {...register("city")} className="form-control" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>State</label>
                        <input readOnly defaultValue={patientData?.state} {...register("state")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Zip Code</label>
                        <input readOnly defaultValue={patientData?.zipCode} {...register("zipCode")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Country</label>
                        <input readOnly defaultValue={patientData?.country} {...register("country")} className="form-control" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-2 card-label">
                        <label>Address</label>
                        <input readOnly defaultValue={patientData?.address} {...register("address")} className="form-control" />
                    </div>
                </div>
                {/* <div className='text-center'>
                    <button type="submit" className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Save Changes'}</button>
                </div> */}
            </form>
        </div>
    </div>
    </>
)
};

export default PatientProfileAdmin;

// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { Link, useParams } from "react-router-dom";
// import { bloodGrupOptions } from "../../../constant/global";
// import { useGetPatientQuery } from "../../../redux/api/patientApi";
// import { message } from "antd";
// import pImage from "../../../images/avatar.jpg";
// import { DatePicker } from "antd";
// import AdminLayout from "../AdminLayout/AdminLayout";

// const PatientProfileAdmin = () => {
//   const { id } = useParams();
//   const { data: patientData, isLoading, isError, error } = useGetPatientQuery(id);
//   const [date, setDate] = useState(null);

//   useEffect(() => {
//     if (patientData) {
//       if (patientData.dateOfBirth) {
//         setDate(moment(patientData.dateOfBirth));
//       }
//     }
//   }, [patientData]);

//   useEffect(() => {
//     if (!isLoading && isError) {
//       message.error(error?.data?.message);
//     }
//   }, [isLoading, isError, error]);

//   if (isLoading || !patientData) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <AdminLayout>
//       <div style={{ marginBottom: "10rem" }}>
//         <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: "#f8f9fa" }}>
//           <h5 className="text-title mb-2 mt-3">Patient Profile</h5>
//           <form className="row form-row">
//             <div className="col-md-12">
//               <div className="form-group">
//                 <div className="change-avatar d-flex gap-2 align-items-center">
//                   <Link to={'/'} className="my-3 patient-img">
//                     <img src={patientData?.img || pImage} alt="" />
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>First Name <span className="text-danger">*</span></label>
//                 <input value={patientData?.firstName} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Last Name <span className="text-danger">*</span></label>
//                 <input value={patientData?.lastName} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Email <span className="text-danger">*</span></label>
//                 <input value={patientData?.email} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Date of Birth {moment(patientData?.dateOfBirth).format('LL')}</label>
//                 <DatePicker value={date ? moment(date) : null} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Phone Number</label>
//                 <input value={patientData?.mobile} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2">
//                 <label>Gender</label>
//                 <input value={patientData?.gender} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6 row pr-4">
//               <div className="form-group mb-2 col-md-6">
//                 <label className='form-label'>Blood Group</label>
//                 <input value={patientData?.bloodGroup} className="form-control" disabled />
//               </div>
//               <div className="form-group mb-2 col-md-6">
//                 <label className='form-label'>Weight</label>
//                 <input value={patientData?.weight} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2">
//                 <label className='form-label'>City</label>
//                 <input value={patientData?.city} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>State</label>
//                 <input value={patientData?.state} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Zip Code</label>
//                 <input value={patientData?.zipCode} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Country</label>
//                 <input value={patientData?.country} className="form-control" disabled />
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="form-group mb-2 card-label">
//                 <label>Address</label>
//                 <input value={patientData?.address} className="form-control" disabled />
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default PatientProfileAdmin;
