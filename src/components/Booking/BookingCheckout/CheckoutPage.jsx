import moment from 'moment';
import img from '../../../images/avatar.jpg';
import { Link } from 'react-router-dom';
import './BookingCheckout.css';
import { useState, useEffect } from 'react';

const CheckoutPage = ({ handleChange, selectValue, isCheck, setIsChecked, data, selectedDate, selectTime }) => {
    const { nameOnCard, cardNumber, expiredMonth, cardExpiredYear, cvv, paymentType, paymentMethod } = selectValue;

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(true);

    const handleValidation = (fieldName, value) => {
        let isValid = true;
        const newErrors = { ...errors };
    
        // Ensure value is a string
        const stringValue = (value || '').toString().trim();
    
        switch (fieldName) {
            case 'nameOnCard':
                if (stringValue.length > 0) {  // Check if field is not empty
                    if (/\d/.test(stringValue)) {
                        newErrors.nameOnCard = 'Name on card should not contain numbers';
                        isValid = false;
                    } else if (stringValue.length > 20) {
                        newErrors.nameOnCard = 'Must not exceed 20 characters';
                        isValid = false;
                    } else {
                        delete newErrors.nameOnCard;
                    }
                }
                break;
            case 'cardNumber':
                const digits = stringValue.replace(/\D+/g, '');
                if (digits.length !== 16) {
                    newErrors.cardNumber = 'Must be 16 digits';
                    isValid = false;
                } else {
                    delete newErrors.cardNumber;
                }
                break;
            case 'expiredMonth':
                if (stringValue.length > 0) {  // Check if field is not empty
                    const monthValue = parseInt(stringValue, 10);
                    if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
                        newErrors.expiredMonth = 'Must be between 1 and 12';
                        isValid = false;
                    } else {
                        delete newErrors.expiredMonth;
                    }
                }
                break;
            case 'cardExpiredYear':
                if (stringValue.length > 0) {  // Check if field is not empty
                    const yearValue = parseInt(stringValue, 10);
                    if (stringValue.length !== 4 || isNaN(yearValue) || ![2024, 2025, 2026, 2027, 2028].includes(yearValue)) {
                        newErrors.cardExpiredYear = 'Must be a valid 4-digit year (2024-2028)';
                        isValid = false;
                    } else {
                        delete newErrors.cardExpiredYear;
                    }
                }
                break;
            case 'cvv':
                if (stringValue.length > 0) {  // Check if field is not empty
                    if (stringValue.length !== 3) {
                        newErrors.cvv = 'Must be 3 digits';
                        isValid = false;
                    } else {
                        delete newErrors.cvv;
                    }
                }
                break;
            default:
                break;
        }
    
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
        return isValid;
    } 

    useEffect(() => {
        const validateForm = () => {
            let valid = true;
            const fieldsToValidate = ['nameOnCard', 'cardNumber', 'expiredMonth', 'cardExpiredYear', 'cvv'];
            fieldsToValidate.forEach(field => {
                if (!handleValidation(field, selectValue[field])) {
                    valid = false;
                }
            });
            setIsFormValid(valid);
        };
    
        validateForm();
    }, [selectValue]);

    const formatCardNumber = (value) => {
        const stringValue = (value || '').toString().trim();
        const digits = stringValue.replace(/\D+/g, '');
        return digits.match(/.{1,4}/g)?.join(' ') || '';
    }
     

    // const handleBlur = (e) => {
    //     const { name, value } = e.target;
    //     if (name === 'cardNumber') {
    //         const formattedValue = formatCardNumber(value);
    //         handleChange({ target: { name, value: formattedValue } });
    //     }
    //     handleValidation(name, value);
        
    // }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        handleValidation(name, value);
    }

    const handleCheck = () => {
        if (isFormValid) {
            setIsChecked(!isCheck);
        }
    }

    let price = data?.price ? data.price : 60;
    let doctorImg = data?.img ? data?.img : img;

    const vat = data?.vat ? data.vat : (0.15 * price).toFixed(2);
    const bookingFee = 10;
    const total = (parseFloat(price) + bookingFee + parseFloat(vat)).toFixed(2);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
                        <div className='row'>
                            <div className="col-md-6 mb-2">
                                {/* Payment Method Radio Buttons */}
                            </div>
                            <div className="col-md-6 mb-2">
                                {/* Payment Method Radio Buttons */}
                            </div>
                            <div className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Name on Card</label>
                                    <input
                                        className="form-control"
                                        id="card_name"
                                        value={nameOnCard || ''}
                                        type="text"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={handleBlur}
                                        name='nameOnCard'
                                    />
                                    {errors.nameOnCard && <div className="text-danger">{errors.nameOnCard}</div>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_number">Card Number</label>
                                    <input
                                        className="form-control"
                                        id="card_number"
                                        value={formatCardNumber(cardNumber)}
                                        placeholder="1234 5678 9876 5432"
                                        type="text"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={handleBlur}
                                        name='cardNumber'
                                    />
                                    {errors.cardNumber && <div className="text-danger">{errors.cardNumber}</div>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="expiry_month">Expiry Month</label>
                                    <input
                                        className="form-control"
                                        id="expiry_month"
                                        value={expiredMonth || ''}
                                        placeholder="MM"
                                        type="text"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={handleBlur}
                                        name='expiredMonth'
                                    />
                                    {errors.expiredMonth && <div className="text-danger">{errors.expiredMonth}</div>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="expiry_year">Expiry Year</label>
                                    <input
                                        className="form-control"
                                        id="expiry_year"
                                        value={cardExpiredYear || ''}
                                        placeholder="YY"
                                        type="text"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={handleBlur}
                                        name='cardExpiredYear'
                                    />
                                    {errors.cardExpiredYear && <div className="text-danger">{errors.cardExpiredYear}</div>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        className="form-control"
                                        id="cvv"
                                        value={cvv || ''}
                                        placeholder="CVV"
                                        type="text"
                                        onChange={(e) => handleChange(e)}
                                        onBlur={handleBlur}
                                        name='cvv'
                                    />
                                    {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
                                </div>
                            </div>
                        </div>
                       
                        <div className="terms-accept">
                            <div className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    id="terms_accept"
                                    className='me-2'
                                    checked={isCheck}
                                    onChange={handleCheck}
                                    disabled={!isFormValid}
                                />
                                <label htmlFor="terms_accept">
                                    I have read and accept <a className='text-primary' style={{ cursor: 'pointer', textDecoration: 'none' }}>Terms &amp; Conditions</a>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 col-sm-12">
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
                        {data && (
                            <Link to={`/doctors/profile/${data?._id}`} className="booking-doc-img d-flex justify-content-center mb-2">
                                <img src={doctorImg} alt="" />
                            </Link>
                        )}
                        {data && (
                            <div className='doc-title-info mt-3 mb-3'>
                                <h5 className='mt-3 text-center' style={{ fontSize: "22px", fontWeight: 700 }}>
                                    Dr. {data?.firstName + ' ' + data?.lastName}
                                </h5>
                                <div className='text-center'>
                                    <p className='form-text mb-0'>{data?.designation}</p>
                                    <p className='form-text mb-0'>{data?.clinicAddress}</p>
                                </div>
                            </div>
                        )}
                        <div className="booking-item-wrap">
                            <ul className="booking-date">
                                <li>Date <span>{moment(selectedDate).format('LL')}</span></li>
                                <li>Time <span>{selectTime}</span></li>
                            </ul>
                            <ul className="booking-fee">
                                <li>Consulting Fee <span>${parseFloat(price).toFixed(2)}</span></li>
                                <li>Booking Fee <span>$10.00</span></li>
                                <li>Vat (Including 15%) <span>${parseFloat(vat).toFixed(2)}</span></li>
                            </ul>
                            <ul className="booking-total">
                                <li className='d-flex justify-content-between'>
                                    <span className='fw-bold'>Total</span>
                                    <span className="total-cost" style={{ color: '#1977cc' }}>${total}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;