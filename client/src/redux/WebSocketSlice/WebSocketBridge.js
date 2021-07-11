import {actions} from '../WebSocketSlice/index';

export default ({ url, connectionCondition, reconnectCooldown = 3000 }) => {
  let ws;
  let reconnectTimeout;

  return ({dispatch, getState}) => next => action => {
      const connect = () => {
         ws = new WebSocket(url);

          ws.onopen = () => {
              dispatch(actions.statusChange(true));

              if (reconnectTimeout) {
                  clearInterval(reconnectTimeout);
                  reconnectTimeout = null;
              }
          }
          ws.onclose = (e) => {
              dispatch(actions.statusChange(false));
              reconnectTimeout = setTimeout(connect, reconnectCooldown);
          }
          ws.onmessage = (e) => {
              const message = JSON.parse(e.data);
              dispatch(actions.messageReceived(message));
          }
      };
      if (!connectionCondition) connect();

      else if (connectionCondition(action, getState())) {
          connect();
      }
      if (action.type === actions.messageSent.toString() && ws.readyState === 1) {
          ws.send(JSON.stringify(action.payload));
      }

      return next(action);

  }
}