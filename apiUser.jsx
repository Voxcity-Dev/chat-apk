import axios from 'axios';

const apiUser = axios.create({
    baseURL: "https://b27b-128-201-2-116.ngrok-free.app",
    headers: {
        'Acess-Control-Allow-Origin': '*',
    }
});

axios.defaults.withCredentials = true;

export default apiUser;