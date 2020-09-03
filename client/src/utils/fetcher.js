export default async (url, method, payload) => {
        const fetcherOptions = {};
        if (method) fetcherOptions.method =  method;
        if (payload) {
            fetcherOptions.body = JSON.stringify(payload);
            fetcherOptions.headers = { 'Content-Type': 'application/json' }
        } 
        const res = await fetch(url, fetcherOptions);
        return res.json();
    }