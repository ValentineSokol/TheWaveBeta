export default () => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost'? 'localhost:4000' : window.location.hostname;
    return `${protocol}://${host}/chat/user/connect`;
}
