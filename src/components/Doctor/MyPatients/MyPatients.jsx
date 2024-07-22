import React, { useState } from 'react';
import img from '../../../images/avatar.jpg';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { useGetDoctorPatientsQuery } from '../../../redux/api/appointmentApi';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { Empty, Pagination } from 'antd';

const MyPatients = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 5;

    const getInitPatientName = (item) => {
        const fullName = `${item?.firstName ?? ''} ${item?.lastName ?? ''}`;
        return fullName.trim() || "Private Patient";
    };

    const { data, isLoading, isError } = useGetDoctorPatientsQuery();
    console.log("data patient: ", data);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = data?.slice(indexOfFirstPatient, indexOfLastPatient);

    let content = null;
    if (!isLoading && isError) content = <div>Something Went Wrong!</div>;
    if (!isLoading && !isError && data?.length === 0) content = <Empty />;
    if (!isLoading && !isError && data?.length > 0) content = (
        <>
            {currentPatients.map((item) => (
                <div className="w-100 mb-3 rounded p-3 mr-2" style={{ background: '#f8f9fa' }} key={item.id}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <Link to={`/`} className="patient-img">
                                <img src={item?.img ? item?.img : img} alt="" />
                            </Link>
                            <div className="patients-info">
                                <h5>{getInitPatientName(item)}</h5>
                                <div className="info mt-2">
                                    <p><FaLocationArrow className='icon' /> {item?.address}</p>
                                    <p><FaEnvelope className='icon' /> {item?.email}</p>
                                    <p><FaPhoneAlt className='icon' /> {item?.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={patientsPerPage}
                    total={data.length}
                    onChange={handlePageChange}
                    showSizeChanger={true}
                />
            </div>
        </>
    );

    return (
        <DashboardLayout>
            <div className="row">
                {content}
            </div>
        </DashboardLayout>
    );
};

export default MyPatients;
