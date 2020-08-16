const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_KEY;

async function isAdmin(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(403).send('nope, you can not');
    }
    next();
}
async function isAuthenticated(req, res, next) {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).send('unauthorised');
        }
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('error in isAuthenticated catch', error)
        return res.status(400).send('token (((')
    }
}
module.exports = {
    isAuthenticated,
    isAdmin
};