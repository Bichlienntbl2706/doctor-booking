import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import "./Appointments.css";
import axios from "axios";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/appointment");
        if (response.status === 200 && response.data.success) {
          const appointmentsData = response.data.data;
          console.log("Appointments Data:", appointmentsData); // Log dữ liệu appointmentsData để kiểm tra
          setAppointments(appointmentsData);
          // setLoading(false);
        } else {
          console.error("Error fetching appointments:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    

    fetchAppointments();
  }, []);

  return (
    <AdminLayout>
      <div className="appointment-list">
        <table className="datatable table table-hover table-center mb-0">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Speciality</th>
              <th>Patient Name</th>
              <th>Appointment Time</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}</td>
                <td>{`${appointment.doctorId.specialization}`}</td>
                <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                <td>{`${appointment.scheduleDate} ${appointment.scheduleTime}`}</td>
                <td>{appointment.paymentStatus}</td>
                <td className="text-right">{`${appointment.paymentId.totalAmount}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
