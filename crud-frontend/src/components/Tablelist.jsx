import axios from 'axios';
import { useState, useEffect } from 'react';

// Accepted handleDelete as a prop
export default function Tablelist({ handleOpen, searchTerm, refreshTrigger, handleDelete }) {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/api/users');
            setTableData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]); // Ensure Tablelist re-fetches when refreshTrigger changes

    const filteredData = tableData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        return a.id - b.id; // Sort by ID in ascending order
    });

    if (loading) {
        return <div className="text-center mt-10 text-lg font-medium">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-lg font-medium text-red-500">Error: {error}. Please try again later.</div>;
    }

    return (
        <>
            <div className="overflow-x-auto mt-10">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th></th> {/* Empty header for delete button if needed, or merge with 'Actions' */}
                        </tr>
                    </thead>
                    <tbody className="hover">
                        {sortedData.length > 0 ? (
                            sortedData.map((user) => (
                                <tr key={user.id}>
                                    <th>{user.id}</th>
                                    <td>{user.name}</td>
                                    <td>{user.position}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>
                                        <button className={`btn rounded-full w-20 ${user.isactive ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                                            {user.isactive ? `Active` : `Inactive`}
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpen('edit', user)} className="btn btn-accent">Update</button>
                                    </td>
                                    <td>
                                        {/* NEW: Call handleDelete with the user.id */}
                                        <button onClick={() => handleDelete(user.id)} className="btn btn-error">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}