const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Main Data Store
let leagueData = {
    standings: [
        { team: "Tottenham", pts: 70, form: "WWWWW" },
        { team: "Arsenal", pts: 57, form: "DLWWD" },
        { team: "Man City", pts: 53, form: "LWDWW" }
    ],
    matches: [
        { home: "Spurs", score: "4 - 0", away: "Bournemouth", status: "FT" },
        { home: "Chelsea", score: "2 - 2", away: "Leeds United", status: "FT" }
    ],
    players: [
        { name: "Okoye Emmanuel", club: "Man United", pos: "Centerback", col: "COCCS", stats: 10.0 }
    ],
    pendingPlayers: []
};

app.get('/api/data', (req, res) => res.json(leagueData));

app.post('/api/register', (req, res) => {
    leagueData.pendingPlayers.push(req.body);
    res.status(201).json({ success: true });
});

app.post('/api/approve', (req, res) => {
    const { index } = req.body;
    const player = leagueData.pendingPlayers.splice(index, 1)[0];
    leagueData.players.push({ ...player, stats: 0.0 });
    res.json({ success: true });
});

module.exports = app;