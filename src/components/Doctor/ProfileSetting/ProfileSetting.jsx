import React from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import PatientProfileSetting from './PatientProfileSetting';
import DoctorProfileSetting from './DoctorProfileSetting';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
const ProfileSetting = () => {
    const { role } = useAuthCheck();
    
    const renderProfileSetting = () => {
        switch(role) {
            case 'doctor':
                return <DoctorProfileSetting />;
            case 'patient':
            default:
                return <PatientProfileSetting />;
        }
    };

    return (
        <DashboardLayout>
            {renderProfileSetting()}
        </DashboardLayout>
    );
}

export default ProfileSetting;