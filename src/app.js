const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');

const machinesRoute = require('./routes/machines.js');

const apiErrorHandler = require('./error/api-error-handler');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/machines', machinesRoute);
app.use(apiErrorHandler);

mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Connection failed!");
        console.log(error);
    });
