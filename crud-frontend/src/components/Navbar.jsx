import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

export default function Navbar( {onOpen, onSearch}) {
    const navigate = useNavigate(); 
    const { logout } = useAuth();  

    const handleSearchChange = (event) => {
        onSearch(event.target.value);
    };

    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    return(
        <>
            <div className="navbar bg-base-100 p-4">
                <div className="navbar-start">
                    {/* Add onClick handler to the logout button */}
                    <a className="btn btn-ghost text-xl" onClick={handleLogout}>Log out</a>
                </div>
                <div className="navbar-center">
                    <div className="form-control">
                        <input type="text" placeholder="Search" onChange={handleSearchChange} className="input input-bordered w-48 md:w-auto" />
                    </div>
                </div>
                <div className="navbar-end">
                    <a className="btn btn-primary" onClick={onOpen}>Add User</a>
                </div>
            </div>
        </>
    );
}