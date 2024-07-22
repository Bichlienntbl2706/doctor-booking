import React, { useEffect, useState } from "react";
import "./AdminSidebar.css";
import { FaHome, FaLock, FaSignOutAlt } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { FaPeopleArrows } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import img from "../../images/avatar.jpg";
import useAuthCheck from "../../redux/hooks/useAuthCheck";
import { loggedOut } from "../../service/auth.service";
import { Button, message } from "antd";

const AdminSidebar = () => {
  const { data, role, authChecked } = useAuthCheck();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLogged] = useState(false);
  const location = useLocation();

  useEffect(() => {
    authChecked && setIsLogged(true);
  }, [authChecked]);
  const hanldeSignOut = () => {
    loggedOut();
    message.success("Successfully Logged Out");
    setIsLogged(false);
    navigate("/");
  };
  return (
    // <div className="sidebar" id="sidebar">
    //     <div className="sidebar-inner slimscroll">
    //         <div id="sidebar-menu" className="sidebar-menu">
    //         <div className="profile-info text-center ml-3">
    //                     <Link to={'/'}><img src={data?.img ? data?.img : img} alt="" /></Link>
    //                     <div className='profile-details '>
    //                         <h5 className='mb-0 text-white mt-2'>{data?.firstName + " " + data?.lastName}</h5>
    //                         <div className='mt-2'>
    //                             {/* <p className=' form-text m-0'>{formattedDateOfBirth}, {age} Years</p>
    //                             <p className=' form-text m-0'> {fullAddress}</p>
    //                             <p className=' form-text m-0'>{data?.email}</p> */}
    //                         </div>
    //                     </div>
    //                 </div>
    //             <ul>
    //                 {/* <li className="menu-title">
    //                     <span>Main</span>
    //                 </li> */}
    //                 <li className="active">
    //                     <Link to={'/admin/dashboard'}>
    //                         <FaHome /> <span>Dashboard</span>
    //                     </Link>
    //                 </li>
    //                 <li>
    //                     <Link to={'/admin/appointments'}>
    //                         <FaListUl /> <span>Appointments</span>
    //                     </Link>

    //                 </li>
    //                 <li>
    //                     <Link to={'/admin/specialites'}>
    //                         <FaPeopleArrows /> <span>Specialities</span>
    //                     </Link>
    //                 </li>
    //                 <li>
    //                     <Link to={'/admin/doctors'}>
    //                         <FaUserAstronaut /> <span>Doctors</span>
    //                     </Link>

    //                 </li>
    //                 <li>
    //                     <Link to={'/admin/patients'}>
    //                         <FaRegUser /> <span>Patients</span>
    //                     </Link>

    //                 </li>
    //                 <li>
    //                     <Link to={'/admin/reviews'}>
    //                         <FaRegStar /> <span>Reviews</span>
    //                     </Link>

    //                 </li>
    //                 {/* <li>
    //                     <Link to={'/admin/transaction'}>
    //                         <FaBriefcase /><span>Transactions</span>
    //                     </Link>

    //                 </li>

    //                 <li className="submenu">
    //                     <a href="#"><i className="fe fe-document"></i> <span> Reports</span> <span className="menu-arrow"></span></a>
    //                     <ul style={{ display: "none" }}>
    //                         <li><a >Invoice Reports</a></li>
    //                     </ul>
    //                 </li>
    //                 <li className="menu-title">
    //                     <span>Pages</span>
    //                 </li> */}
    //                 <li className='text-white'>
    //                     <Link to={'/admin/profile'}>
    //                         <FaRegUser /> <span>Profile</span>
    //                     </Link>
    //                 </li>
    //             </ul>
    //         </div>
    //     </div>
    // </div>
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <div className="profile-info text-center ml-3">
            <NavLink to={"/"}>
              <img src={data?.img ? data?.img : img} alt="" />
            </NavLink>
            <div className="profile-details">
              <h5 className="mb-0 text-white mt-2">
                {data?.firstName + " " + data?.lastName}
              </h5>
            </div>
          </div>
          <ul>
            <li>
              <NavLink to={"/admin/dashboard"} activeClassName="active">
                <FaHome /> <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/appointments"} activeClassName="active">
                <FaListUl /> <span>Appointments</span>
              </NavLink>
            </li>
            <li
              className={
                location.pathname === "/admin/specialites" ? "active" : ""
              }
            >
              <Link to={"/admin/prescriptions"}>
                <FaPeopleArrows /> <span>Prescriptions</span>
              </Link>
            </li>
            <li>
              <NavLink to={"/admin/invoices"} activeClassName="active">
                <FaPeopleArrows /> <span>Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/doctors"} activeClassName="active">
                <FaUserAstronaut /> <span>Doctors</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/patients"} activeClassName="active">
                <FaRegUser /> <span>Patients</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/reviews"} activeClassName="active">
                <FaRegStar /> <span>Reviews</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/admin/profile"} activeClassName="active">
                <FaRegUser /> <span>Profile</span>
              </NavLink>
            </li>
            <li
              className={
                location.pathname === "/admin/changePasswordAdmin"
                  ? "active"
                  : ""
              }
            >
            {" "}
              <Link to={"/admin/changePasswordAdmin"}>
                <FaRegUser /> <span>Change Password</span>
                {" "}
              </Link>
              {" "}
            </li>

            <li>
              <NavLink to={"/"} onClick={hanldeSignOut}>
                <FaSignOutAlt className="icon" end />
                <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

// import React from 'react';
// import './AdminSidebar.css';
// import { FaHome } from "react-icons/fa";
// import { FaListUl } from "react-icons/fa";
// import { FaPeopleArrows } from "react-icons/fa";
// import { FaRegUser } from "react-icons/fa";
// import { FaUserAstronaut } from "react-icons/fa";
// import { FaRegStar } from "react-icons/fa";
// import { FaBriefcase } from "react-icons/fa";
// import { Link, useLocation } from 'react-router-dom';

// const AdminSidebar = () => {
//     const location = useLocation();

//     return (
//         <div className="sidebar" id="sidebar">
//             <div className="sidebar-inner slimscroll">
//                 <div id="sidebar-menu" className="sidebar-menu">
//                     <ul>
//                         <li className="menu-title">
//                         </li>
//                         <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
//                             <Link to={'/admin/dashboard'}>
//                                 <FaHome /> <span>Dashboard</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/appointments' ? 'active' : ''}>
//                             <Link to={'/admin/appointments'}>
//                                 <FaListUl /> <span>Appointments</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/specialites' ? 'active' : ''}>
//                             <Link to={'/admin/prescriptions'}>
//                                 <FaPeopleArrows /> <span>Prescriptions</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/doctors' ? 'active' : ''}>
//                             <Link to={'/admin/doctors'}>
//                                 <FaUserAstronaut /> <span>Doctors</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/patients' ? 'active' : ''}>
//                             <Link to={'/admin/patients'}>
//                                 <FaRegUser /> <span>Patients</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/reviews' ? 'active' : ''}>
//                             <Link to={'/admin/reviews'}>
//                                 <FaRegStar /> <span>Reviews</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/transaction' ? 'active' : ''}>
//                             <Link to={'/admin/invoices'}>
//                                 <FaBriefcase /><span>Invoices</span>
//                             </Link>
//                         </li>
//                         {/* <li className="submenu">
//                             <a href="#"><i className="fe fe-document"></i> <span> Reports</span> <span className="menu-arrow"></span></a>
//                             <ul style={{ display: "none" }}>
//                                 <li><a >Invoice Reports</a></li>
//                             </ul>
//                         </li>
//                         <li className="menu-title">
//                             <span>Pages</span>
//                         </li> */}
//                         <li className={location.pathname === '/admin/profile' ? 'active' : ''}>
//                             <Link to={'/admin/profile'}>
//                                 <FaRegUser /> <span>Profile</span>
//                             </Link>
//                         </li>
//                         <li className={location.pathname === '/admin/changePasswordAdmin' ? 'active' : ''}>
//                             <Link to={'/admin/changePasswordAdmin'}>
//                                 <FaRegUser /> <span>Change Password</span>
//                             </Link>
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AdminSidebar;
