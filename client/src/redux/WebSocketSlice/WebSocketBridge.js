import {actions} from '../WebSocketSlice/index';

const getActionTypeString = (actionType) => {
    return typeof actionType === 'function'? actionType.toString() : actionType;
};

export default ({ url, openOnActionType, reconnectCooldown = 3000 }) => {
  let ws;
  let reconnectTimeout;

  return ({dispatch}) => next => action => {
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
      };

      if (!openOnActionType) {
          connect();
      }

      if (openOnActionType && action.type === getActionTypeString(openOnActionType)) {
          connect();
      }

      return next(action);

  }
}