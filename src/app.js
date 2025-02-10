const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv/config');

const machinesRoute = require('./routes/machines.js');
const usersRoute = require('./routes/users.js');
const repairTypesRoute = require('./routes/repair-types.js');

const apiErrorHandler = require('./error/api-error-handler');

const app = express();
const PORT = process.env.PORT;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Automation of Machine Maintenance API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

  
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/api/machines', machinesRoute);
app.use('/api/users', usersRoute);
app.use('/api/repair-types', repairTypesRoute);
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
