import React from 'react';

const DiscordWidget = ({ username }) => {
    let url = 'https://discord.com/widget?id=534661189850890240&theme=dark';
    if (username) url += `&username=${username}`;
  return (
    <iframe
        title='DiscordWidgetIFrame'
        src={url}
        width="350"
        height="500"
        allowTransparency="true"
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    />
  );
};
export default  DiscordWidget;