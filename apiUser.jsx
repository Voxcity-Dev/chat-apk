import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

console.log(REACT_APP_BASE_URL)

const apiUser = axios.create({
    baseURL: REACT_APP_BASE_URL,
    headers: {
        'Acess-Control-Allow-Origin': '*',
    }
});

axios.defaults.withCredentials = true;

export default apiUser;