import React from 'react';

import './ContextMenu.scss';

const MessageContextMenu = ({ actions, show, top, left }) => {
    if (!show) return null;
    return (
      <div onContextMenu={(e) => e.preventDefault()} style={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`
      }} className='ContextMenu'>
          <ul>
              {
                  actions.map(
                      (action, i) => (
                          <li key={i} onClick={action.handler}>{action.label}</li>
                      ))
              }
          </ul>

      </div>
    );
}

export default MessageContextMenu;