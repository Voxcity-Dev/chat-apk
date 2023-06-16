import axios from 'axios';

const apiUser = axios.create({
    baseURL: "https://ff9d-128-201-2-159.ngrok-free.app",
    headers: {
        'Acess-Control-Allow-Origin': '*',
    }
});

axios.defaults.withCredentials = true;

export default apiUser;