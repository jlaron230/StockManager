const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Définition des options Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Projet Stock manager + Node.js",
            version: "1.0.0",
            description: "Documentation de l'API avec Swagger",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                SessionCookieAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "Cookie",
                    description: "connect.sid=s%3Aabc1234567890XYZ.abcdefghiJklmnopQRStuvwxYz",
                },
            },
        },
        security: [
            {
                SessionCookieAuth: [],
            },
        ],
    },
    apis: ["./src/**/*.js"],
};

// Générer la documentation Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };