import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001', // backend's base URL
});

export default api;
