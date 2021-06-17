export default {
  ws: null,
  pingInterval: null,
  connect: function () {
      this.ws = new WebSocket('ws://localhost:4000/chat/user/connect');
      this.ws.onerror = (err) => {
          this.ws = null;
          console.error(`WS Error ${err.message}`);
      }
      this.ws.onmessage = (json) => {
          const message = JSON.parse(json);
          console.info(`Message of type ${message.type} recieved!`);
      }
      this.ws.onopen = (e) => {
          console.info('WebSocket opened.');
          this.pingInterval = setInterval(() => {
             // this.ws.send(JSON.stringify({ type: 'ping' }))
          }, 1000);
      }
      this.ws.onclose = (e) => {
          if (this.pingInterval) clearInterval(this.pingInterval);
          this.pingInterval = null;
          console.info(`WebSocket closed ${e.code}.`);
      }
  }
};