// import React, { useEffect, useState } from 'react';
// import { DatePicker } from "antd";
// import moment from 'moment';

// const { RangePicker } = DatePicker;

// const MedicineRangePickerForm = ({ id, medicineList, setMedicineList }) => {
//     const [dates, setDates] = useState([null, null]);

//     useEffect(() => {
//         const findObj = medicineList.find((item) => item.id === id);
//         if (findObj && findObj.duration) {
//             const [startDate, endDate] = findObj.duration.split(',').map(date => moment(date, 'YYYY-MM-DD'));
//             console.log("Parsed dates: ", { startDate, endDate });
//             setDates([startDate, endDate]);
//         }
//     }, [id, medicineList]);

//     const onRangeChange = (dates, dateStrings) => {
//         if (dates) {
//             const durationData = dateStrings.join(',');
//             const findObj = medicineList.find((item) => item.id === id);
//             const updateObj = { ...findObj, duration: durationData };

//             setMedicineList(prev => {
//                 const findToIndex = prev.findIndex(item => item.id === id);
//                 if (findToIndex !== -1) {
//                     const prevArray = [...prev];
//                     prevArray[findToIndex] = updateObj;
//                     return prevArray;
//                 } else {
//                     return [...prev, updateObj];
//                 }
//             });
//         }
//     };

//     const disabledDate = (current) => {
//         return current && current < moment().startOf('day');
//     };

//     return (
//         <RangePicker
//             onChange={onRangeChange}
//             size="large"
//             style={{ width: '100%' }}
//             disabledDate={disabledDate}
//             value={dates}
//             format="YYYY-MM-DD"
//         />
//     );
// }

// export default MedicineRangePickerForm;


import React, { useEffect, useState } from 'react';
import { DateRangePresets } from '../../../constant/global';
import { DatePicker } from "antd";
import moment from 'moment';

const { RangePicker } = DatePicker;

const MedicineRangePickerForm = ({ id, medicineList, setMedicineList }) => {
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        const findObj = medicineList.find((item) => item.id === id);
        if (findObj && findObj.duration) {
            let [startDate, endDate] = findObj.duration.split(',').map(date => moment.utc(date));

            // Ensure startDate is before endDate
            // if (startDate.isAfter(endDate)) {
            //     [startDate, endDate] = [endDate, startDate];
            // }

            setDates([startDate, endDate]);
        }
    }, [id, medicineList]);

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            const durationData = dateStrings.join(',');
            const findObj = medicineList.find((item) => item.id === id);
            const updateObj = { ...findObj, duration: durationData };

            setMedicineList(prev => {
                const findToIndex = prev.findIndex(item => item.id === id);
                if (findToIndex !== -1) {
                    const prevArray = [...prev];
                    prevArray[findToIndex] = updateObj;
                    return prevArray;
                } else {
                    return [...prev, updateObj];
                }
            });
        }
    };

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current < moment().startOf('day');
    };

    return (
        <RangePicker
        presets={DateRangePresets}
        onChange={onRangeChange}
        size="large"
        style={{ width: '100%' }}
        disabledDate={disabledDate}
        value={dates}
        format="YYYY-MM-DD" // Ensure consistent date format
    />
    );
}

export default MedicineRangePickerForm;
