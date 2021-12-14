import axios from 'axios';

const instance = axios.create({
    baseURL: 'URL for trefikverket'
});

export default instance;