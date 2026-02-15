const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Initial Data
let leagueData = {
    standings: [
        { pos: 1, team: "Tottenham", pts: 70, pl: 25, gd: 20, form: "WWWWW" },
        { pos: 2, team: "Arsenal", pts: 57, pl: 25, gd: 15, form: "DLWWD" }
    ],
    matches: [
        { home: "Spurs", score: "4 - 0", away: "Bournemouth" }
    ],
    players: [
        { id: 1, name: "Okoye Emmanuel", club: "Man United", pos: "Defender", stats: "10.0" }
    ],
    pendingPlayers: [] // Users land here first
};

// GET: All Data
app.get('/api/data', (req, res) => res.json(leagueData));

// POST: Player Registration (Goes to pending)
app.post('/api/register', (req, res) => {
    const newPlayer = { id: Date.now(), ...req.body };
    leagueData.pendingPlayers.push(newPlayer);
    res.status(201).json({ message: "Registration submitted for approval" });
});

// POST: Admin Approval
app.post('/api/admin/approve', (req, res) => {
    const { id, action } = req.body; // action: 'approve' or 'reject'
    const playerIndex = leagueData.pendingPlayers.findIndex(p => p.id === id);
    
    if (playerIndex > -1) {
        if (action === 'approve') {
            const player = leagueData.pendingPlayers[playerIndex];
            leagueData.players.push({ ...player, stats: "0.0" }); // Move to active
        }
        leagueData.pendingPlayers.splice(playerIndex, 1); // Remove from pending
        return res.json({ success: true });
    }
    res.status(404).json({ message: "Player not found" });
});

// POST: Update Standings (Admin only)
app.post('/api/admin/update-standings', (req, res) => {
    leagueData.standings = req.body;
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));