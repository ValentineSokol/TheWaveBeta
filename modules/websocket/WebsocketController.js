const UserModel = require('../user/UserModel');
const connections = {};
const userStatusSubscriptions = {};
const sendMessage = (userIds, message) => {
    userIds.forEach((userId) => {
        const userConnections = connections[userId];
        if (!userConnections || !userConnections.length) return { success: false };
        userConnections.filter(ws => ws.readyState  === 1)
            .forEach(ws => ws.send(JSON.stringify(message)));
    });
    return { success: true };
};
const notifyUserOnlineChange = async (userId, isOnline) => {
    const statusSubscribers = userStatusSubscriptions[userId];
    if (!statusSubscribers) return;
    const payload = { id: userId, online: isOnline };
    if (!isOnline)  {
        payload.lastSeen = Date.now();
        await UserModel.updateUser(userId, { lastSeen: payload.lastSeen });
    }
    const message = { type: `user-status`, payload  };
    sendMessage(statusSubscribers, message);
};
const watchUserOnlineStatus = (userId, targetUserId) => {
  const subscribers = userStatusSubscriptions[targetUserId];
  if (!subscribers) {
      userStatusSubscriptions[targetUserId] = [userId];
  }  else subscribers.push(userId);
  if (connections[targetUserId]?.length) notifyUserOnlineChange(targetUserId, true);
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
const disconnect = async (userId, ws) => {
  const userConnections = connections[userId];
  connections[userId] = userConnections?.filter(c => c !== ws);
  if (!connections[userId]?.length) notifyUserOnlineChange(userId, false);
};

module.exports = {
    connect,
    disconnect,
    sendMessage,
    watchUserOnlineStatus
};