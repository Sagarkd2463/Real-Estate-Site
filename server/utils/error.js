const errorHandler = (statusCode, name, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.name = name;
    error.message = message;
    return error;
};

module.exports = errorHandler;