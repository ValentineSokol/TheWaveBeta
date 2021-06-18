export default {
  subscribers: [],
  ws: null,
  pingInterval: null,
  connect: function () {
      this.ws = new WebSocket('ws://localhost:4000/chat/user/connect');
      this.ws.onerror = (err) => {
          this.ws = null;
          console.error(`WS Error ${err.message}`);
      }
      this.ws.onmessage = (e) => {
          const message = JSON.parse(e.data);
          console.info({ message })
          console.info(`Message of type ${message.type} recieved!`);
          const callbacksToCall = this.subscribers.filter(sub => sub.messageType === message.type );
          console.info({ callbacksToCall });
          callbacksToCall.forEach(({ cb }) => cb(message.payload));
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
  },
  watchUserStatus: function (id) {
      const { ws } = this;
      if (ws.readyState !== 1) return;
      const message = {
          type: 'watch-user-status',
          payload: id
      };
      ws.send(JSON.stringify(message));
  },
  subscribe: function (messageType, cb) {
      this.subscribers.push({ messageType, cb });
  }
};