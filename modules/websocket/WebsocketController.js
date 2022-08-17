const connections = {};
const userStatusSubscriptions = {};

const watchUserOnlineStatus = (userId, targetUserId) => {
  const subscribers = userStatusSubscriptions[targetUserId];
  if (!subscribers) {
      userStatusSubscriptions[targetUserId] = [userId];
  }  else subscribers.push(userId);
};
const notifyUserOnlineChange = (userId, isOnline) => {
    const statusSubscribers = userStatusSubscriptions[userId];
    if (!statusSubscribers) return;
    const payload = { online: isOnline };
    if (!isOnline) payload.lastSeen = Date.now();
    const message = { type: `user-status-${userId}`, payload  };
    sendMessage(statusSubscribers, message);
};
const connect = (userId, ws) => {
    const isFirstConnect = connections[userId]?.length;
    if (!connections[userId]) {
        connections[userId] = [ws];
    } else {
        connections[userId].push(ws);
    }
    if (isFirstConnect) notifyUserOnlineChange(userId, true);

    console.info(`User ${userId} has connected!`);
};
const disconnect = (userId, ws) => {
  const userConnections = connections[userId];
  connections[userId] = userConnections.filter(c => c !== ws);
  if (!connections[userId].length) notifyUserOnlineChange(userId, false);
};

const sendMessage = (userIds, message) => {
    userIds.forEach((userId) => {
        const userConnections = connections[userId];
        if (!userConnections || !userConnections.length) return { success: false };
        userConnections.filter(ws => ws.readyState  === 1)
            .forEach(ws => ws.send(JSON.stringify(message)));
    });
    return { success: true };
};

module.exports = {
    connect,
    disconnect,
    sendMessage,
    watchUserOnlineStatus
};