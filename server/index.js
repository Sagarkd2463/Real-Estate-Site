require('dotenv').config();
require('./database/db');

const express = require('express');
const cookieParser = require('cookie-parser');

//Routes
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/userAuthRoute');
const listingRoute = require('./routes/listingRoute');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const name = err.name || 'Internal Server Error';
    const message = err.message || '';

    return res.status(statusCode).json({
        success: false,
        statusCode,
        name,
        message,
    });
});

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});

