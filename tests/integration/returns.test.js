const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');
const request = require('supertest');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    
    beforeEach( async () => {
        server = require('../../index');
    
        customerId = mongoose.Types.ObjectId(); 
        movieId = mongoose.Types.ObjectId(); 

        movie = new Movie({
            _id: movieId,
            title: 'test title',
            dailyRentalRate: 2,
            genre: { name: '12334'},
            numberInStock: 10
        })
        await movie.save();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'test user',
                phone: 'test user'
            },
            movie: {
                _id: movieId,
                title: 'test title',
                dailyRentalRate: 2
            }
        })
        await rental.save();
    } )
    afterEach(async () =>  {
        await Rental.remove({ "movie.title" : "test title" });
        await Movie.remove({ "title" : "test title" });
        await server.close()
    }); 

    const execute = (params, auth) => {
        let token = '';
        if (auth) {
            token = new User().generateJWT();
        }
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({...params})
    }

    it('should return 401 if client is not logged in', async () => {
        const res = await execute({
            customerId,
            movieId
        });
        expect(res.status).toBe(401);
    })
    it('should return 400 if customerId is not provided', async () => {
        const res = await execute({ movieId }, true)
        expect(res.status).toBe(400);
    })
    it('should return 400 if movieId is not provided', async () => {
        const res = await execute({  customerId }, true)
        expect(res.status).toBe(400);
    })
    it('should return 404 if rental is not found', async () => {
        const customerId = mongoose.Types.ObjectId(); 
        const movieId = mongoose.Types.ObjectId(); 
        const res = await execute({  customerId, movieId }, true)
        expect(res.status).toBe(404);
    })
    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = Date.now();
        await rental.save();
        const res = await execute({  customerId, movieId }, true)
        expect(res.status).toBe(400);
    })
    it('should set returnDate if input is valid', async () => {
        await execute({ customerId, movieId }, true)
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    })
    it('should calculate rental fee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save(); 
        const rentalInDb = await execute({ customerId, movieId }, true)
        expect(rentalInDb.body.rentalFee).toBe(14);
    })
    it('should increase movie stock', async () => {
        await execute({ customerId, movieId }, true);
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })
    it('should return 200 if rental has been successfully processed', async () => {
        const res = await execute({ customerId, movieId }, true);
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining(
                ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
            )
        )
    })
})