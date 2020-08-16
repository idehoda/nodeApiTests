const { User } = require('../../models/user');
const { isAuthenticated } = require('../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user object with payload of valid JWT', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            name: 'testing user',
            email: 'testinguser@test.com'
        };
        const token = new User(user).generateJWT();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        isAuthenticated(req, res, next);
        expect(req.user).toMatchObject(user);
        expect(req.user).toHaveProperty('email', 'testinguser@test.com');
        expect(next).toHaveBeenCalled();
    })
})