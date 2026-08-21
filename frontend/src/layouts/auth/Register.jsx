import React, { useState } from 'react';
import './register.css';

import register from '../../assets/register/register.png';
import name from '../../assets/register/name.png';
import email from '../../assets/register/email.png';
import password from '../../assets/register/password.png';
import cpassword from '../../assets/register/cpassword.png';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast, Spinner } from '@chakra-ui/react';

function Register() {
    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        // Frontend password validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                position: 'top',
                duration: 4000,
                isClosable: true,
            });

            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/register',
                formData
            );

            console.log('Register response:', response.data);

            const message =
                response?.data?.message ||
                'Registration successful';

            toast({
                title: message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

            // Clear form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

            // Go to login after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (error) {
            console.error('Register error:', error);

            let errorMessage = 'Registration failed';

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast({
                title: errorMessage,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-main-container">

            <div className="register-container">

                {/* LEFT SIDE */}
                <div className="register-left-container">
                    <img
                        className="register-img"
                        src={register}
                        alt="Register"
                    />
                </div>

                {/* RIGHT SIDE */}
                <div className="register-right-container">

                    <p className="signup-text">
                        Sign Up
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* FIRST NAME */}
                        <div className="input-main-container">
                            <img
                                className="input-icon"
                                src={name}
                                alt="First name"
                            />

                            <input
                                placeholder="First Name *"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="input-main-container">
                            <img
                                className="input-icon"
                                src={name}
                                alt="Last name"
                            />

                            <input
                                placeholder="Last Name *"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="input-main-container">
                            <img
                                className="input-icon"
                                src={email}
                                alt="Email"
                            />

                            <input
                                placeholder="Email *"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="input-main-container">
                            <img
                                className="input-icon"
                                src={password}
                                alt="Password"
                            />

                            <input
                                placeholder="Password *"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="input-main-container">
                            <img
                                className="input-icon"
                                src={cpassword}
                                alt="Confirm password"
                            />

                            <input
                                placeholder="Confirm Password *"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        {/* REGISTER BUTTON */}
                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner
                                    color="white"
                                    size="sm"
                                />
                            ) : (
                                'Register'
                            )}
                        </button>

                    </form>

                    <p className="account-text">
                        Already have an account?{' '}
                        <Link to="/">
                            <span>Sign In</span>
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Register;