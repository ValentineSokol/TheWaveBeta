import {actions} from '../WebSocketSlice/index';
import exponentialBackoff from "../../utils/exponentialBackoff";

export default ({ url, connectionCondition }) => {
  let ws;
  const messageQueue = [];

  return ({dispatch, getState}) => next => action => {
      const connect = () => new Promise((resolve, reject) => {
          ws = new WebSocket(url);
          const sendMessage = () => ws.send(JSON.stringify(action.payload));

          ws.onopen = () => {
              dispatch(actions.statusChange(true));
              for (const unsentMessage of messageQueue) {
                  sendMessage(unsentMessage);
                  messageQueue.unshift();
              }
          }
          ws.onclose = (e) => {
              dispatch(actions.statusChange(false));
              if (e.wasClean) return;
              reject(e);
          }
          ws.onmessage = (e) => {
              const message = JSON.parse(e.data);
              dispatch(actions.messageReceived(message));
          }
      });
      if (!connectionCondition || connectionCondition(action, getState())) {
          exponentialBackoff(connect, { maxRetries: 100, jitter: true })
      }
      if (action.type === actions.messageSent.toString()) {
          if (ws?.readyState !== 1) messageQueue.push(action.payload);
      }

      return next(action);

  }
}