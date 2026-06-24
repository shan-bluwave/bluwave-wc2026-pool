// ============================================================
// CONFIGURATION - Update this with your Google Apps Script URL
// ============================================================

const CONFIG = {
    // After deploying your Google Apps Script, paste the web app URL here:
    API_URL: 'https://script.google.com/macros/s/AKfycbxv-N1M4IvlT_PfpSjDVCofB_Zme3aE5filWWgEIvH6dhQw4r0Z5cXx5Rbqxrxf6Lx2/exec',

    // Point values per round
    POINTS: {
        'Round of 32': 2,
        'Round of 16': 4,
        'Quarter-Finals': 8,
        'Semi-Finals': 16,
        'Final': 32
    },

    // Round order
    ROUNDS: ['Round of 32', 'Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'],

    // Number of matches per round
    MATCHES_PER_ROUND: {
        'Round of 32': 16,
        'Round of 16': 8,
        'Quarter-Finals': 4,
        'Semi-Finals': 2,
        'Final': 1
    }
};
