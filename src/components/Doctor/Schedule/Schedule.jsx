


// import DashboardLayout from '../DashboardLayout/DashboardLayout';
// import React, { useEffect, useState } from 'react';
// import { Space, Tag, Button, Empty, message, TimePicker } from 'antd';
// import { useCreateTimeSlotMutation, useGetDoctorTimeSlotQuery, useUpdateTimeSlotMutation, useDeleteTimeSlotMutation } from '../../../redux/api/timeSlotApi';
// import { FaWindowClose, FaPlus } from "react-icons/fa";
// import UseModal from '../../UI/UseModal';
// import TabForm from '../../UI/form/TabForm';
// import { toast, ToastContainer } from 'react-toastify';
// import useAuthCheck from '../../../redux/hooks/useAuthCheck';
// import dayjs from 'dayjs';
// import 'dayjs/locale/en-gb';

// dayjs.locale('en-gb');

// const Schedule = () => {
//     const [key, setKey] = useState('sunday');
//     const [timeSlot, setTimeSlot] = useState([]);
//     const [editTimeSlot, setEditTimeSlot] = useState([]);
//     const [addTimeSlot, setAddTimeSlot] = useState([]);
//     const [UpdateTimeSlot, { isError: uIsError, error: uError, isLoading: UIsLoading, isSuccess: uIsSuccess }] = useUpdateTimeSlotMutation();
//     const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
//     const [createTimeSlot, { isError: AIsError, error, isLoading: AIsLoading, isSuccess }] = useCreateTimeSlotMutation();
//     const [deleteTimeSlot] = useDeleteTimeSlotMutation();

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const showModal = () => { setIsModalOpen(!isModalOpen) };
//     const handleCancel = () => { setIsModalOpen(false) };
//     const { doctorId } = useAuthCheck();
//     const [idTimeSlot, setIdTimeSlot] = useState([]);

//     const showEditModal = () => {
//         if (data && data.length > 0 && data[0]?.timeSlot && Array.isArray(data[0].timeSlot)) {
//             const filteredTimeSlots = data[0].timeSlot.map(slot => {
//                 return {
//                     ...slot,
//                     doctorTimeSlotId: data[0]._id,
//                     id: slot._id
//                 };
//             });
//             setEditTimeSlot(filteredTimeSlots);
//         } else {
//             console.error("Time slot data is not available or is in an unexpected format.");
//         }
//         setIsEditModalOpen(true);
//     };

//     useEffect(() => {
//         if (data && data.length > 0) {
//             const idTimeSlot = data[0]._id;
//             setIdTimeSlot(idTimeSlot);
//             setTimeSlot(data[0].timeSlot);
//         }
//     }, [data]);

//     const handleEditOk = () => {
//         if (editTimeSlot.length > 0) {
//             const { toCreate, toUpdate } = editTimeSlot.reduce((acc, cur) => {
//                 if (cur._id) {
//                     acc.toUpdate.push(cur);
//                 } else {
//                     acc.toCreate.push({ ...cur, day: key });
//                 }
//                 return acc;
//             }, { toCreate: [], toUpdate: [] });

//             UpdateTimeSlot({ timeSlot: toUpdate, create: toCreate, doctorId: doctorId });
//             // toast.success("Successfully Updated");
//         }
//         setIsEditModalOpen(UIsLoading ? true : false);
//     };

//     useEffect(() => {
//         if (!UIsLoading && uIsError) {
//             message.error(uError?.data?.message);
//         }
//         if (uIsSuccess) {
//             message.success('Successfully Slot Updated');
//         }
//     }, [uIsSuccess, uIsError, UIsLoading, uError?.data?.message]);

//     const handleEditStartTime = (id, time, timeString) => {
//         const findIndex = editTimeSlot.find(item => item.id === id);
//         if (!findIndex) return;
//         const updatedItem = { ...findIndex, startTime: timeString, doctorTimeSlotId: idTimeSlot };
//         setEditTimeSlot(prev => {
//             const indexToUpdate = prev.findIndex(item => item.id === id);
//             if (indexToUpdate !== -1) {
//                 const updatedArray = [...prev];
//                 updatedArray[indexToUpdate] = updatedItem;
//                 return updatedArray;
//             } else {
//                 return [...prev, updatedItem];
//             }
//         });
//     };

//     const handleEditEndTime = (id, time, timeString) => {
//         const findObject = editTimeSlot.find(item => item.id === id);
//         if (!findObject) return;
//         const updatedItem = { ...findObject, endTime: timeString, doctorTimeSlotId: idTimeSlot };
//         setEditTimeSlot(prev => {
//             const indexToUpdate = prev.findIndex(item => item.id === id);
//             if (indexToUpdate !== -1) {
//                 const updatedArray = [...prev];
//                 updatedArray[indexToUpdate] = updatedItem;
//                 return updatedArray;
//             } else {
//                 return [...prev, updatedItem];
//             }
//         });
//     };

//     const handleEditCancel = () => { setIsEditModalOpen(false); };

//     const handleOk = async () => {
//         if (!Array.isArray(addTimeSlot) || addTimeSlot.length === 0) {
//             message.error('Please add time slots before submitting.');
//             return;
//         }

//         const timeSlot = addTimeSlot.map(item => {
//             const { id, ...rest } = item;
//             return rest;
//         });

//         const requestData = {
//             day: key,
//             doctorId: doctorId,
//             timeSlot: timeSlot
//         };

//         try {
//             const response = await createTimeSlot(requestData).unwrap();
//             setTimeSlot(prevTimeSlots => [...prevTimeSlots, ...requestData.timeSlot]);
//             // toast.success('Successfully Added Time Slots');
//         } catch (error) {
//             console.error('Failed to create time slot:', error);
//             message.error('Failed to create time slot');
//         }

//         setIsModalOpen(false);
//     };

//     useEffect(() => {
//         if (!AIsLoading && AIsError) {
//             message.error(error?.data?.message);
//         }
//         if (isSuccess) {
//             message.success('Successfully Added Time Slots');
//         }
//     }, [isSuccess, AIsError, error?.data?.message, AIsLoading]);

//     const handleStartTime = (id, time, timeString) => {
//         setAddTimeSlot(prev => (prev.map(item => item.id === id ? { ...item, startTime: timeString, doctorTimeSlotId: idTimeSlot } : item)));
//     };

//     const handleEndTime = (id, time, timeString) => {
//         setAddTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString, doctorTimeSlotId: idTimeSlot } : item));
//     };

//     const handleOnSelect = (value) => {
//         setKey(value);
//         refetch();
//     };

//     const remove = async (id) => {
//         try {
//             await deleteTimeSlot({ id }).unwrap();
//             console.log("id time slot: ", id)
//             setTimeSlot(prevTimeSlot => prevTimeSlot.filter((item) => item._id !== id));
//             message.success("Successfully deleted Time Slot !!")
//             refetch();
//         } catch (error) {
//             message.error('Failed to delete time slot');
//         }
//     };

//     const addField = (e) => {
//         e.preventDefault();
//         setEditTimeSlot(prev => [...prev, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
//     };

//     const removeFromAddTimeSlot = (id) => {
//         setAddTimeSlot(prevAddTimeSlot => prevAddTimeSlot.filter((item) => item.id !== id));
//     };

//     const addInAddTimeSlot = (e) => {
//         e.preventDefault();
//         setAddTimeSlot(prev => [...prev, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
//     };

//     let content = <div>
//         <Space size={[0, 8]} wrap>
//             {timeSlot.map((item, index) => (
//                 <Tag bordered={false} closable color="processing" onClose={() => remove(item.id)} key={index + 1}>
//                     {item.startTime} - {item.endTime}
//                 </Tag>
//             ))}
//         </Space>
//     </div>;

//     if (isLoading) content = <div className="text-center mt-4">Loading...!</div>;
//     if (!isLoading && !isError && data?.length === 0) content = <Empty />;
//     if (!isLoading && !isError && data?.length > 0) content = (
//         <>
//             {data.map((item, index) => (
//                 <div key={item.id + index}>
//                     <div>
//                         {item?.maximumPatient && <h6>Maximum Patient Limit: {item?.maximumPatient}</h6>}
//                     </div>
//                     <Space size={[0, 'small']} wrap>
//                         {item?.timeSlot && item?.timeSlot.map((time, index) => (
//                             <Tag bordered={false} closable color="processing" onClose={() => remove(time._id)} key={index + 2}>
//                                 {time?.startTime} - {time?.endTime}
//                             </Tag>
//                         ))}
//                     </Space>
//                 </div>
//             ))}
//         </>
//     );

//     return (
//         <>
//         <ToastContainer/>
//             <DashboardLayout>
//                 <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa', height: '90vh' }}>
//                     <h5 className='text-title'>Schedule Timings</h5>
//                     <TabForm content={content} data={data} handleOnSelect={handleOnSelect} showEditModal={showEditModal} showModal={showModal} />
//                 </div>
//             </DashboardLayout>

//             <UseModal title="Edit Time Slots"
//                 isModaOpen={isEditModalOpen}
//                 handleOk={handleEditOk}
//                 handleCancel={handleEditCancel}>
//                 <form>
//                     <div className="hours-info">
//                         <div className="row form-row hours-cont">
//                             {editTimeSlot && editTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditStartTime(item.id, time, timeString)} />
                                               
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditEndTime(item.id, time, timeString)} />
                                                
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => remove(item.id)} block icon={<FaWindowClose />}>
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="my-2 w-25">
//                         <Button type="primary" size='small' htmlType="submit" onClick={(e) => addField(e)} block icon={<FaPlus />}>
//                             Add More
//                         </Button>
//                     </div>
//                 </form>
//             </UseModal>

//             <UseModal title="Add Time Slots" isModaOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}>
//                 <form>
//                     <div className="hours-info">
//                         <div className="row form-row hours-cont">
//                             {addTimeSlot && addTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleStartTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEndTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => removeFromAddTimeSlot(item.id)} block icon={<FaWindowClose />}>
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="my-2 w-25">
//                         <Button type="primary" size='small' htmlType="submit" onClick={(e) => addInAddTimeSlot(e)} block icon={<FaPlus />}>
//                             Add More
//                         </Button>
//                     </div>
//                 </form>
//             </UseModal>
//         </>
//     );
// };

// export default Schedule;
////đã ẩn day
// import DashboardLayout from '../DashboardLayout/DashboardLayout';
// import React, { useEffect, useState } from 'react';
// import { Space, Tag, Button, Empty, message, TimePicker } from 'antd';
// import { useCreateTimeSlotMutation, useGetDoctorTimeSlotQuery, useUpdateTimeSlotMutation, useDeleteTimeSlotMutation } from '../../../redux/api/timeSlotApi';
// import { FaWindowClose, FaPlus } from "react-icons/fa";
// import UseModal from '../../UI/UseModal';
// import TabForm from '../../UI/form/TabForm';
// import { toast, ToastContainer } from 'react-toastify';
// import useAuthCheck from '../../../redux/hooks/useAuthCheck';
// import dayjs from 'dayjs';
// import 'dayjs/locale/en-gb';

// dayjs.locale('en-gb');

// const Schedule = () => {
//     const [key, setKey] = useState('sunday');
//     const [timeSlot, setTimeSlot] = useState([]);
//     const [editTimeSlot, setEditTimeSlot] = useState([]);
//     const [addTimeSlot, setAddTimeSlot] = useState([]);
//     const [UpdateTimeSlot, { isError: uIsError, error: uError, isLoading: UIsLoading, isSuccess: uIsSuccess }] = useUpdateTimeSlotMutation();
//     const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
//     const [createTimeSlot, { isError: AIsError, error, isLoading: AIsLoading, isSuccess }] = useCreateTimeSlotMutation();
//     const [deleteTimeSlot] = useDeleteTimeSlotMutation();

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const showModal = () => { setIsModalOpen(!isModalOpen) };
//     const handleCancel = () => { setIsModalOpen(false) };
//     const { doctorId } = useAuthCheck();
//     const [idTimeSlot, setIdTimeSlot] = useState([]);

//     const showEditModal = () => {
//         if (data && data.length > 0 && data[0]?.timeSlot && Array.isArray(data[0].timeSlot)) {
//             const filteredTimeSlots = data[0].timeSlot.map(slot => {
//                 return {
//                     ...slot,
//                     doctorTimeSlotId: data[0]._id,
//                     id: slot._id
//                 };
//             });
//             setEditTimeSlot(filteredTimeSlots);
//         } else {
//             console.error("Time slot data is not available or is in an unexpected format.");
//         }
//         setIsEditModalOpen(true);
//     };

//     useEffect(() => {
//         if (data && data.length > 0) {
//             const idTimeSlot = data[0]._id;
//             setIdTimeSlot(idTimeSlot);
//             setTimeSlot(data[0].timeSlot);
//         }
//     }, [data]);

//     const handleEditOk = () => {
//         if (editTimeSlot.length > 0) {
//             const { toCreate, toUpdate } = editTimeSlot.reduce((acc, cur) => {
//                 if (cur._id) {
//                     acc.toUpdate.push(cur);
//                 } else {
//                     acc.toCreate.push({ ...cur, day: key });
//                 }
//                 return acc;
//             }, { toCreate: [], toUpdate: [] });

//             UpdateTimeSlot({ timeSlot: toUpdate, create: toCreate, doctorId: doctorId });
//             // toast.success("Successfully Updated");
//         }
//         setIsEditModalOpen(UIsLoading ? true : false);
//     };

//     useEffect(() => {
//         if (!UIsLoading && uIsError) {
//             message.error(uError?.data?.message);
//         }
//         if (uIsSuccess) {
//             message.success('Successfully Slot Updated');
//         }
//     }, [uIsSuccess, uIsError, UIsLoading, uError?.data?.message]);

//     const handleEditStartTime = (id, time, timeString) => {
//         const findIndex = editTimeSlot.find(item => item.id === id);
//         if (!findIndex) return;
//         const updatedItem = { ...findIndex, startTime: timeString, doctorTimeSlotId: idTimeSlot };
//         setEditTimeSlot(prev => {
//             const indexToUpdate = prev.findIndex(item => item.id === id);
//             if (indexToUpdate !== -1) {
//                 const updatedArray = [...prev];
//                 updatedArray[indexToUpdate] = updatedItem;
//                 return updatedArray;
//             } else {
//                 return [...prev, updatedItem];
//             }
//         });
//     };

//     const handleEditEndTime = (id, time, timeString) => {
//         const findObject = editTimeSlot.find(item => item.id === id);
//         if (!findObject) return;
//         const updatedItem = { ...findObject, endTime: timeString, doctorTimeSlotId: idTimeSlot };
//         setEditTimeSlot(prev => {
//             const indexToUpdate = prev.findIndex(item => item.id === id);
//             if (indexToUpdate !== -1) {
//                 const updatedArray = [...prev];
//                 updatedArray[indexToUpdate] = updatedItem;
//                 return updatedArray;
//             } else {
//                 return [...prev, updatedItem];
//             }
//         });
//     };

//     const handleEditCancel = () => { setIsEditModalOpen(false); };

//     const handleOk = async () => {
//         if (!Array.isArray(addTimeSlot) || addTimeSlot.length === 0) {
//             message.error('Please add time slots before submitting.');
//             return;
//         }

//         const timeSlot = addTimeSlot.map(item => {
//             const { id, ...rest } = item;
//             return rest;
//         });

//         const requestData = {
//             day: key,
//             doctorId: doctorId,
//             timeSlot: timeSlot
//         };

//         try {
//             const response = await createTimeSlot(requestData).unwrap();
//             setTimeSlot(prevTimeSlots => [...prevTimeSlots, ...requestData.timeSlot]);
//             // toast.success('Successfully Added Time Slots');
//         } catch (error) {
//             console.error('Failed to create time slot:', error);
//             message.error('Failed to create time slot');
//         }

//         setIsModalOpen(false);
//     };

//     useEffect(() => {
//         if (!AIsLoading && AIsError) {
//             message.error(error?.data?.message);
//         }
//         if (isSuccess) {
//             message.success('Successfully Added Time Slots');
//         }
//     }, [isSuccess, AIsError, error?.data?.message, AIsLoading]);

//     const handleStartTime = (id, time, timeString) => {
//         setAddTimeSlot(prev => (prev.map(item => item.id === id ? { ...item, startTime: timeString, doctorTimeSlotId: idTimeSlot } : item)));
//     };

//     const handleEndTime = (id, time, timeString) => {
//         setAddTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString, doctorTimeSlotId: idTimeSlot } : item));
//     };

//     const handleOnSelect = (value) => {
//         setKey(value);
//         refetch();
//     };

//     const remove = async (id) => {
//         try {
//             await deleteTimeSlot({ id }).unwrap();
//             console.log("id time slot: ", id)
//             setTimeSlot(prevTimeSlot => prevTimeSlot.filter((item) => item._id !== id));
//             message.success("Successfully deleted Time Slot !!")
//             refetch();
//         } catch (error) {
//             message.error('Failed to delete time slot');
//         }
//     };

//     const addField = (e) => {
//         e.preventDefault();
//         setEditTimeSlot(prevState => [...prevState, { id: Math.random(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
//     };

//     const removeFromAddTimeSlot = (id) => {
//         setAddTimeSlot(prevTimeSlot => prevTimeSlot.filter((item) => item.id !== id));
//     };

//     const addInAddTimeSlot = (e) => {
//         e.preventDefault();
//         setAddTimeSlot(prevState => [...prevState, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
//     };

//     const content = (
//         <>
//             {data?.map((item, index) => (
//                 <div key={index} className="d-flex justify-content-between align-items-center">
//                     <div>
//                         <h6>{item?.shift}</h6>
//                         {item?.maximumPatient && <h6>Maximum Patient Limit: {item?.maximumPatient}</h6>}
//                     </div>
//                     <Space size={[0, 'small']} wrap>
//                         {item?.timeSlot && item?.timeSlot.map((time, index) => (
//                             <Tag bordered={false} closable color="processing" onClose={() => remove(time._id)} key={index + 2}>
//                                 {time?.startTime} - {time?.endTime}
//                             </Tag>
//                         ))}
//                     </Space>
//                 </div>
//             ))}
//         </>
//     );

//     const getCurrentDay = () => {
//         const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//         const today = new Date();
//         return days[today.getDay()];
//     };

//     const currentDay = getCurrentDay();

//     return (
//         <>
//             <ToastContainer />
//             <DashboardLayout>
//                 <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa', height: '90vh' }}>
//                     <h5 className='text-title'>Schedule Timings</h5>
//                     <TabForm
//                         content={content}
//                         data={data}
//                         handleOnSelect={handleOnSelect}
//                         showEditModal={showEditModal}
//                         showModal={showModal}
//                         currentDay={currentDay}
//                     />
//                 </div>
//             </DashboardLayout>

//             <UseModal title="Edit Time Slots"
//                 isModaOpen={isEditModalOpen}
//                 handleOk={handleEditOk}
//                 handleCancel={handleEditCancel}>
//                 <form>
//                     <div className="hours-info">
//                         <div className="row form-row hours-cont">
//                             {editTimeSlot && editTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditStartTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditEndTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => remove(item.id)} block icon={<FaWindowClose />}>
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="my-2 w-25">
//                         <Button type="primary" size='small' htmlType="submit" onClick={(e) => addField(e)} block icon={<FaPlus />}>
//                             Add More
//                         </Button>
//                     </div>
//                 </form>
//             </UseModal>

//             <UseModal title="Add Time Slots" isModaOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}>
//                 <form>
//                     <div className="hours-info">
//                         <div className="row form-row hours-cont">
//                             {addTimeSlot && addTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleStartTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEndTime(item.id, time, timeString)} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => removeFromAddTimeSlot(item.id)} block icon={<FaWindowClose />}>
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="my-2 w-25">
//                         <Button type="primary" size='small' htmlType="submit" onClick={(e) => addInAddTimeSlot(e)} block icon={<FaPlus />}>
//                             Add More
//                         </Button>
//                     </div>
//                 </form>
//             </UseModal>
//         </>
//     );
// };

// export default Schedule;

////ẩn các nút add, edit các ngày trong tuần trừ chủ nhật

import DashboardLayout from '../DashboardLayout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { Space, Tag, Button, Empty, message, TimePicker } from 'antd';
import { useCreateTimeSlotMutation, useGetDoctorTimeSlotQuery, useUpdateTimeSlotMutation, useDeleteTimeSlotMutation } from '../../../redux/api/timeSlotApi';
import { FaWindowClose, FaPlus } from "react-icons/fa";
import UseModal from '../../UI/UseModal';
import TabForm from '../../UI/form/TabForm';
import { toast, ToastContainer } from 'react-toastify';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

dayjs.locale('en-gb');

const Schedule = () => {
    const [key, setKey] = useState('sunday');
    const [timeSlot, setTimeSlot] = useState([]);
    const [editTimeSlot, setEditTimeSlot] = useState([]);
    const [addTimeSlot, setAddTimeSlot] = useState([]);
    const [UpdateTimeSlot, { isError: uIsError, error: uError, isLoading: UIsLoading, isSuccess: uIsSuccess }] = useUpdateTimeSlotMutation();
    const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
    const [createTimeSlot, { isError: AIsError, error, isLoading: AIsLoading, isSuccess }] = useCreateTimeSlotMutation();
    const [deleteTimeSlot] = useDeleteTimeSlotMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const showModal = () => { setIsModalOpen(!isModalOpen) };
    const handleCancel = () => { setIsModalOpen(false) };
    const { doctorId } = useAuthCheck();
    const [idTimeSlot, setIdTimeSlot] = useState([]);

    const showEditModal = () => {
        if (data && data.length > 0 && data[0]?.timeSlot && Array.isArray(data[0].timeSlot)) {
            const filteredTimeSlots = data[0].timeSlot.map(slot => {
                return {
                    ...slot,
                    doctorTimeSlotId: data[0]._id,
                    id: slot._id
                };
            });
            setEditTimeSlot(filteredTimeSlots);
        } else {
            console.error("Time slot data is not available or is in an unexpected format.");
        }
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            const idTimeSlot = data[0]._id;
            setIdTimeSlot(idTimeSlot);
            setTimeSlot(data[0].timeSlot);
        }
    }, [data]);

    const handleEditOk = () => {
        if (editTimeSlot.length > 0) {
            const { toCreate, toUpdate } = editTimeSlot.reduce((acc, cur) => {
                if (cur._id) {
                    acc.toUpdate.push(cur);
                } else {
                    acc.toCreate.push({ ...cur, day: key });
                }
                return acc;
            }, { toCreate: [], toUpdate: [] });

            UpdateTimeSlot({ timeSlot: toUpdate, create: toCreate, doctorId: doctorId });
        }
        setIsEditModalOpen(UIsLoading ? true : false);
    };

    useEffect(() => {
        if (!UIsLoading && uIsError) {
            message.error(uError?.data?.message);
        }
        if (uIsSuccess) {
            message.success('Successfully Slot Updated');
        }
    }, [uIsSuccess, uIsError, UIsLoading, uError?.data?.message]);

    const handleEditStartTime = (id, time, timeString) => {
        const findIndex = editTimeSlot.find(item => item.id === id);
        if (!findIndex) return;
        const updatedItem = { ...findIndex, startTime: timeString, doctorTimeSlotId: idTimeSlot };
        setEditTimeSlot(prev => {
            const indexToUpdate = prev.findIndex(item => item.id === id);
            if (indexToUpdate !== -1) {
                const updatedArray = [...prev];
                updatedArray[indexToUpdate] = updatedItem;
                return updatedArray;
            } else {
                return [...prev, updatedItem];
            }
        });
    };

    const handleEditEndTime = (id, time, timeString) => {
        const findObject = editTimeSlot.find(item => item.id === id);
        if (!findObject) return;
        const updatedItem = { ...findObject, endTime: timeString, doctorTimeSlotId: idTimeSlot };
        setEditTimeSlot(prev => {
            const indexToUpdate = prev.findIndex(item => item.id === id);
            if (indexToUpdate !== -1) {
                const updatedArray = [...prev];
                updatedArray[indexToUpdate] = updatedItem;
                return updatedArray;
            } else {
                return [...prev, updatedItem];
            }
        });
    };

    const handleEditCancel = () => { setIsEditModalOpen(false); };

    const handleOk = async () => {
        if (!Array.isArray(addTimeSlot) || addTimeSlot.length === 0) {
            message.error('Please add time slots before submitting.');
            return;
        }

        const timeSlot = addTimeSlot.map(item => {
            const { id, ...rest } = item;
            return rest;
        });

        const requestData = {
            day: key,
            doctorId: doctorId,
            timeSlot: timeSlot
        };

        try {
            const response = await createTimeSlot(requestData).unwrap();
            setTimeSlot(prevTimeSlots => [...prevTimeSlots, ...requestData.timeSlot]);
        } catch (error) {
            console.error('Failed to create time slot:', error);
            message.error('Failed to create time slot');
        }

        setIsModalOpen(false);
    };

    useEffect(() => {
        if (!AIsLoading && AIsError) {
            message.error(error?.data?.message);
        }
        if (isSuccess) {
            message.success('Successfully Added Time Slots');
        }
    }, [isSuccess, AIsError, error?.data?.message, AIsLoading]);

    const handleStartTime = (id, time, timeString) => {
        setAddTimeSlot(prev => (prev.map(item => item.id === id ? { ...item, startTime: timeString, doctorTimeSlotId: idTimeSlot } : item)));
    };

    const handleEndTime = (id, time, timeString) => {
        setAddTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString, doctorTimeSlotId: idTimeSlot } : item));
    };

    const handleOnSelect = (value) => {
        setKey(value);
        refetch();
    };

    const getCurrentDay = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        return days[today.getDay()];
    };

    const currentDay = getCurrentDay();

    const remove = async (id) => {
        if (currentDay !== 'sunday') {
            message.error('Time slots can only be deleted on Sundays.');
            return;
        }

        try {
            await deleteTimeSlot({ id }).unwrap();
            console.log("id time slot: ", id)
            setTimeSlot(prevTimeSlot => prevTimeSlot.filter((item) => item._id !== id));
            message.success("Successfully deleted Time Slot !!")
            refetch();
        } catch (error) {
            message.error('Failed to delete time slot');
        }
    };

    const addField = (e) => {
        e.preventDefault();
        setEditTimeSlot(prevState => [...prevState, { id: Math.random(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
    };

    const removeFromAddTimeSlot = (id) => {
        setAddTimeSlot(prevTimeSlot => prevTimeSlot.filter((item) => item.id !== id));
    };

    const addInAddTimeSlot = (e) => {
        e.preventDefault();
        setAddTimeSlot(prevState => [...prevState, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
    };

    const content = (
        <>
            {data?.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6>{item?.shift}</h6>
                        {item?.maximumPatient && <h6>Maximum Patient Limit: {item?.maximumPatient}</h6>}
                    </div>
                    <Space size={[0, 'small']} wrap>
                        {item?.timeSlot && item?.timeSlot.map((time, index) => (
                            <Tag bordered={false}  closable={currentDay === 'sunday'} color="processing" onClose={() => remove(time._id)} key={index + 2}>
                                {time?.startTime} - {time?.endTime}
                            </Tag>
                        ))}
                    </Space>
                </div>
            ))}
        </>
    );
    return (
        <>
            <ToastContainer />
            <DashboardLayout>
                <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa', height: '90vh' }}>
                    <h5 className='text-title'>Schedule Timings</h5>
                    <TabForm
                        content={content}
                        data={data}
                        handleOnSelect={handleOnSelect}
                        showEditModal={showEditModal}
                        showModal={showModal}
                        currentDay={currentDay}
                    />
                </div>
            </DashboardLayout>

            <UseModal title="Edit Time Slots"
                isModaOpen={isEditModalOpen}
                handleOk={handleEditOk}
                handleCancel={handleEditCancel}>
                <form>
                    <div className="hours-info">
                        <div className="row form-row hours-cont">
                            {editTimeSlot && editTimeSlot.map((item, index) => (
                                <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
                                    <div className="row form-row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>Start Time</label>
                                                <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditStartTime(item.id, time, timeString)} />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>End Time</label>
                                                <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEditEndTime(item.id, time, timeString)} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="primary" size='small' htmlType="submit" onClick={() => remove(item.id)} block icon={<FaWindowClose />}>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="my-2 w-25">
                        <Button type="primary" size='small' htmlType="submit" onClick={(e) => addField(e)} block icon={<FaPlus />}>
                            Add More
                        </Button>
                    </div>
                </form>
            </UseModal>

            <UseModal title="Add Time Slots" isModaOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}>
                <form>
                    <div className="hours-info">
                        <div className="row form-row hours-cont">
                            {addTimeSlot && addTimeSlot.map((item, index) => (
                                <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
                                    <div className="row form-row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>Start Time</label>
                                                <TimePicker value={item.startTime ? dayjs(item.startTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleStartTime(item.id, time, timeString)} />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>End Time</label>
                                                <TimePicker value={item.endTime ? dayjs(item.endTime, 'hh:mm A') : null} format="hh:mm A" onChange={(time, timeString) => handleEndTime(item.id, time, timeString)} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="primary" size='small' htmlType="submit" onClick={() => removeFromAddTimeSlot(item.id)} block icon={<FaWindowClose />}>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="my-2 w-25">
                        <Button type="primary" size='small' htmlType="submit" onClick={(e) => addInAddTimeSlot(e)} block icon={<FaPlus />}>
                            Add More
                        </Button>
                    </div>
                </form>
            </UseModal>
        </>
    );
};

export default Schedule;




