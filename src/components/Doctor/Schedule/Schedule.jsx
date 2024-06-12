
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { Space, Tag, Button, Empty, message, TimePicker } from 'antd';
import { useCreateTimeSlotMutation, useGetDoctorTimeSlotQuery, useUpdateTimeSlotMutation } from '../../../redux/api/timeSlotApi';
import { FaWindowClose, FaPlus } from "react-icons/fa";
import UseModal from '../../UI/UseModal';
import TimePicer from '../../UI/form/TimePicer';
import TabForm from '../../UI/form/TabForm';
import { toast, ToastContainer } from 'react-toastify';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';


const Schedule = () => {
    const [key, setKey] = useState('sunday');
    const [timeSlot, setTimeSlot] = useState([]);
    const [editTimeSlot, setEditTimeSlot] = useState([]);
    const [addTimeSlot, setAddTimeSlot] = useState([]);
    const [UpdateTimeSlot, { isError: uIsError, error: uError, isLoading: UIsLoading, isSuccess: uIsSuccess }] = useUpdateTimeSlotMutation();
    const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
    const [createTimeSlot, { isError: AIsError, error, isLoading: AIsLoading, isSuccess }] = useCreateTimeSlotMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const showModal = () => { setIsModalOpen(!isModalOpen) };
    const handleCancel = () => { setIsModalOpen(false) };

    // const showEditModal = () => {
    //     // Ensure data exists and has the expected structure
    //     if (data && data[0]?.timeSlot) {
    //       // Map through the timeSlot array correctly
    //       setEditTimeSlot(data[0].timeSlot.map(slot => ({
    //         ...slot,
    //         doctorTimeSlotId: data[0]._id,
    //         id: slot._id
    //       })));
    //     }
    //     console.log("data time slot: ", data[0]?.timeSlot[0]); // Debugging output
    //     setIsEditModalOpen(true);
    //   };
    const showEditModal = () => {
        // Ensure data exists and has the expected structure
        if (data && data.length > 0 && data[0]?.timeSlot && Array.isArray(data[0].timeSlot)) {
          // Map through the timeSlot array correctly
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
    const { doctorId } = useAuthCheck();
    const [idTimeSlot, setIdTimeSlot] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            const idTimeSlot = data[0]._id; 
            setIdTimeSlot(idTimeSlot);
            setTimeSlot(data[0].timeSlot); // Set initial time slots
            console.log("id doctor time slot: ", idTimeSlot); 
        }
    }, [data]);

    const handleEditOk = () => {
        if (editTimeSlot.length > 0) {
            const { toCreate, toUpdate } = editTimeSlot.reduce((acc, cur) => {
                if (cur.doctorTimeSlotId) {
                    acc.toUpdate.push(cur);
                } else {
                    acc.toCreate.push({ ...cur, day: key });
                }
                return acc;
            }, { toCreate: [], toUpdate: [] });

            console.log("time slot update: ", toUpdate);
            console.log("create update: ", toCreate);
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
            console.log("index to update: ", indexToUpdate);
            if (indexToUpdate !== -1) {
                const updatedArray = [...prev];
                updatedArray[indexToUpdate] = updatedItem;
                return updatedArray;
            } else {
                return [...prev, updatedItem];
            }
        });
    };
    // const handleEditStartTime = (id, time, timeString) => {
    //     console.log('handleEditStartTime: ', id, time, timeString);
    //     setEditTimeSlot(prev => {
    //         const updatedSlots = prev.map(item => item.id === id ? { ...item, startTime: timeString } : item);
    //         console.log('Updated Slots: ', updatedSlots);
    //         return updatedSlots;
    //     });
    // };
    
    // const handleEditEndTime = (id, time, timeString) => {
    //     console.log('handleEditEndTime: ', id, time, timeString)
    //     setEditTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString } : item));
    // };
    
    const handleEditEndTime = (id, time, timeString) => {
        const findObject = editTimeSlot.find(item => item.id === id);
        if (!findObject) return;
        const updatedItem = { ...findObject, endTime: timeString, doctorTimeSlotId: idTimeSlot };
        setEditTimeSlot(prev => {
            const indexToUpdate = prev.findIndex(item => item.id === id);
            console.log("index to update: ", indexToUpdate);
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
            toast.success('Successfully Added Time Slots');
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

    const remove = (id) => {
        setTimeSlot(timeSlot.filter((item) => item.id !== id));
    };

    const addField = (e) => {
        e.preventDefault();
        setEditTimeSlot(prev => [...prev, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
    };

    const removeFromAddTimeSlot = (id) => {
        setAddTimeSlot(addTimeSlot.filter((item) => item.id !== id));
    };

    const addInAddTimeSlot = (e) => {
        e.preventDefault();
        setAddTimeSlot(prev => [...prev, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
    };

    let content = <div>
        <Space size={[0, 8]} wrap>
            {timeSlot.map((item, index) => (
                <Tag bordered={false} closable color="processing" onClose={() => remove(item.id)} key={index + 1}>
                    {item.startTime} - {item.endTime}
                </Tag>
            ))}
        </Space>
    </div>;

    if (isLoading) content = <div className="text-center mt-4">Loading...!</div>;
    if (!isLoading && !isError && data?.length === 0) content = <Empty />;
    if (!isLoading && !isError && data?.length > 0) content = (
        <>
            {data.map((item, index) => (
                <div key={item.id + index}>
                    <div>
                        {item?.maximumPatient && <h6>Maximum Patient Limit: {item?.maximumPatient}</h6>}
                    </div>
                    <Space size={[0, 'small']} wrap>
                        {item?.timeSlot && item?.timeSlot.map((time, index) => (
                            <Tag bordered={false} closable color="processing" key={index + 2}>
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
            <DashboardLayout>
                <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa', height: '90vh' }}>
                    <h5 className='text-title'>Schedule Timings</h5>
                    <TabForm content={content} data={data} handleOnSelect={handleOnSelect} showEditModal={showEditModal} showModal={showModal} />
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
                                                {
                                                    console.log("item start time: ", item.startTime)
                                                }
                                                <TimePicer  handleFunction={handleEditStartTime} time={item.startTime} id={item.id}/>
                                                {/* <TimePicker handleFunction={handleEditStartTime} value={item.startTime} id={item.id}/> */}
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>End Time</label>
                                                {
                                                    console.log("item end time: ", item.endTime)
                                                }
                                                <TimePicer handleFunction={handleEditEndTime} time={item.endTime} id={item.id} value={item.startTime} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="primary" size='small' htmlType="submit" onClick={() => remove(item?.id)} block icon={<FaWindowClose />}>
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
                                                <TimePicer handleFunction={handleStartTime} time={item.startTime} id={item.id} />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label>End Time</label>
                                                <TimePicer handleFunction={handleEndTime} time={item.endTime} id={item.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="primary" size='small' htmlType="submit" onClick={() => removeFromAddTimeSlot(item?.id)} block icon={<FaWindowClose />}>
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


// import DashboardLayout from '../DashboardLayout/DashboardLayout';
// import React, { useEffect, useState } from 'react';
// import { Space, Tag, Button, Empty, message, TimePicker } from 'antd';
// import { useCreateTimeSlotMutation, useGetDoctorTimeSlotQuery, useUpdateTimeSlotMutation } from '../../../redux/api/timeSlotApi';
// import { FaWindowClose, FaPlus } from "react-icons/fa";
// import UseModal from '../../UI/UseModal';
// import TabForm from '../../UI/form/TabForm';
// import { toast, ToastContainer } from 'react-toastify';
// import useAuthCheck from '../../../redux/hooks/useAuthCheck';
// import moment from 'moment';
// import dayjs from 'dayjs';

// const Schedule = () => {
//     const [key, setKey] = useState('sunday');
//     const [timeSlot, setTimeSlot] = useState([]);
//     const [editTimeSlot, setEditTimeSlot] = useState([]);
//     const [addTimeSlot, setAddTimeSlot] = useState([]);
//     const [UpdateTimeSlot, { isError: uIsError, error: uError, isLoading: UIsLoading, isSuccess: uIsSuccess }] = useUpdateTimeSlotMutation();
//     const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({ day: key });
//     const [createTimeSlot, { isError: AIsError, error, isLoading: AIsLoading, isSuccess }] = useCreateTimeSlotMutation();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const showModal = () => { setIsModalOpen(!isModalOpen) };
//     const handleCancel = () => { setIsModalOpen(false) };
//     const [value, setValue] = useState<dayjs | null>(null);

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

//     const { doctorId } = useAuthCheck();
//     const [idTimeSlot, setIdTimeSlot] = useState(null);

//     useEffect(() => {
//         if (data && data.length > 0) {
//             const idTimeSlot = data[0]._id;
//             setIdTimeSlot(idTimeSlot);
//             setTimeSlot(data[0].timeSlot || []);
//         }
//     }, [data]);

//     const handleEditOk = () => {
//         if (editTimeSlot.length > 0) {
//             const { toCreate, toUpdate } = editTimeSlot.reduce((acc, cur) => {
//                 if (cur.doctorTimeSlotId) {
//                     acc.toUpdate.push(cur);
//                 } else {
//                     acc.toCreate.push({ ...cur, day: key });
//                 }
//                 return acc;
//             }, { toCreate: [], toUpdate: [] });

//             UpdateTimeSlot({ timeSlot: toUpdate, create: toCreate, doctorId: doctorId });
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

//     const handleEditStartTime = (id, time) => {
//         const timeString = time ? time.format('HH:mm') : '';
//         setEditTimeSlot(prev => prev.map(item => item.id === id ? { ...item, startTime: timeString } : item));
//     };

//     const handleEditEndTime = (id, time) => {
//         const timeString = time ? time.format('HH:mm') : '';
//         setEditTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString } : item));
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
//             toast.success('Successfully Added Time Slots');
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

//     const handleStartTime = (id, time) => {
//         const timeString = time ? time.format('HH:mm') : '';
//         setAddTimeSlot(prev => prev.map(item => item.id === id ? { ...item, startTime: timeString, doctorTimeSlotId: idTimeSlot } : item));
//     };

//     const handleEndTime = (id, time) => {
//         const timeString = time ? time.format('HH:mm') : '';
//         setAddTimeSlot(prev => prev.map(item => item.id === id ? { ...item, endTime: timeString, doctorTimeSlotId: idTimeSlot } : item));
//     };

//     const handleOnSelect = (value) => {
//         setKey(value);
//         refetch();
//     };

//     const remove = (id) => {
//         setTimeSlot(timeSlot.filter((item) => item.id !== id));
//     };

//     const addField = (e) => {
//         e.preventDefault();
//         setEditTimeSlot(prev => [...prev, { id: Date.now(), startTime: '', endTime: '', doctorTimeSlotId: idTimeSlot }]);
//     };

//     const removeFromAddTimeSlot = (id) => {
//         setAddTimeSlot(addTimeSlot.filter((item) => item.id !== id));
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
//     if (!isLoading && !isError && (!data || data.length === 0)) content = <Empty />;
//     if (!isLoading && !isError && data?.length > 0) content = (
//         <>
//             {data.map((item, index) => (
//                 <div key={item.id + index}>
//                     <div>
//                         {item?.maximumPatient && <h6>Maximum Patient Limit: {item?.maximumPatient}</h6>}
//                     </div>
//                     <Space size={[0, 'small']} wrap>
//                         {item?.timeSlot && item?.timeSlot.map((time, index) => (
//                             <Tag bordered={false} closable color="processing" key={index + 2}>
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
//             <DashboardLayout>
//                 <div className="w-100 mb-3 rounded p-3" style={{ background: '#f8f9fa', height: '90vh' }}>
//                     <h5 className='text-title'>Schedule Timings</h5>
//                     <TabForm content={content} data={data} handleOnSelect={handleOnSelect} showEditModal={showEditModal} showModal={showModal} />
//                     <ToastContainer />
//                 </div>
//             </DashboardLayout>

//             <UseModal title="Update Time Slots" isModaOpen={isEditModalOpen} handleOk={handleEditOk} handleCancel={handleEditCancel}>
//                 <form>
//                     <div className="hours-info">
//                         <div className="row form-row hours-cont">
//                             {Array.isArray(editTimeSlot) && editTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker
//                                                     value={item.startTime ? dayjs(item.startTime, 'HH:mm') : null}
//                                                     onChange={(time) => handleEditStartTime(item.id, time)}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker
//                                                     value={item.endTime ? dayjs(item.endTime, 'HH:mm') : null}
//                                                     onChange={(time) => handleEditEndTime(item.id, time)}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => remove(item?.id)} block icon={<FaWindowClose />}>
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
//                             {Array.isArray(addTimeSlot) && addTimeSlot.map((item, index) => (
//                                 <div className="col-12 col-md-10 d-flex align-items-center justify-content-between" key={item.id}>
//                                     <div className="row form-row">
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>Start Time</label>
//                                                 <TimePicker
//                                                     value={item.startTime ? dayjs(item.startTime, 'HH:mm') : null}
//                                                     onChange={(time) => handleStartTime(item.id, time)}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="col-12 col-md-6">
//                                             <div className="form-group">
//                                                 <label>End Time</label>
//                                                 <TimePicker
//                                                     value={item.endTime ? dayjs(item.endTime, 'HH:mm') : null}
//                                                     onChange={(time) => handleEndTime(item.id, time)}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <Button type="primary" size='small' htmlType="submit" onClick={() => removeFromAddTimeSlot(item?.id)} block icon={<FaWindowClose />}>
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
