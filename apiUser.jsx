import axios from 'axios';

const apiUser = axios.create({
    baseURL: "https://9b18-128-201-2-159.ngrok-free.app",
    headers: {
        'Acess-Control-Allow-Origin': '*',
    }
});

axios.defaults.withCredentials = true;

export default apiUser;