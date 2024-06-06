// import { useEffect, useState } from "react";
// import { useGetDoctorQuery } from "../api/doctorApi";
// import { useGetPatientQuery } from "../api/patientApi";
// import { getUserInfo } from '../../service/auth.service';

// export default function useAuthCheck() {
//     const [authChecked, setAuthChecked] = useState(false);
//     const [userId, setUserId] = useState('');
//     const [isSkip, setIsSkip] = useState(true);
//     const [data, setData] = useState({});
//     const [role, setRole] = useState("");
//     const { data: doctorData, isError, isSuccess: dIsSuccess } = useGetDoctorQuery(userId, { skip: isSkip });
//     const { data: patientData, isError: pIsError, isSuccess: pIsSuccess } = useGetPatientQuery(userId, { skip: isSkip });

//     useEffect(() => {
//         const localAuth = getUserInfo();
//     console.log("localAuth: ",localAuth)
//         if (localAuth && localAuth !== null) {
//             if (localAuth.role === 'patient') {
//                 setUserId(localAuth?.userId)
//                 setIsSkip(false);
//                 setData(patientData)
//                 setRole(localAuth.role)
//                 setAuthChecked(pIsSuccess && !pIsError)
//             } else if (localAuth.role === 'doctor') {
//                 setUserId(localAuth?.userId)
//             console.log("userId: ", localAuth.userId)
//                 setIsSkip(false);
//                 setData(doctorData)
//                 setRole(localAuth.role)
//                 setAuthChecked(dIsSuccess && !isError)
//             }
//         }
//     }, [patientData, doctorData, isError, dIsSuccess, pIsError, pIsSuccess]);

//     return {
//         authChecked,
//         data,
//         role
//     };
// }

// import { useEffect, useState } from "react";
// import { useGetDoctorQuery } from "../api/doctorApi";
// import { useGetPatientQuery } from "../api/patientApi";
// import { useGetUserByIdQuery } from "../api/userApi"; // Import the user API endpoint
// import { getUserInfo } from '../../service/auth.service';

// export default function useAuthCheck() {
//     const [authChecked, setAuthChecked] = useState(false);
//     const [userId, setUserId] = useState('');
//     const [isSkip, setIsSkip] = useState(true);
//     const [data, setData] = useState({});
//     const [role, setRole] = useState("");

//     const { data: doctorData, isError: dIsError, isSuccess: dIsSuccess } = useGetDoctorQuery(userId, { skip: isSkip });
//     const { data: patientData, isError: pIsError, isSuccess: pIsSuccess } = useGetPatientQuery(userId, { skip: isSkip });
//     const { data: userData } = useGetUserByIdQuery(userId, { skip: !userId });

//     useEffect(() => {
//         const localAuth = getUserInfo();
//         if (localAuth) {
//             setUserId(localAuth.userId || '');
//             setIsSkip(!localAuth.userId);
//             setRole(localAuth.role || '');
//         }
//     }, []);

//     useEffect(() => {
//         if (userId) {
//             if (role === 'doctor') {
//                 setData(doctorData || {});
//                 setAuthChecked(dIsSuccess && !dIsError);
//             } else if (role === 'patient') {
//                 setData(patientData || {});
//                 setAuthChecked(pIsSuccess && !pIsError);
//             }
//         }
//     }, [userId, doctorData, patientData, role, dIsSuccess, pIsSuccess, dIsError, pIsError]);

//     useEffect(() => {
//         if (userData) {
//             setData(prevData => ({ ...prevData, user: userData }));
//         }
//     }, [userData]);

//     return {
//         authChecked,
//         data,
//         role
//     };
// }

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

        if (localAuth && localAuth !== null) {
            console.log(localAuth);
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
        role
    };
}