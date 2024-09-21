require('dotenv').config();
require('./database/db');

const express = require('express');
const userRouter = require('./routes/userRoute');

const app = express();

app.use('/api/user', userRouter);

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});

