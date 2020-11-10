exports.logger = (req, res, next) => {
    console.log("Logger Ran");
    next();
}