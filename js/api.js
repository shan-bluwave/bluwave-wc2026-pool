// ============================================================
// API Service - Communicates with Google Apps Script backend
// ============================================================

const API = {
    // Helper to handle Google Apps Script responses
    // Uses no-cors workaround: GET requests work fine, POST uses form submission approach
    async _fetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                redirect: 'follow',
                mode: 'cors',
                ...options
            });
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse response:', text);
                console.error('URL was:', url);
                return { error: 'Invalid response from server' };
            }
        } catch (e) {
            console.error('Fetch error:', e, 'URL:', url);
            throw e;
        }
    },

    // Get current configuration (active round, matches)
    async getConfig() {
        return this._fetch(`${CONFIG.API_URL}?action=getConfig`);
    },

    // Get matches for a specific round
    async getMatches(round) {
        return this._fetch(`${CONFIG.API_URL}?action=getMatches&round=${encodeURIComponent(round)}`);
    },

    // Submit predictions for a user
    async submitPredictions(userName, round, predictions) {
        return this._fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'submitPredictions',
                userName: userName,
                round: round,
                predictions: predictions
            })
        });
    },

    // Get predictions for a specific user and round
    async getUserPredictions(userName, round) {
        return this._fetch(
            `${CONFIG.API_URL}?action=getUserPredictions&userName=${encodeURIComponent(userName)}&round=${encodeURIComponent(round)}`
        );
    },

    // Get leaderboard data
    async getLeaderboard() {
        return this._fetch(`${CONFIG.API_URL}?action=getLeaderboard`);
    },

    // Get results for a specific round
    async getResults(round) {
        return this._fetch(`${CONFIG.API_URL}?action=getResults&round=${encodeURIComponent(round)}`);
    },

    // Get all predictions for a round (all players)
    async getAllPredictions(round) {
        return this._fetch(`${CONFIG.API_URL}?action=getAllPredictions&round=${encodeURIComponent(round)}`);
    }
};
