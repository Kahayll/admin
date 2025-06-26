// frontend/src/api/axios.js
import axios from 'axios';

// Create an Axios instance with a base URL
export default axios.create({
    baseURL: 'http://localhost:3000/api' // This should match your backend API base URL
});