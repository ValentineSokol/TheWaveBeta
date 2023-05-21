const Yup = require("yup");

const username = Yup.string().required().min(4).max(20);
const registerSchema = Yup.object({
    username,
    password: Yup.string().required().min(8)
});

const checkUsername = Yup.object({ username });

module.exports = { checkUsername, registerSchema };
