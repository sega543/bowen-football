window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 17, 24, 0.95)';
        nav.style.transition = '0.3s';
    } else {
        nav.style.background = 'transparent';
    }
});

// Simple click effect for the "Read More" button
document.querySelector('.btn-primary').addEventListener('click', function() {
    this.textContent = "Loading...";
    setTimeout(() => {
        this.textContent = "Read More";
        alert("Redirecting to Club History!");
    }, 1000);
});







(function() {
    // 1. Database
    let allPlayers = [];
    let currentPage = 'STRIKERS';

    // 2. Position Configuration (G.P + 3 Roles)
    const configs = {
        'STRIKERS': {
            labels: ['G.P', 'S.O.T', 'DRIBBLES', 'KEY PASS'],
            calc: (gp, s1, s2, s3) => ((s1 * 0.8) + (s2 * 0.5) + (s3 * 1.2))
        },
        'MIDFIELDERS': {
            labels: ['G.P', 'ACC. %', 'RECOVERY', 'INTERCEPT'],
            calc: (gp, s1, s2, s3) => ((s1 * 0.05) + (s2 * 1.1) + (s3 * 1.3))
        },
        'DEFENDERS': {
            labels: ['G.P', 'TACKLES', 'BLOCKS', 'CLEARANCE'],
            calc: (gp, s1, s2, s3) => ((s1 * 1.5) + (s2 * 1.5) + (s3 * 0.8))
        },
        'KEEPERS': {
            labels: ['G.P', 'SAVES', 'C. SHEETS', 'CLAIMS'],
            calc: (gp, s1, s2, s3) => ((s1 * 1.2) + (s2 * 4.0) + (s3 * 1.5))
        }
    };

    // 3. Rating Formula (Hard to get 9/10)
    function calculateRating(pos, gp, s1, s2, s3) {
        if (!gp || gp === 0) return 0;
        
        let config = configs[pos];
        let gpScore = Math.min(5, (gp / 5)); // Game Play over 5
        let performance = config.calc(gp, s1, s2, s3) / (gp * 0.2);
        
        // Base: 0.1 * G.P * 20 (scaled)
        let raw = (0.1 * gpScore * 20) + (performance * 0.2);
        
        // Diminishing returns curve
        let final = raw > 7.2 ? 7.2 + (Math.log10(raw - 6.2) * 1.4) : raw;
        return Math.min(10, Math.max(1, final)).toFixed(1);
    }

    // 4. Global Add Function
    window.addNewPlayer = function(name, gp, s1, s2, s3, col, pos) {
        let rating = calculateRating(pos.toUpperCase(), gp, s1, s2, s3);
        allPlayers.push({
            name: name,
            gp: gp,
            s1: s1, s2: s2, s3: s3,
            col: col,
            pos: pos.toUpperCase(),
            rating: parseFloat(rating)
        });
        render();
    };

    // 5. Navigation Function
    window.changePage = function(pageName) {
        currentPage = pageName;
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.toggle('active', b.innerText === pageName);
        });
        render();
    };

    // 6. Rendering Engine
    function render() {
        const list = document.getElementById('player-list');
        const labels = document.getElementById('dynamic-labels');
        if (!list || !labels) return;

        // Update Headers
        let currentConf = configs[currentPage];
        labels.innerHTML = currentConf.labels.map(text => `<span class="stat-item">${text}</span>`).join('');

        // Filter & Sort
        list.innerHTML = '';
        let filtered = allPlayers.filter(p => p.pos === currentPage);
        filtered.sort((a, b) => b.rating - a.rating);

        // Build Rows
        filtered.forEach((p, i) => {
            list.innerHTML += `
                <div class="p-row">
                    <div class="col-rank">${i + 1}</div>
                    <div class="col-player">
                        <div class="player-info">
                            <div class="avatar">${p.name.charAt(0)}</div>
                            <div class="name-stack">
                                <span class="p-name">${p.name}</span>
                                <span class="p-role">${p.pos}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-stats">
                        <span class="stat-item">${p.gp}</span>
                        <span class="stat-item">${p.s1}</span>
                        <span class="stat-item">${p.s2}</span>
                        <span class="stat-item">${p.s3}</span>
                    </div>
                    <div class="col-rating">
                        <span class="rating-box">${p.rating.toFixed(1)}</span>
                    </div>
                </div>`;
        });
    }

    // 7. Initial Data Boot
    document.addEventListener("DOMContentLoaded", () => {
        // Strikers: Name, GP, SOT, Dribbles, Key Pass, ColDept, Position
        addNewPlayer("Jean-Loup Autret", 10, 22, 15, 8, 2, "STRIKERS");
        addNewPlayer("Marco Di Stasio", 12, 18, 10, 5, 1, "STRIKERS");
        
        // Defenders: Name, GP, Tackles, Blocks, Clearances, ColDept, Position
        addNewPlayer("Virgil Van Dijk", 10, 25, 12, 45, 0, "DEFENDERS");
        
        render();
    });
})();