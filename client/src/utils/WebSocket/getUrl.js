export default () => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost'? 'localhost:5000' : window.location.hostname;
    return `${protocol}://${host}/realtime/connect`;
}
