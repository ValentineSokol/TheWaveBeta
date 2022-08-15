const passwordRecovery = (username, code) => ({
    subject: 'TheWave Password Recovery',
    template:  `<h3>Dear, ${username}!</h3>
    <p>You are seeing this email because someone requested a password recovery.</p>
    <p><b style="color: red;">If you did not request it, just ignore this email!</b></p>
    <p><b style="color: green;">Your recovery code is: ${code}</b></p>`
});


module.exports = {
    passwordRecovery
};