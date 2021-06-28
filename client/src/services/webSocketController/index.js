export default {
  subscribers: [],
  ws: null,
  pingInterval: null,
  getWsURL: function () {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const host = window.location.hostname === 'localhost'? 'localhost:4000' : window.location.hostname;
      return `${protocol}://${host}/chat/user/connect`;
  },
  connect: function () {
      this.ws = new WebSocket(this.getWsURL());
      this.ws.onerror = (err) => {
          this.ws = null;
          console.error(`WS Error ${err.message}`);
      }
      this.ws.onmessage = (e) => {
          const message = JSON.parse(e.data);
          if (!message?.type) return;
          console.info(`Message of type ${message.type} recieved!`);
          const callbacksToCall = this.subscribers.filter(sub => sub?.messageType === message.type);
          console.info(callbacksToCall);
          callbacksToCall.forEach(({ cb }) => cb(message.payload));
      }
      this.ws.onopen = (e) => {
          console.info('WebSocket opened.');
          const callbacksToCall = this.subscribers.filter(s => s.eventType === 'open');
          callbacksToCall.forEach(({cb}) => cb());
          this.pingInterval = setInterval(() => {
              //this.ws.send(JSON.stringify({ type: 'ping' }))
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
  sendTypingMessage: function (isTyping, username,isDirect, chatId) {
      if (this.ws.readyState !== 1) return;
      const message = {
          type: isTyping? 'is-typing' : 'stopped-typing',
          payload: {
              username,
              isDirect,
              chatId
          }
      };
      this.ws.send(JSON.stringify(message));
  },
  subscribe: function (eventType, cb, messageType = null) {
      const subscription = { eventType, cb };
      if (eventType === 'message' && messageType) {
          subscription.messageType = messageType;
      }
      this.subscribers.push(subscription);
  },
  isWsOpen: function () { return this.ws?.readyState === 1}
};