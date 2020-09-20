const bcrypt = require('bcryptjs');
module.exports = {
    hashPassword: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
    },
    verifyPassword: function(string, hash) {
        return bcrypt.compareSync(string, hash);
    }
}