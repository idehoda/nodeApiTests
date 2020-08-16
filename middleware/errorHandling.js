function mainErrorHandling(err, req, res, next) {
    console.warn(err.message, err)
    res.status(500).send('oopst something went wrong')
}
function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = {
    mainErrorHandling,
    asyncMiddleware
};