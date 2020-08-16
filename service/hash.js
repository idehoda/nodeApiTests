const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        return { hashedPass, salt };
    } catch (error) {
        console.log('error in hashPass', error);
    }
}

module.exports = {
    hashPassword
}