const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;

describe('auth middleware', () => {
    beforeEach(() =>  server = require('../../index'));
    afterEach(async () =>  {
        await Genre.deleteMany({ "creator" : "test" });
        await server.close();
    }); 
    const execute = (withToken, name, invalidToken) => {
        let token = '';
        if (withToken) {
            token = new User().generateJWT();
        }
        if (invalidToken) {
            token = invalidToken;
        }
        return request(server)
            .post('/api/genres')
            .send({ name })
            .set('x-auth-token', token)
    }
    it('should return 401 if no token provided', async () => {
        const name = 'testing genre';
        const res = await execute(false, name);
        expect(res.status).toBe(401);
    })
    it('should return 400 if provided token is invalid', async () => {
        const name = 'testing genre';
        const invalidToken = 'sldojfsdpofldsf';
        const res = await execute(false, name, invalidToken);
        expect(res.status).toBe(400);
    })
    it('should return 200 if token is valid', async () => {
        const name = 'testing genre';
        const res = await execute(true, name);
        expect(res.status).toBe(200);
    })
})