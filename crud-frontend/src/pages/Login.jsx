
import React, { useState } from 'react';
import './login.css';
import user_icon from '../assets/person.png';
import password_icon from '../assets/password.png'; 

import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            
            const res = await axios.post('http://localhost:3000/api/admin/login', { email, password });
            console.log('Login successful:', res.data);

            login(res.data.token, res.data.email); 
            navigate('/'); 

        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
               
                setError(err.response.data.msg || 'Login failed. Please check your credentials.');
            } else if (err.request) {
                
                setError('No response from server. Please try again later.');
            } else {
                
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-text">Login</div>
                    <div className="login-underline"></div>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <p className="login-error-message">{error}</p>}

                    {/* Email Input Field */}
                    <div className="input-field-wrapper">
                        <img src={user_icon} alt="Email Icon"/>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* <--- NEW: Password Input Field */}
                    <div className="input-field-wrapper">
                        <img src={password_icon} alt="Password Icon"/>
                        <input
                            type="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;