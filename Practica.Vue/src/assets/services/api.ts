import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VUE_URL_API,
});

