import {actions} from '../WebSocketSlice/index';
import exponentialBackoff from "../../utils/exponentialBackoff";

export default ({ url, connectionCondition }) => {
  let ws;

  return ({dispatch, getState}) => next => action => {
      const connect = () => new Promise((resolve, reject) => {
          ws = new WebSocket(url);

          ws.onopen = () => {
              dispatch(actions.statusChange(true));
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
          exponentialBackoff(connect, { jitter: true })
      }
      if (action.type === actions.messageSent.toString() && ws.readyState === 1) {
          ws.send(JSON.stringify(action.payload));
      }

      return next(action);

  }
}