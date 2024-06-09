import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout/DashboardLayout';
import { Button } from 'antd';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useChangePasswordMutation } from '../../../redux/api/authApi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';

const ChangePassword = () => {
  const [user, setUser] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { userId } = useAuthCheck();

  const [passwordValidation, setPasswordValidation] = useState({
    carLength: false,
    specailChar: false,
    upperLowerCase: false,
    numeric: false
  });

  const [changePassword] = useChangePasswordMutation();
  const dispatch = useDispatch();

  const handleValidation = (name, value) => {
    if (name === 'newPassword') {
      setPasswordValidation({
        carLength: value.length >= 8,
        specailChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
        upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
        numeric: /^(?=.*\d)/.test(value),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleValidation(name, value);

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const isPasswordValid = () => {
    return (
      passwordValidation.carLength &&
      passwordValidation.specailChar &&
      passwordValidation.upperLowerCase &&
      passwordValidation.numeric
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      toast.error('Password does not meet the validation criteria');
      return;
    }
    if (user.newPassword !== user.confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await changePassword({ oldPassword: user.oldPassword, newPassword: user.newPassword, userId: userId }).unwrap();
        toast.success('Password changed successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer />
      <div className="w-100 mb-3 rounded p-2" style={{ background: '#f8f9fa' }}>
        <h5 className='text-title mt-3'>Change Your Password</h5>
        <Form onSubmit={submitHandler} className='container row form-row px-5 mx-auto my-5'>
          <Form.Group className='col-md-12 form-group mb-3 card-label' controlId='oldPassword'>
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Old Password'
              name='oldPassword'
              value={user.oldPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className='col-md-12 form-group mb-3 card-label' controlId='newPassword'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='New Password'
              name='newPassword'
              value={user.newPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className='col-md-12 form-group mb-3 card-label' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <div className='mt-5 text-center'>
            <Button htmlType='submit' type="primary" size='large'>Save Changes</Button>
          </div>

          <div className="password-validity mx-auto">
            <div style={passwordValidation.carLength ? { color: "green" } : { color: "red" }}>
              <p>{passwordValidation.carLength ? <FaCheck /> : <FaTimes />}
                <span className="ms-2">Password must have at least 8 characters.</span>
              </p>
            </div>
            <div style={passwordValidation.specailChar ? { color: "green" } : { color: "red" }}>
              <p>{passwordValidation.specailChar ? <FaCheck /> : <FaTimes />}
                <span className="ms-2">Password must have a special character.</span>
              </p>
            </div>
            <div style={passwordValidation.upperLowerCase ? { color: "green" } : { color: "red" }}>
              <p>{passwordValidation.upperLowerCase ? <FaCheck /> : <FaTimes />}
                <span className="ms-2">Password must have uppercase and lowercase letters.</span>
              </p>
            </div>
            <div style={passwordValidation.numeric ? { color: "green" } : { color: "red" }}>
              <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                <span className="ms-2">Password must have a number.</span>
              </p>
            </div>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}

export default ChangePassword;
