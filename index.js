const uuid = require("uuid").v4;
const express = require("express");

const app = express();

const openRequests = {};
const leaderboard = [];

app.get('/call/:username', (req, res) => {
    const id = uuid();
    const { username } = req.params;
    openRequests[id] = { time: process.hrtime(), username };
    res.send(id);
});

app.get(`/leaderboard`, (req, res) => {
    const sortedLeaderboard = leaderboard.sort((a, b) => {
        if(a.time[0] === b.time[0]) {
            return a.time[1] - b.time[1];
        } else {
            return a.time[0] - b.time[0];
        }
    })
    res.send(`
        <ol>
            ${sortedLeaderboard.map((item) => {
                return `<li>${item.username}: ${item.time[0]}.${item.time[1]}`;
            }).join("\n")}
        </ol>
    `);
});

app.get(`/:id`, (req, res) => {
    const id = req.params.id;
    const initTime = openRequests[id].time;
    const username = openRequests[id].username;
    const diffTime = process.hrtime(initTime);
    leaderboard.push({
        username,
        time: diffTime
    });
    res.send({ time: diffTime, username });
});

app.listen(8000);