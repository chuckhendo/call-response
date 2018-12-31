const {promisify} = require("util");
const fs = require("fs");
const uuid = require("uuid").v4;
const express = require("express");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const app = express();

const openRequests = {};

app.get('/call/:username', (req, res) => {
    const id = uuid();
    const { username } = req.params;
    openRequests[id] = { time: process.hrtime(), username };
    res.send(id);
});

app.get(`/leaderboard`, async (req, res) => {
    const leaderboard = JSON.parse(await readFile("./leaderboard.json"));
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
                return `<li>${item.username}: ${item.time[0]}.${item.time[1].toString().padStart(9, '0')}`;
            }).join("\n")}
        </ol>
    `);
});

app.get(`/:id`, async (req, res) => {
    const id = req.params.id;
    const initTime = openRequests[id].time;
    const username = openRequests[id].username;
    const diffTime = process.hrtime(initTime);
    const leaderboard = JSON.parse(await readFile("./leaderboard.json"));
    
    leaderboard.push({
        username,
        time: diffTime
    });

    await writeFile("./leaderboard.json", JSON.stringify(leaderboard));
    res.send({ time: diffTime, username });
});

app.listen(8000);