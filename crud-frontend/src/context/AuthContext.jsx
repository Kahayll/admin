
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // On component mount, check for a token in localStorage
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token && email) {
            
            setIsAuthenticated(true);
            setUserEmail(email);
        }
        setLoading(false); 
    }, []);

    const login = (token, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email); 
        setIsAuthenticated(true);
        setUserEmail(email);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
        setUserEmail(null);
        
        delete axios.defaults.headers.common['Authorization'];
    };

    
    const register = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/admin/register', { email, password });
            console.log('Registration successful:', res.data);
            return res.data; 
        } catch (err) {
            console.error('Registration error:', err.response?.data?.msg || 'Registration failed.');
            throw err; 
        }
    };


    if (loading) {
        
        return <div>Loading authentication...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};