const uuid = require("uuid").v4;
const express = require("express");

const app = express();

const openRequests = {};

app.get('/call/:username', (req, res) => {
    const id = uuid();
    const { username } = req.params;
    openRequests[id] = { time: process.hrtime(), username };
    res.send(id);
});

app.get(`/:id`, (req, res) => {
    const id = req.params.id;
    const initTime = openRequests[id].time;
    const username = openRequests[id].username;
    const diffTime = process.hrtime(initTime);
    res.send({ time: diffTime, username });
});


app.listen(8000);