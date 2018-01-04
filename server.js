const express = require('express');
const path = require('path');

const server = express();
server.use(express.static(path.resolve(__dirname, 'dist')));

server.get('/engangsstonad/?*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

server.get('/isAlive', (req, res) => res.sendStatus(200));
server.get('/isReady', (req, res) => res.sendStatus(200));

server.listen(8080, () => {
    console.log('App listening on port 8080');
});
