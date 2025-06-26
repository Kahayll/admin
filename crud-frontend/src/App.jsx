
import './App.css';
import ModalForm from './components/Modalform';
import Navbar from './components/navbar';
import Tablelist from './components/Tablelist';
import { useState } from 'react';
import axios from 'axios';
import Login from './pages/Login'; 

// Import routing components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import AuthContext components
import { AuthProvider, useAuth } from './context/AuthContext';


// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleOpen = (mode, user = null) => {
    setIsOpen(true);
    setModalMode(mode);
    setSelectedUser(user);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        const response = await axios.post('http://localhost:3000/api/users', formData);
        console.log('User Added:', response.data);
      } else { // modalMode === 'edit'
        if (!formData.id) {
          console.error("Error: User ID is missing for update operation.");
          return;
        }
        const response = await axios.put(`http://localhost:3000/api/users/${formData.id}`, formData);
        console.log('User Updated:', response.data);
      }
      setIsOpen(false);
      setSelectedUser(null);
      setRefreshTable(prev => prev + 1);
    } catch (err) {
      console.error(`Error ${modalMode === 'add' ? 'Adding' : 'Updating'} User:`, err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/users/${id}`);
        console.log('User Deleted:', response.data);
        setRefreshTable(prev => prev + 1);
      } catch (err) {
        console.error('Error Deleting User:', err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
          console.error("Error response headers:", err.response.headers);
        } else if (err.request) {
          console.error("Error request:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
      }
    }
  };

  return (
    // AuthProvider wraps the entire application to provide authentication context
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route for Login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected route for the main application features */}
          {/* Use the PrivateRoute component to protect the dashboard/main content */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                {/* Render your main application components here */}
                <>
                  <Navbar onOpen={() => handleOpen('add')} onSearch={setSearchTerm} />
                  <Tablelist
                    handleOpen={handleOpen}
                    searchTerm={searchTerm}
                    refreshTrigger={refreshTable}
                    handleDelete={handleDelete}
                  />
                  <ModalForm
                    isOpen={isOpen}
                    mode={modalMode}
                    onSubmit={handleSubmit}
                    onClose={() => {
                      setIsOpen(false);
                      setSelectedUser(null);
                    }}
                    user={selectedUser}
                  />
                </>
              </PrivateRoute>
            }
          />
          {/* Optional: Add a catch-all route for 404 or redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;