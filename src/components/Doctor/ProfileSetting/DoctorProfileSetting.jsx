import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Button, Select, message, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { useUpdateDoctorMutation } from '../../../redux/api/doctorApi';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { doctorSpecialistOptions } from '../../../constant/global';
import ImageUpload from '../../UI/form/ImageUpload';
import dImage from '../../../images/avatar.jpg';

const DoctorProfileSetting = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [updateDoctor, { isLoading, isSuccess, isError, error }] = useUpdateDoctorMutation();
    const { data } = useAuthCheck();
    const { register, handleSubmit, setValue, watch  } = useForm({});
    const [userId, setUserId] = useState('');
    const [selectValue, setSelectValue] = useState({});
    const [date, setDate] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (data) {
            const { _id, services } = data;
            setUserId(_id);
            setSelectedItems(typeof services === 'string' ? services.split(',') : []);
            
            // Initialize form values
            setValue("firstName", data.firstName);
            setValue("lastName", data.lastName);
            setValue("email", data.email);
            setValue("phone", data.phone);
            setValue("gender", data.gender);
            setValue("biography", data.biography);
            setValue("clinicName", data.clinicName);
            setValue("clinicAddress", data.clinicAddress);
            setValue("address", data.address);
            setValue("city", data.city);
            setValue("state", data.state);
            setValue("country", data.country);
            setValue("postalCode", data.postalCode);
            setValue("price", data.price);
            setValue("specialization", data.specialization);
            setValue("degree", data.degree);
            setValue("college", data.college);
            setValue("completionYear", data.completionYear);
            setValue("experienceHospitalName", data.experienceHospitalName);
            setValue("experienceStart", data.experienceStart);
            setValue("experienceEnd", data.experienceEnd);
            setValue("designation", data.designation);
            setValue("award", data.award);
            setValue("awardYear", data.awardYear);
            setValue("registration", data.registration);
            setValue("year", data.year);

            if (data.dob) {
                setDate(moment(data.dob));
            }
            }
        // console.log("data: ",data )
    }, [data, setValue]);
    

    const handleChange = (e) => {
        setSelectValue({ ...selectValue, [e.target.name]: e.target.value });
    }

    const onChange = (date, dateString) => { 
        setDate(moment(dateString).format());
    };

    const onSubmit = (data) => {
        const obj = data;
        if (obj.price) obj.price = obj.price.toString();
        const newObj = { ...obj, ...selectValue };
        if (date) newObj['dob'] = date;
        newObj["services"] = Array.isArray(selectedItems) ? selectedItems.join(',') : null;
        const changedValue = Object.fromEntries(Object.entries(newObj).filter(([key, value]) => value !== ''));
        const formData = new FormData();
        if (selectedImage) formData.append('file', file);
        const changeData = JSON.stringify(changedValue);
        formData.append('data', changeData);
        updateDoctor({ data: formData, id: userId });
        
    };

    useEffect(() => {
        if (!isLoading && isError) {
            message.error(error?.data?.message);
        }
        if (isSuccess) {
            message.success('Successfully Changed Saved !');
        }
    }, [isLoading, isError, error, isSuccess]);

    return (
        <div style={{ marginBottom: '10rem' }}>
            <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-12 mb-5">
                        <div className="form-group">
                            <div className="change-avatar d-flex gap-2 align-items-center">
                                <Link to={'/'} className="my-3 patient-img">
                                    <img src={selectedImage ? selectedImage : data?.img || dImage} alt="" />
                                </Link>
                                <div className='mt-3'>
                                    <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>First Name <span className="text-danger">*</span></label>
                            <input {...register("firstName")} className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Last Name <span className="text-danger">*</span></label>
                            <input {...register("lastName")} className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Email</label>
                            <input {...register("email")} disabled className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Phone Number</label>
                            <input {...register("phone")} className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Gender</label>
                            <select className="form-control select" onChange={handleChange} name='gender' {...register("gender")} value={watch('gender') || ''}>
                                <option >Select</option>
                                <option value="male" className='text-capitalize'>Male</option>
                                <option value="female" className='text-capitalize'>Female</option>
                                <option value="other" className='text-capitalize'>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Date of Birth {data?.dob && moment(data.dob).format('LL')}</label>
                            <DatePicker onChange={onChange} value={date ? moment(date) : null} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-2 mt-2">
                            <div className="card-body">
                                <h6 className="card-title text-secondary">About Me</h6>
                                <div className="form-group mb-2 card-label">
                                    <label>Biography</label>
                                    <textarea {...register("biography")} className="form-control" rows={5} />
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
                                        <input {...register("clinicName")} className="form-control" rows={5} />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Clinic Address</label>
                                        <input type="text" {...register("clinicAddress")} className="form-control" />
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
                                        <input {...register("address")} className="form-control"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>City</label>
                                        <input type="text" {...register("city")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>State / Province</label>
                                        <input type="text" {...register("state")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Country</label>
                                        <input type="text" {...register("country")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Postal Code</label>
                                        <input type="text" {...register("postalCode")} className="form-control" />
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
                                        <input defaultValue={data?.price} {...register("price")} type='number' className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Services and Specialization</h6>
                            <div className="row form-row">
                                <div className="form-group mb-2 card-label">
                                    <label>Services</label>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Please select"
                                        value={selectedItems}
                                        onChange={setSelectedItems}
                                        options={doctorSpecialistOptions}
                                    />
                                    <small className="form-text text-muted">Note : Type & Press enter to add new services</small>
                                </div>
                                <div className="form-group mb-2 card-label">
                                    <label>Specialization </label>
                                    <input defaultValue={data?.specialization} {...register("specialization")} className="input-tags form-control" placeholder="Enter Specialization" />
                                    {/* <small className="form-text text-muted">Note : Type & Press  enter to add new specialization</small> */}
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
                                        <input type="text" {...register("degree")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>College</label>
                                        <input type="text" {...register("college")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Year of Completion</label>
                                        <input type="text" {...register("completionYear")} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Experience</h6>
                            <div className="row form-row">
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Hospital Name</label>
                                        <input type="text" {...register("experienceHospitalName")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>From</label>
                                        <input type="text" {...register("experienceStart")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>To</label>
                                        <input type="text" {...register("experienceEnd")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Designation</label>
                                        <input type="text" {...register("designation")} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Awards</h6>
                            <div className="row form-row">
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Awards</label>
                                        <input type="text" {...register("award")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Year</label>
                                        <input type="text" {...register("awardYear")} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Registrations</h6>
                            <div className="row form-row">
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Registration</label>
                                        <input type="text" {...register("registration")} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-2 card-label">
                                        <label>Year</label>
                                        <input type="text" {...register("year")} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-center my-3'>
                        <Button htmlType='submit' type="primary" size='large' loading={isLoading} disabled={isLoading ? true : false} >
                            {isLoading ? 'Saving ...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfileSetting;
