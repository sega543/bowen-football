const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Your Central Database
let leagueData = {
    standings: [
        { pos: 1, team: "Tottenham", pts: 70, form: "WWWWW" },
        { pos: 2, team: "Arsenal", pts: 57, form: "DLWWD" },
        { pos: 3, team: "Man City", pts: 53, form: "LWDWW" },
        { pos: 4, team: "Liverpool", pts: 49, form: "WDLWD" },
        { pos: 5, team: "Chelsea", pts: 47, form: "LWDWW" },
        { pos: 6, team: "Newcastle", pts: 42, form: "LWDWW" }
    ],
    matches: [
        { home: "Spurs", score: "4 - 0", away: "Bournemouth", status: "FT" },
        { home: "Chelsea", score: "2 - 2", away: "Leeds United", status: "FT" },
        { home: "Everton", score: "1 - 2", away: "Bournemouth", status: "FT" },
        { home: "Man United", score: "3 - 1", away: "Brighton", status: "FT" }
    ],
    players: [
        { id: 15, name: "Okoye Emmanuel", club: "Man United", pos: "Centerback", col: "COCCS/SEN", stats: 10.0 }
    ]
};

// API Endpoint to send data to your pages
app.get('/api/data', (req, res) => {
    res.json(leagueData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});