import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import userImg from '../../images/avatar.jpg';
import './AdminHeader.css';

const AdminHeader = ({ userData }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove authentication token from local storage
        // Optionally clear other user-related information from local storage
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="header">
            <div className="header-left">
                <a href="index.html" className="logo">
                    <img src={logo} alt="Logo" />
                </a>
            </div>

            {/* <div className="top-nav-search">
                <form>
                    <input type="text" className="form-control" placeholder="Search here" />
                    <button className="btn" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </div> */}

            <div className="user-info">
                <img className="rounded-circle" src={userImg} width="31" alt="User Avatar" />
                <span className="user-name">{userData && `${userData.admin.firstName} ${userData.admin.lastName}`}</span>
                {/* <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button> */}
            </div>
        </div>
    );
}

export default AdminHeader;
