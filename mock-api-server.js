const express = require('express');
const server = express();
require('dotenv').config();

const allowCrossDomain = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-XSRF-TOKEN,Location');
    res.setHeader('Access-Control-Expose-Headers', 'Location');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
};

const delayAllResponses = function(millsec) {
    return function(req, res, next) {
        setTimeout(next, millsec);
    };
};

server.use(allowCrossDomain);
server.use(delayAllResponses(500));
server.use(express.json());

const mockResponse = {
    fnr: '11111111111',
    fornavn: 'Henrikke',
    etternavn: 'Ibsen',
    kjønn: 'K',
    fødselsdato: '1979-01-28',
    ikkeNordiskEøsLand: true
};

const kvittering = {
    motattDato: '2019-02-19T13:40:45.115',
    referanseId: '3959c880-83d2-4f01-b107-035fa7693758',
    leveranseStatus: 'PÅ_VENT',
    journalId: '439772941',
    saksNr: '137662428'
};

const startServer = html => {
    server.get(
        ['/', '/rest/personinfo?'],
        (req, res) => {
            res.send(mockResponse);
        }
    );

    server.get(
        '/rest/storage', (req, res) => {
            res.sendStatus(200);
        }
    )

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.post('/rest/soknad', (req, res) => {
        res.send(kvittering);
    });

    const port = process.env.PORT || 8888;
    server.listen(port, () => {
        console.log(`Mock-api listening on port: ${port}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

startServer();
