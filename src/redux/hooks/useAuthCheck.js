import { useEffect, useState } from "react";
import { useGetDoctorQuery } from "../api/doctorApi";
import { useGetPatientQuery } from "../api/patientApi";
import { useGetAdminQuery } from "../api/adminApi"; // Add this import
import { getUserInfo } from "../../service/auth.service";

export default function useAuthCheck() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSkip, setIsSkip] = useState(true);
  const [data, setData] = useState({});
  const [role, setRole] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [adminId, setAdminId] = useState("");

  const {
    data: doctorData,
    isError: dIsError,
    isSuccess: dIsSuccess,
  } = useGetDoctorQuery(doctorId, { skip: isSkip });
  const {
    data: patientData,
    isError: pIsError,
    isSuccess: pIsSuccess,
  } = useGetPatientQuery(patientId, { skip: isSkip });
  const {
    data: adminData,
    isError: aIsError,
    isSuccess: aIsSuccess,
  } = useGetAdminQuery(adminId, { skip: isSkip });

  useEffect(() => {
    const localAuth = getUserInfo();
    if (localAuth && localAuth.userId) {
      setUserId(localAuth.userId);
      setRole(localAuth.role);
      if (localAuth.role === "doctor") {
        setDoctorId(localAuth.doctorId || "");
      } else if (localAuth.role === "patient") {
        setPatientId(localAuth.patientId || "");
      } else if (localAuth.role === "admin") {
        setAdminId(localAuth.adminId || "");
      }
      setIsSkip(false);
    }
  }, []);

  useEffect(() => {
    if (role === "doctor" && doctorId) {
      setData(doctorData);
      setAuthChecked(dIsSuccess && !dIsError);
    } else if (role === "patient" && patientId) {
      setData(patientData);
      setAuthChecked(pIsSuccess && !pIsError);
    } else if (role === "admin" && adminId) {
      setData(adminData);
      setAuthChecked(aIsSuccess && !aIsError);
    }
  }, [
    doctorData,
    patientData,
    adminData,
    dIsError,
    dIsSuccess,
    pIsError,
    pIsSuccess,
    aIsError,
    aIsSuccess,
    role,
    doctorId,
    patientId,
    adminId,
  ]);

  return {
    authChecked,
    data,
    role,
    userId,
    doctorId,
    patientId,
    adminId,
  };
}
