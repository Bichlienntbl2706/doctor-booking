import React,{ useEffect, useState } from 'react';
import img from '../../images/avatar.jpg';
import './DashboardSidebar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import moment from 'moment';
import {
    FaTable,
    FaCalendarDay,
    FaUserInjured,
    FaHourglassStart,
    FaRegStar, FaUserCog, FaBlog,
    FaSignOutAlt,
    FaLock,
    FaHouseUser
} from "react-icons/fa";
import { loggedOut } from '../../service/auth.service';
import { Button, message } from 'antd';

const DashboardSidebar = () => {
    const [isLoggedIn, setIsLogged] = useState(false);
    const { data, role } = useAuthCheck();
    const navigate = useNavigate();

    const calculateAge = (dob) => {
        return moment().diff(moment(dob), 'years');
    };
    const hanldeSignOut = () => {
        loggedOut();
        message.success("Successfully Logged Out")
        setIsLogged(false)
        navigate('/')
    }
    const formattedDateOfBirth = data?.dateOfBirth ? moment(data.dateOfBirth).format('DD MMM YYYY') : '';
    const age = data?.dateOfBirth ? calculateAge(data.dateOfBirth) : '';
    const fullAddress = `${data?.address || ''}, ${data?.city || ''}, ${data?.country || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, '');

    return (
        <div className="profile-sidebar p-3 rounded">
            <div className="p-2 text-center border-bottom">
                {
                    role === 'doctor' ?
                        <div className="profile-info text-center">
                            <Link to={'/'}><img src={data?.img ? data?.img : img} alt="" /></Link>
                            <div className='profile-details'>
                                <h5 className='mb-0'>{data?.firstName + " " + data?.lastName}</h5>
                                <div>
                                    <p className="mb-0">{data?.email}</p>
                                    {/* <h6 className="m-0">{data?.designation}</h6> */}

                                </div>
                            </div>
                        </div>
                        :
                        <div className="profile-info text-center">
                            <Link to={'/'}><img src={data?.img ? data?.img : img} alt="" /></Link>
                            <div className='profile-details'>
                                <h5 className='mb-0'>{data?.firstName + " " + data?.lastName}</h5>
                                <div className='mt-2'>
                                    <p className=' form-text m-0'>{formattedDateOfBirth}, {age} Years</p>
                                    <p className=' form-text m-0'> {fullAddress}</p>
                                    <p className=' form-text m-0'>{data?.email}</p>
                                </div>
                            </div>
                        </div>
                }

            </div>
            <nav className="dashboard-menu">
                {
                    role === 'patient' ?
                        <ul>
                            <li>
                                <NavLink to={'/dashboard'} activeClassName="active" end>
                                    <FaTable className="icon" />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/favourite'} activeClassName="active">
                                    <FaHouseUser className="icon" />
                                    <span>Favourites</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/profile-setting'} activeClassName="active">
                                    <FaUserCog className="icon" />
                                    <span>Profile Settings</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/change-password'} activeClassName="active">
                                    <FaLock className="icon" />
                                    <span>Change Password</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/'}>
                                    <FaSignOutAlt className="icon" />
                                    <span>Logout</span>
                                </NavLink>
                            </li>
                        </ul>
                        :
                        <ul>
                            <li>
                                <NavLink to={'/dashboard'} activeClassName="active" end>
                                    <FaTable className="icon" />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/appointments'} activeClassName="active" end >
                                    <FaCalendarDay className="icon" />
                                    <span>Appointments</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/my-patients'} activeClassName="active" end>
                                    <FaUserInjured className="icon" />
                                    <span>My Patients</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/prescription'} activeClassName="active" end>
                                    <FaUserInjured className="icon" />
                                    <span>Prescription</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/schedule'} activeClassName="active" end>
                                    <FaCalendarDay className="icon" />
                                    <span>Schedule Timings</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/invoices'} activeClassName="active" end>
                                    <FaHourglassStart className="icon" />
                                    <span>Invoices</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/reviews'} activeClassName="active" end>
                                    <FaRegStar className="icon" />
                                    <span>Reviews</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/profile-setting'} activeClassName="active" end>
                                    <FaUserCog className="icon" />
                                    <span>Profile Settings</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/blogs'} activeClassName="active" end>
                                    <FaBlog className="icon" />
                                    <span>Blogs (Will move to Admin)</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/change-password'} activeClassName="active" end>
                                    <FaLock className="icon" />
                                    <span>Change Password</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/'}  onClick={hanldeSignOut}>
                                    <FaSignOutAlt className="icon" end />
                                    <span>Logout</span>
                                </NavLink>
                            </li>
                        </ul>
                }
            </nav>
        </div>
    )
}
export default DashboardSidebar;