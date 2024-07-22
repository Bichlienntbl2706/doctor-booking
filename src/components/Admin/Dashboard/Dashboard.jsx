// import AdminLayout from "../AdminLayout/AdminLayout";
// import userImg from "../../../images/avatar.jpg";
// import "./Dashboard.css";
// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Import axios for API calls

// const AdminDashboard = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [doctorsEarnings, setDoctorsEarnings] = useState({});

//   useEffect(() => {
//     // Fetch doctors data
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get("http://localhost:5050/api/v1/doctor");
//         console.log("API response:", response);

//         if (response.status === 200 && response.data.success) {
//           const doctorsData = response.data.data.data;
//           console.log("Doctors data:", doctorsData);

//           if (Array.isArray(doctorsData)) {
//             setDoctors(doctorsData);
//           } else {
//             console.error("Fetched doctors data is not an array:", doctorsData);
//           }
//           // setLoading(false);
//         } else {
//           console.error("Error fetching doctors:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//       }
//     };

//     fetchDoctors();

//     fetchDoctors(); // Gọi hàm fetch khi component được mount

//     // Fetch patients data
//     const fetchPatients = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5050/api/v1/patient"
//         );
//         if (response.status === 200 && response.data.success) {
//           setPatients(response.data.data);
//           // setLoading(false);
//         } else {
//           console.error("Error fetching patients:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//       }
//     };

//     fetchPatients();

//     // Fetch appointments data
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5050/api/v1/appointment"
//         );
//         if (response.status === 200 && response.data.success) {
//           setAppointments(response.data.data);

//           // Tính tổng doanh thu từ các cuộc hẹn đã thanh toán
//           let total = 0;
//           const doctorsEarningsCopy = {};

//           response.data.data.forEach((appointment) => {
//             if (
//               appointment.paymentId &&
//               appointment.paymentId.totalAmount &&
//               appointment.doctorId
//             ) {
//               total += appointment.paymentId.totalAmount;

//               // Tính tổng tiền kiếm được của từng bác sĩ
//               if (!doctorsEarningsCopy[appointment.doctorId._id]) {
//                 doctorsEarningsCopy[appointment.doctorId._id] =
//                   appointment.paymentId.totalAmount;
//               } else {
//                 doctorsEarningsCopy[appointment.doctorId._id] +=
//                   appointment.paymentId.totalAmount;
//               }
//             }
//           });

//           setTotalRevenue(total);
//           setDoctorsEarnings(doctorsEarningsCopy);
//         } else {
//           console.error("Error fetching appointments:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments(); // Call the fetch function when component mounts
//   }, []);

//   return (
//     <>
//       <AdminLayout>
//         <div className="row">
//           <div className="col-xl-3 col-sm-6 col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="dash-widget-header">
//                   <span className="dash-widget-icon text-primary border-primary">
//                     <i className="fe fe-users"></i>
//                   </span>
//                   <div className="dash-count">
//                     <h3>{doctors.length}</h3>
//                   </div>
//                 </div>
//                 <div className="dash-widget-info">
//                   <h6 className="text-muted">Doctors</h6>
//                   <div className="progress progress-sm">
//                     <div className="progress-bar bg-primary w-50"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-sm-6 col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="dash-widget-header">
//                   <span className="dash-widget-icon text-success">
//                     <i className="fe fe-credit-card"></i>
//                   </span>
//                   <div className="dash-count">
//                     <h3>{patients.length}</h3>
//                   </div>
//                 </div>
//                 <div className="dash-widget-info">
//                   <h6 className="text-muted">Patients</h6>
//                   <div className="progress progress-sm">
//                     <div className="progress-bar bg-success w-50"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-sm-6 col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="dash-widget-header">
//                   <span className="dash-widget-icon text-danger border-danger">
//                     <i className="fe fe-money"></i>
//                   </span>
//                   <div className="dash-count">
//                     <h3>{appointments.length}</h3>
//                   </div>
//                 </div>
//                 <div className="dash-widget-info">
//                   <h6 className="text-muted">Appointments</h6>
//                   <div className="progress progress-sm">
//                     <div className="progress-bar bg-danger w-50"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-xl-3 col-sm-6 col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="dash-widget-header">
//                   <span className="dash-widget-icon text-warning border-warning">
//                     <i className="fe fe-folder"></i>
//                   </span>
//                   <div className="dash-count">
//                     <h3>${totalRevenue}</h3> {/* Hiển thị tổng doanh thu */}
//                   </div>
//                 </div>
//                 <div className="dash-widget-info">
//                   <h6 className="text-muted">Revenue</h6>
//                   <div className="progress progress-sm">
//                     <div className="progress-bar bg-warning w-50"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-6 d-flex">
//             <div className="card card-table flex-fill">
//               <div className="card-header">
//                 <h4 className="card-title">Doctors List</h4>
//               </div>
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Doctor Name</th>
//                         <th>Speciality</th>
//                         <th>Earned</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {doctors.map((doctor) => (
//                         <tr key={doctor._id}>
//                           <td>
//                             <h2 className="table-avatar">
//                               <a className="avatar avatar-sm mr-2">
//                                 <img
//                                   className="avatar-img rounded-circle"
//                                   src={userImg}
//                                   alt=""
//                                 />
//                               </a>
//                               <a> {`${doctor.firstName} ${doctor.lastName}`}</a>
//                             </h2>
//                           </td>
//                           <td>{doctor.specialization}</td>
//                           <td>${doctorsEarnings[doctor._id] || 0}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6 d-flex">
//             <div className="card  card-table flex-fill">
//               <div className="card-header">
//                 <h4 className="card-title">Patients List</h4>
//               </div>
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th>Patient Name</th>
//                         <th>Phone</th>
//                         <th>Gender</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {patients.map((patient) => (
//                         <tr key={patient._id}>
//                           <td>
//                             <h2 className="table-avatar">
//                               <a
//                                 href="profile.html"
//                                 className="avatar avatar-sm mr-2"
//                               >
//                                 <img
//                                   className="avatar-img rounded-circle"
//                                   src={userImg}
//                                   alt=""
//                                 />
//                               </a>
//                               <a href="profile.html">{`${patient.firstName} ${patient.lastName}`}</a>
//                             </h2>
//                           </td>
//                           <td>{patient.mobile}</td>
//                           <td>{patient.gender}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card card-table">
//               <div className="card-header">
//                 <h4 className="card-title">Appointment List</h4>
//               </div>
//               <div className="card-body">
//                 <div className="table-responsive">
//                   <table className="table table-hover table-center mb-0">
//                     <thead>
//                       <tr>
//                         <th className="text-start">Doctor Name</th>
//                         <th className="text-start">Speciality</th>
//                         <th className="text-start">Patient Name</th>
//                         <th className="text-start">Appointment Time</th>
//                         <th className="text-start">Status</th>
//                         <th className="text-start">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {appointments.map((appointment) => (
//                         <tr key={appointment._id}>
//                           <td className="align-middle text-start">
//                             <h2 className="table-avatar d-flex align-items-center">
//                               <a
//                                 href="profile.html"
//                                 className="avatar avatar-sm me-2"
//                               >
//                                 <img
//                                   className="avatar-img rounded-circle"
//                                   src={userImg}
//                                   alt=""
//                                 />
//                               </a>
//                               <a href="profile.html">
//                                 {`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}
//                               </a>
//                             </h2>
//                           </td>
//                           <td className="align-middle text-start">
//                             {`${appointment.doctorId.specialization}`}
//                           </td>
//                           <td className="align-middle text-start">
//                             <h2 className="table-avatar d-flex align-items-center">
//                               <a
//                                 href="profile.html"
//                                 className="avatar avatar-sm me-2"
//                               >
//                                 <img
//                                   className="avatar-img rounded-circle"
//                                   src={userImg}
//                                   alt=""
//                                 />
//                               </a>
//                               <a href="profile.html">
//                                 {`${appointment.firstName} ${appointment.lastName}`}
//                               </a>
//                             </h2>
//                           </td>
//                           <td className="align-middle text-start">
//                             {appointment.appointmentTime}
//                             <span className="text-primary d-block">
//                               {`${appointment.scheduleDate} ${appointment.scheduleTime}`}
//                             </span>
//                           </td>
//                           <td className="align-middle text-start">
//                             {appointment.paymentStatus}
//                           </td>
//                           <td className="align-middle text-start">
//                             {`${appointment.paymentId.totalAmount}`}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </AdminLayout>
//     </>
//   );
// };

// export default AdminDashboard;
import AdminLayout from "../AdminLayout/AdminLayout";
import userImg from "../../../images/avatar.jpg";
import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [doctorsEarnings, setDoctorsEarnings] = useState({});

  useEffect(() => {
    // Fetch doctors data
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/v1/doctor");
        console.log("API response:", response);

        if (response.status === 200 && response.data.success) {
          const doctorsData = response.data.data.data;
          console.log("Doctors data:", doctorsData);

          if (Array.isArray(doctorsData)) {
            setDoctors(doctorsData);
          } else {
            console.error("Fetched doctors data is not an array:", doctorsData);
          }
          // setLoading(false);
        } else {
          console.error("Error fetching doctors:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();

    // Fetch patients data
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/patient"
        );
        if (response.status === 200 && response.data.success) {
          setPatients(response.data.data);
          // setLoading(false);
        } else {
          console.error("Error fetching patients:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();

    // Fetch appointments data
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/appointment"
        );
        if (response.status === 200 && response.data.success) {
          setAppointments(response.data.data);

          // Tính tổng doanh thu từ các cuộc hẹn đã thanh toán
          let total = 0;
          const doctorsEarningsCopy = {};

          response.data.data.forEach((appointment) => {
            if (
              appointment.paymentId &&
              appointment.paymentId.totalAmount &&
              appointment.doctorId
            ) {
              total += appointment.paymentId.totalAmount;

              // Tính tổng tiền kiếm được của từng bác sĩ
              if (!doctorsEarningsCopy[appointment.doctorId._id]) {
                doctorsEarningsCopy[appointment.doctorId._id] =
                  appointment.paymentId.totalAmount;
              } else {
                doctorsEarningsCopy[appointment.doctorId._id] +=
                  appointment.paymentId.totalAmount;
              }
            }
          });

          setTotalRevenue(total);
          setDoctorsEarnings(doctorsEarningsCopy);
        } else {
          console.error("Error fetching appointments:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments(); // Call the fetch function when component mounts
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-primary border-primary">
                    <i className="fe fe-users"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{doctors.length}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Doctors</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-primary w-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success">
                    <i className="fe fe-credit-card"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{patients.length}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Patients</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success w-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-danger border-danger">
                    <i className="fe fe-money"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{appointments.length}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Appointments</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-danger w-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-warning border-warning">
                    <i className="fe fe-folder"></i>
                  </span>
                  <div className="dash-count">
                    <h3>${totalRevenue}</h3> {/* Hiển thị tổng doanh thu */}
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Revenue</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-warning w-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill">
              <div className="card-header">
                <h4 className="card-title">Doctors List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Speciality</th>
                        <th>Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor._id}>
                          <td>
                            <h2 className="table-avatar">
                              <a className="avatar avatar-sm mr-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  src={userImg}
                                  alt=""
                                />
                              </a>
                              <a> {`${doctor.firstName} ${doctor.lastName}`}</a>
                            </h2>
                          </td>
                          <td>{doctor.specialization}</td>
                          <td>${doctorsEarnings[doctor._id] || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card  card-table flex-fill">
              <div className="card-header">
                <h4 className="card-title">Patients List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Phone</th>
                        <th>Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient._id}>
                          <td>
                            <h2 className="table-avatar">
                              <a
                                href="profile.html"
                                className="avatar avatar-sm mr-2"
                              >
                                <img
                                  className="avatar-img rounded-circle"
                                  src={userImg}
                                  alt=""
                                />
                              </a>
                              <a href="profile.html">{`${patient.firstName} ${patient.lastName}`}</a>
                            </h2>
                          </td>
                          <td>{patient.mobile}</td>
                          <td>{patient.gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-table">
              <div className="card-header">
                <h4 className="card-title">Appointment List</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-start">Doctor Name</th>
                        <th className="text-start">Speciality</th>
                        <th className="text-start">Patient Name</th>
                        <th className="text-start">Appointment Time</th>
                        <th className="text-start">Status</th>
                        <th className="text-start">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="align-middle text-start">
                            <h2 className="table-avatar d-flex align-items-center">
                              <a
                                href="profile.html"
                                className="avatar avatar-sm me-2"
                              >
                                <img
                                  className="avatar-img rounded-circle"
                                  src={userImg}
                                  alt=""
                                />
                              </a>
                              <a href="profile.html">
                                {`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}
                              </a>
                            </h2>
                          </td>
                          <td className="align-middle text-start">
                            {`${appointment.doctorId.specialization}`}
                          </td>
                          <td className="align-middle text-start">
                            <h2 className="table-avatar d-flex align-items-center">
                              <a
                                href="profile.html"
                                className="avatar avatar-sm me-2"
                              >
                                <img
                                  className="avatar-img rounded-circle"
                                  src={userImg}
                                  alt=""
                                />
                              </a>
                              <a href="profile.html">
                                {`${appointment.firstName} ${appointment.lastName}`}
                              </a>
                            </h2>
                          </td>
                          <td className="align-middle text-start">
                            {appointment.appointmentTime}
                            <span className="text-primary d-block">
                              {`${appointment.scheduleDate} ${appointment.scheduleTime}`}
                            </span>
                          </td>
                          <td className="align-middle text-start">
                            {appointment.paymentStatus}
                          </td>
                          <td className="align-middle text-start">
                            {appointment.paymentId?.totalAmount || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
