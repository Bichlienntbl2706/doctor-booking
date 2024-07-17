import React, { useEffect, useState, useCallback } from 'react';
import img from '../../../../images/avatar.jpg';
import { FaEye, FaCheck, FaTimes, FaBriefcaseMedical } from "react-icons/fa";
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentMutation } from '../../../../redux/api/appointmentApi';
import moment from 'moment';
import { Button, Tag, message } from 'antd';
import CustomTable from '../../../UI/component/CustomTable';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [sortBy, setSortBy] = useState("upcoming");
    const { data, refetch, isLoading } = useGetDoctorAppointmentsQuery({ sortBy });
    const [updateAppointment, { isError, isSuccess, error }] = useUpdateAppointmentMutation();
console.log("data dashboard: " ,data)
    const handleOnselect = (value) => {
        setSortBy(value === '1' ? 'upcoming' : value === '2' ? 'today' : 'latest');
        refetch();
    };

    const updatedApppointmentStatus = async (id, type) => {
        const changeObj = { status: type };
        try {
            await updateAppointment({ id, data: changeObj }).unwrap();
            refetch(); // Refetch to update the table data
        } catch (err) {
            message.error(err?.data?.message || "Failed to update appointment");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            message.success("Successfully Appointment Updated");
        }
        if (isError) {
            message.error(error?.data?.message);
        }
    }, [isSuccess, isError, error]);

    const checkAndCancelPastAppointments = useCallback(() => {
        const now = moment();
        data?.forEach(appointment => {
            const appointmentDateTime = moment(`${appointment.scheduleDate} ${appointment.scheduleTime}`, "YYYY-MM-DD hh:mm A");
            if (now.isAfter(appointmentDateTime) && appointment.status !== 'Completed' && appointment.status !== 'cancel' && appointment.status !== 'archived') {
                updatedApppointmentStatus(appointment._id, 'cancel');
            }
        });
    }, [data]);

    useEffect(() => {
        checkAndCancelPastAppointments();
    }, [data, checkAndCancelPastAppointments]);

    const upcomingColumns = [
        {
            title: 'Patient Name',
            key: '1',
            width: 100,
            render: function (data) {
                const fullName = `${data?.patientId?.firstName ?? ''} ${data?.patientId?.lastName ?? ''}`;
                const patientName = fullName.trim() || "Un Patient";
                const imgdata = data?.patientId?.img ? data?.patientId?.img : img;
                return (
                    <div className="table-avatar">
                        <a className="avatar avatar-sm mr-2 d-flex gap-2">
                            <img className="avatar-img rounded-circle" src={imgdata} alt="" />
                            <div>
                                <p className='p-0 m-0 text-nowrap'>{patientName}</p>
                                <p className='p-0 m-0'>{data?.patientId?.designation}</p>
                            </div>
                        </a>
                    </div>
                );
            }
        },
        {
            title: 'App Date',
            key: '2',
            width: 100,
            sorter: (a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate),
            render: function (data) {
                return (
                    <div>{moment(data?.scheduleDate).format("LL")} <span className="d-block text-info">{data?.scheduleTime}</span></div>
                );
            }
        },
        {
            title: 'Status',
            key: '4',
            width: 100,
            render: function (data) {
                return (
                    <Tag color={data?.status === 'cancel' ? "#f50" : "#87d068"} className='text-uppercase'>{data?.status}</Tag>
                );
            }
        },
        {
            title: 'Action',
            key: '5',
            width: 100,
            render: function (data) {
                const hasPrescriptionTest = data?.prescriptionId?.test?.length > 0;
                return (
                    <div className='d-flex gap-2'>
                        {!hasPrescriptionTest && data?.prescriptionStatus === 'notIssued' && data?.status !== 'cancel' && data?.status !== 'scheduled' && (
                            <Link to={`/dashboard/appointment/treatment/${data?._id}`}>
                                <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
                            </Link>
                        )}
                        {hasPrescriptionTest && data?.prescriptionStatus !== 'notIssued' && data?.status !== 'cancel' && (
                            <Link to={`/dashboard/prescription/${data?.prescriptionId?._id}`}>
                                <Button type="primary" shape="circle" icon={<FaEye />} size="small" />
                            </Link>
                        )}
                        {data?.status === 'pending' && (
                            <>
                                <Button type="primary" icon={<FaCheck />} size="small" onClick={() => updatedApppointmentStatus(data?._id, 'scheduled')}>Accept</Button>
                                <Button type='primary' icon={<FaTimes />} size='small' danger onClick={() => updatedApppointmentStatus(data?._id, 'cancel')}>Cancel</Button>
                            </>
                        )}
                        {data?.status === 'scheduled' && !hasPrescriptionTest && (
                            <Link to={`/dashboard/appointment/treatment/${data?._id}`}>
                                <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
                            </Link>
                        )}
                        {hasPrescriptionTest && (data?.status === 'scheduled' || data?.status === 'cancel') && (
                            <Link to={`/dashboard/treatment/view/${data?.prescriptionId?._id}`}>
                                <Button type="primary" shape="circle" icon={<FaEye />} size="small" />
                            </Link>
                        )}
                    </div>
                );
            }
        },
    ];

    const items = [
        {
            key: '1',
            label: 'upcoming',
            children: <CustomTable
                loading={isLoading}
                columns={upcomingColumns}
                dataSource={data?.filter(item => item.status !== 'Completed' && item.status !== 'cancel' && item.status !== 'archived')}
                showPagination={true}
                pageSize={5}
                showSizeChanger={true}
            />,
        },
        {
            key: '2',
            label: 'today',
            children: <CustomTable
                loading={isLoading}
                columns={upcomingColumns}
                dataSource={data?.filter(item => item.status !== 'Completed' && item.status !== 'cancel' && item.status !== 'archived')}
                showPagination={true}
                pageSize={5}
                showSizeChanger={true}
            />,
        },
        {
            key: '3',
            label: 'latest',
            children: <CustomTable
                loading={isLoading}
                columns={upcomingColumns}
                dataSource={data?.filter(item => item.status === 'Completed' || item.status === 'cancel' || item.status === 'archived')}
                showPagination={true}
                pageSize={5}
                showSizeChanger={true}
            />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={handleOnselect} />
    );
};

export default DashboardPage;
