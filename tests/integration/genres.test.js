const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/User');
let server;

describe('/api/genres', () => {
    beforeEach(() =>  server = require('../../index'));
    afterEach(async () =>  {
        await Genre.deleteMany({ "creator" : "test" });
        await server.close()
    }); 
    describe('GET /', () => {
        it('return all genres', async () => {
            await Genre.collection.insertMany([
                { creator: "test", name: 'genre 2'}, 
                { creator: "test",  name: 'genre 3'},
            ])
            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200)
            expect(response.body.some(genre => genre.name === 'genre 2')).toBeTruthy();
        })
        it('return genre by id', async () => {
            const genre = new Genre({ name: 'testGenreById', creator : "test" });
            await genre.save();
            const response = await request(server).get(`/api/genres/${genre._id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', genre.name);
        })
        it('return return 404 if invalid id is passed', async () => {
            const response = await request(server).get(`/api/genres/1`);
            expect(response.status).toBe(404);
        })
        it('return return 404 if invalid id is passed', async () => {
            const response = await request(server).get(`/api/genres/5f31acfece79480cc909d85d`);
            expect(response.status).toBe(404);
        })
    })
    describe('POST /', () => {
        const execute = async (withToken, name) => {
            let token = '';
            if (withToken) {
                token = new User().generateJWT();
            }
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name, creator: 'test' })
        }
        it('should return 401 if client is not logged in', async () => {
            const name = 'testing genre';
            const res = await execute(false, name);
            expect(res.status).toBe(401)
        })
        it('should return 400 if genre is less than 5 characters is', async () => {
            const name = '1234';
            const res = await execute(true, name);
            expect(res.status).toBe(400)
        })
        it('should return 400 if genre is more than 50 characters', async () => {
            const name = 'test'.repeat(13);
            const res = await execute(true, name);
            expect(res.status).toBe(400)
        })
        it('should save genre if input is valid ', async () => {
            const name = 'testing genre';
            await execute(true, name);
            const saved = await Genre.find({ name, creator: 'test'})
            expect(saved).not.toBeNull();
        })
        it('should return genre if input is valid ', async () => {
            const name = 'testing genre';
            const res = await execute(true, name);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'testing genre');
        })
    })
})