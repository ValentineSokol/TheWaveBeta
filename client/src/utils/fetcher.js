import objectToFormData from './objectToFormData';
export default async (url, method, payload, { isFormData } = {}) => {
        const fetcherOptions = {};
        if (method) fetcherOptions.method =  method;
        if (payload) {
            fetcherOptions.body = isFormData? objectToFormData(payload) : JSON.stringify(payload);
           if (!isFormData) fetcherOptions.headers = { 'Content-Type': 'application/json' };
        } 
        const res = await fetch(url, fetcherOptions);
        return res.json();
    }