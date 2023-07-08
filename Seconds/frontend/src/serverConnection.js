import axios from 'axios';
import {backendUrl} from './utils/consts.js';

export const login = async (username, password) => {   
    const response = await axios.post(`${backendUrl}/users/login`, {username, password});
    return response.data;
}


export const register = async (username, password) => {
    const response = await axios.post(`${backendUrl}/users/register`, {username, password});
    return response.data;
}