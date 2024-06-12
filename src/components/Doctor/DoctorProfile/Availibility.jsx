import React from 'react'
import { useGetTimeSlotQuery } from '../../../redux/api/timeSlotApi';
import { toast } from 'react-toastify';

const Availibility = ({doctorId}) => {
    const { data, error, isLoading } = useGetTimeSlotQuery(doctorId);

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error(error?.data?.message || error.message);
        return <div>Error loading data</div>;
    }
    // console.log("availability data: ", data);
    const timeSlot = Array.isArray(data.timeSlot) ? data.timeSlot : [];
    // console.log("time slots: ", timeSlot)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="col-md-12">
            <div className="widget business-widget">
                <div className="widget-content">
                    {data.length > 0 ?
                           ( <div className="listing-hours row d-flex justify-content-center">
                                                    
                            {data?.map((daySlot, index) => (
                                <div class="card col-md-2 m-2 p-0" key={index}>
                                    <h5 class="card-header d-flex justify-content-center">
                                        {capitalizeFirstLetter(daySlot.day)}
                                    </h5>
                                        {daySlot.timeSlot.map((slot, slotIndex) => (
                                            <div class="card-body" key={slotIndex}>
                                                    <p class="card-text" > {slot.startTime} - {slot.endTime}</p>
                                            </div>
                                        ))}
                                </div>
                            ))}
                            </div>) : <div>
                                <h5>The doctor still doesn't have a time slot.</h5>
                            </div>
                    }
                   
                </div>
            </div>

        </div>
    )
}

export default Availibility