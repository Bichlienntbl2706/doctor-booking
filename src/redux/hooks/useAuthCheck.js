

import { useEffect, useState } from "react";
import { useGetDoctorQuery } from "../api/doctorApi";
import { useGetPatientQuery } from "../api/patientApi";
import { getUserInfo } from '../../service/auth.service';

export default function useAuthCheck() {
    const [authChecked, setAuthChecked] = useState(false);
    const [userId, setUserId] = useState('');
    const [isSkip, setIsSkip] = useState(true);
    const [data, setData] = useState({});
    const [role, setRole] = useState("");
    const [doctorId, setDoctorId] = useState('');
    const [patientId, setPatientId] = useState('');

    const { data: doctorData, isError: dIsError, isSuccess: dIsSuccess } = useGetDoctorQuery(doctorId, { skip: isSkip });
    const { data: patientData, isError: pIsError, isSuccess: pIsSuccess } = useGetPatientQuery(patientId, { skip: isSkip });

    useEffect(() => {
        const localAuth = getUserInfo();
        // console.log("local auth: ",localAuth)
        if (localAuth && localAuth !== null) {
            setUserId(localAuth.userId);
            
            setRole(localAuth.role);
            if (localAuth.role === 'doctor') {
                setDoctorId(localAuth.doctorId || '');
            } else if (localAuth.role === 'patient') {
                setPatientId(localAuth.patientId || '');
            }
            setIsSkip(false);
        }
    }, []);

    useEffect(() => {
        if (role === 'doctor' && doctorId) {
            setData(doctorData);
            setAuthChecked(dIsSuccess && !dIsError);
        } else if (role === 'patient' && patientId) {
            setData(patientData);
            setAuthChecked(pIsSuccess && !pIsError);
        }
    }, [doctorData, patientData, dIsError, dIsSuccess, pIsError, pIsSuccess, role, doctorId, patientId]);

    return {
        authChecked,
        data,
        role,
        userId,
        doctorId
    };
}