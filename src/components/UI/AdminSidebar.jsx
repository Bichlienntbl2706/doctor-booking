import React from 'react';
import './AdminSidebar.css';
import { FaHome } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { FaPeopleArrows } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="menu-title">
                        </li>
                        <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
                            <Link to={'/admin/dashboard'}>
                                <FaHome /> <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/appointments' ? 'active' : ''}>
                            <Link to={'/admin/appointments'}>
                                <FaListUl /> <span>Appointments</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/specialites' ? 'active' : ''}>
                            <Link to={'/admin/prescriptions'}>
                                <FaPeopleArrows /> <span>Prescriptions</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/doctors' ? 'active' : ''}>
                            <Link to={'/admin/doctors'}>
                                <FaUserAstronaut /> <span>Doctors</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/patients' ? 'active' : ''}>
                            <Link to={'/admin/patients'}>
                                <FaRegUser /> <span>Patients</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/reviews' ? 'active' : ''}>
                            <Link to={'/admin/reviews'}>
                                <FaRegStar /> <span>Reviews</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/transaction' ? 'active' : ''}>
                            <Link to={'/admin/invoices'}>
                                <FaBriefcase /><span>Invoices</span>
                            </Link>
                        </li>
                        {/* <li className="submenu">
                            <a href="#"><i className="fe fe-document"></i> <span> Reports</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: "none" }}>
                                <li><a >Invoice Reports</a></li>
                            </ul>
                        </li>
                        <li className="menu-title">
                            <span>Pages</span>
                        </li> */}
                        <li className={location.pathname === '/admin/profile' ? 'active' : ''}>
                            <Link to={'/admin/profile'}>
                                <FaRegUser /> <span>Profile</span>
                            </Link>
                        </li>
                        <li className={location.pathname === '/admin/changePasswordAdmin' ? 'active' : ''}>
                            <Link to={'/admin/changePasswordAdmin'}>
                                <FaRegUser /> <span>Change Password</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar;
