// import { Checkbox, message } from 'antd';
// import { useEffect, useState } from 'react';
// import useAuthCheck from '../../redux/hooks/useAuthCheck';

// const PersonalInformation = ({ handleChange, selectValue, setPatientId = () => {} }) => {
//     const [formData, setFormData] = useState(selectValue);
//     const [checked, setChecked] = useState(false);
//     const { data } = useAuthCheck();

//     const onChange = (e) => {
//         setChecked(e.target.checked);
//     };

//     useEffect(() => {
//         if (checked) {
//             if (data._id) {
//                 setPatientId(data._id);
//                 message.success("User Has Found !");
//                 setFormData({
//                     firstName: data.firstName || '',
//                     lastName: data.lastName || '',
//                     email: data.email || '',
//                     mobile: data.mobile || '',
//                     reasonForVisit: formData.reasonForVisit, // Keep existing value if any
//                     description: formData.description, // Keep existing value if any
//                     address: data.address || '',
//                 });
//             } else {
//                 message.error("User is not Found, Please Login!");
//             }
//         }
//     }, [checked, data, setPatientId]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//         handleChange(e);
//     };

//     return (
//         <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
//             <div className="row">
//                 <Checkbox checked={checked} onChange={onChange}>
//                     Already Have an Account?
//                 </Checkbox>

//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>First Name</label>
//                         <input onChange={handleInputChange} name='firstName' value={formData.firstName || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Last Name</label>
//                         <input onChange={handleInputChange} name='lastName' value={formData.lastName || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Email</label>
//                         <input onChange={handleInputChange} name='email' value={formData.email || ''} className="form-control" type="email" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Phone</label>
//                         <input onChange={handleInputChange} name='mobile' value={formData.mobile || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Reason For Visit</label>
//                         <textarea rows={8} onChange={handleInputChange} name='reasonForVisit' value={formData.reasonForVisit || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Description</label>
//                         <textarea rows={8} onChange={handleInputChange} name='description' value={formData.description || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//                 <div className="col-md-6 col-sm-12">
//                     <div className="form-group card-label mb-3">
//                         <label>Address</label>
//                         <input onChange={handleInputChange} name='address' value={formData.address || ''} className="form-control" type="text" />
//                     </div>
//                 </div>
//             </div>
//         </form>
//     );
// };

// export default PersonalInformation;
import { Checkbox, message } from 'antd';
import { useEffect, useState } from 'react';
import useAuthCheck from '../../redux/hooks/useAuthCheck';

const PersonalInformation = ({ handleChange, selectValue, setPatientId = () => {}, handleFormDataChange }) => {
    const [formData, setFormData] = useState(selectValue);
    const [checked, setChecked] = useState(false);
    const { data } = useAuthCheck();

    const onChange = (e) => {
        setChecked(e.target.checked);
    };

    // console.log(formData)

    useEffect(() => {
        if (checked) {
            if (data._id) {
                setPatientId(data._id);
                message.success("User Has Found !");
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    reasonForVisit: formData.reasonForVisit, // Keep existing value if any
                    description: formData.description, // Keep existing value if any
                    address: data.address || '',
                });
            } else {
                message.error("User is not Found, Please Login!");
            }
        }
    }, [checked, data, setPatientId]);

    useEffect(() => {
        handleFormDataChange(formData);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        handleChange(e);
    };

    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <Checkbox checked={checked} onChange={onChange}>
                    Already Have an Account?
                </Checkbox>

                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>First Name</label>
                        <input onChange={handleInputChange} name='firstName' value={formData.firstName || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Last Name</label>
                        <input onChange={handleInputChange} name='lastName' value={formData.lastName || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Email</label>
                        <input onChange={handleInputChange} name='email' value={formData.email || ''} className="form-control" type="email" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Phone</label>
                        <input onChange={handleInputChange} name='mobile' value={formData.mobile || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Reason For Visit</label>
                        <textarea rows={8} onChange={handleInputChange} name='reasonForVisit' value={formData.reasonForVisit || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Description</label>
                        <textarea rows={8} onChange={handleInputChange} name='description' value={formData.description || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Address</label>
                        <input onChange={handleInputChange} name='address' value={formData.address || ''} className="form-control" type="text" />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PersonalInformation;

