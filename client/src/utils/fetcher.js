import objectToFormData from './objectToFormData';
export default async (url, { method, payload, isFormData, withResHeaders } = {}) => {
        const fetcherOptions = {};
        if (method) fetcherOptions.method =  method;
        if (payload) {
            fetcherOptions.body = isFormData? objectToFormData(payload) : JSON.stringify(payload);
           if (!isFormData) fetcherOptions.headers = { 'Content-Type': 'application/json' };
        } 
        const res = await fetch(url, fetcherOptions);
        const { ok } = res;
        const parsePayload = res.headers.get('content-type')?.includes('application/json') ? 'json' : 'blob';
        const responsePayload = await res[parsePayload]();
        responsePayload.ok = ok;
        return withResHeaders ? { ok, payload: responsePayload, headers: res.headers } : responsePayload;

    }