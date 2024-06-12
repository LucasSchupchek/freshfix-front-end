import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3000/api/', -- para rodar local, descomente essa linha e comente a linha abaixo.
    // baseURL: 'https://apichamados.onrender.com/api/',
    baseURL: process.env.VITE_HOST_API || import.meta.env.VITE_HOST_API,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;