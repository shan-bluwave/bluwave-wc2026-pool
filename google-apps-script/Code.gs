// ============================================================
// FIFA WORLD CUP 2026 POOL - Google Apps Script Backend
// ============================================================
// Deploy this as a Web App in Google Apps Script.
// It reads/writes to the Google Sheet it's attached to.
// ============================================================

// Sheet names
const SHEET_MATCHES = 'Matches';
const SHEET_PREDICTIONS = 'Predictions';
const SHEET_RESULTS = 'Results';
const SHEET_CONFIG = 'Config';

// Handle GET requests
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getConfig':
        result = getConfig();
        break;
      case 'getMatches':
        result = getMatches(e.parameter.round);
        break;
      case 'getUserPredictions':
        result = getUserPredictions(e.parameter.userName, e.parameter.round);
        break;
      case 'getLeaderboard':
        result = getLeaderboard();
        break;
      case 'getResults':
        result = getResults(e.parameter.round);
        break;
      case 'getAllPredictions':
        result = getAllPredictions(e.parameter.round);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests
function doPost(e) {
  let result;

  try {
    const data = JSON.parse(e.postData.contents);

    switch (data.action) {
      case 'submitPredictions':
        result = submitPredictions(data.userName, data.round, data.predictions);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// CONFIG
// ============================================================
function getConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(SHEET_CONFIG);
  const activeRound = configSheet.getRange('B1').getValue();
  const deadline = configSheet.getRange('B2').getValue();
  return { activeRound: activeRound, deadline: deadline };
}

// ============================================================
// MATCHES
// ============================================================
function getMatches(round) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_MATCHES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0]; // id, round, team1, team2

  const matches = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === round) {
      matches.push({
        id: data[i][0].toString(),
        round: data[i][1],
        team1: data[i][2],
        team2: data[i][3]
      });
    }
  }

  return { matches: matches };
}

// ============================================================
// PREDICTIONS
// ============================================================
function submitPredictions(userName, round, predictions) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Check deadline
  const configSheet = ss.getSheetByName(SHEET_CONFIG);
  const deadline = configSheet.getRange('B2').getValue();
  if (deadline && new Date() > new Date(deadline)) {
    return { success: false, message: 'Deadline has passed! Predictions are locked.' };
  }

  const sheet = ss.getSheetByName(SHEET_PREDICTIONS);
  const data = sheet.getDataRange().getValues();

  // Check if user already has predictions for this round - update them
  let found = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userName && data[i][1] === round) {
      // Update existing row
      sheet.getRange(i + 1, 3).setValue(JSON.stringify(predictions));
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      found = true;
      break;
    }
  }

  if (!found) {
    // Append new row
    sheet.appendRow([userName, round, JSON.stringify(predictions), new Date().toISOString()]);
  }

  return { success: true, message: 'Predictions saved!' };
}

function getUserPredictions(userName, round) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PREDICTIONS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userName && data[i][1] === round) {
      return { predictions: JSON.parse(data[i][2]) };
    }
  }

  return { predictions: null };
}

// ============================================================
// RESULTS & LEADERBOARD
// ============================================================
function getResults(round) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_RESULTS);
  const data = sheet.getDataRange().getValues();

  const results = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === round) {
      results[data[i][0].toString()] = data[i][2]; // matchId -> winner
    }
  }

  return { results: results };
}

function getLeaderboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const predictionsSheet = ss.getSheetByName(SHEET_PREDICTIONS);
  const resultsSheet = ss.getSheetByName(SHEET_RESULTS);

  // Get all results
  const resultsData = resultsSheet.getDataRange().getValues();
  const results = {}; // { round: { matchId: winner } }
  for (let i = 1; i < resultsData.length; i++) {
    const matchId = resultsData[i][0].toString();
    const round = resultsData[i][1];
    const winner = resultsData[i][2];
    if (!results[round]) results[round] = {};
    results[round][matchId] = winner;
  }

  // Points per round
  const pointsMap = {
    'Round of 32': 2,
    'Round of 16': 4,
    'Quarter-Finals': 8,
    'Semi-Finals': 16,
    'Final': 32
  };

  // Get all predictions
  const predData = predictionsSheet.getDataRange().getValues();
  const players = {}; // { name: { r32: X, r16: X, qf: X, sf: X, f: X, total: X } }

  for (let i = 1; i < predData.length; i++) {
    const name = predData[i][0];
    const round = predData[i][1];
    const preds = JSON.parse(predData[i][2]);

    if (!players[name]) {
      players[name] = { name: name, r32: 0, r16: 0, qf: 0, sf: 0, f: 0, total: 0 };
    }

    // Calculate points for this round
    const roundResults = results[round] || {};
    let roundPoints = 0;

    for (const [matchId, pickedTeam] of Object.entries(preds)) {
      if (roundResults[matchId] && roundResults[matchId] === pickedTeam) {
        roundPoints += pointsMap[round] || 0;
      }
    }

    // Store per-round points
    const roundKey = {
      'Round of 32': 'r32',
      'Round of 16': 'r16',
      'Quarter-Finals': 'qf',
      'Semi-Finals': 'sf',
      'Final': 'f'
    }[round];

    if (roundKey) {
      players[name][roundKey] = roundPoints;
    }
    players[name].total += roundPoints;
  }

  // Sort by total descending, tiebreaker: later rounds first
  const leaderboard = Object.values(players).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.f !== a.f) return b.f - a.f;
    if (b.sf !== a.sf) return b.sf - a.sf;
    if (b.qf !== a.qf) return b.qf - a.qf;
    if (b.r16 !== a.r16) return b.r16 - a.r16;
    return b.r32 - a.r32;
  });

  return { leaderboard: leaderboard };
}

// ============================================================
// ALL PREDICTIONS (view everyone's picks for a round)
// ============================================================
function getAllPredictions(round) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const predSheet = ss.getSheetByName(SHEET_PREDICTIONS);
  const matchSheet = ss.getSheetByName(SHEET_MATCHES);

  // Get matches for this round
  const matchData = matchSheet.getDataRange().getValues();
  const matches = [];
  for (let i = 1; i < matchData.length; i++) {
    if (matchData[i][1] === round) {
      matches.push({
        id: matchData[i][0].toString(),
        team1: matchData[i][2],
        team2: matchData[i][3]
      });
    }
  }

  // Get all predictions for this round
  const predData = predSheet.getDataRange().getValues();
  const players = [];
  for (let i = 1; i < predData.length; i++) {
    if (predData[i][1] === round) {
      players.push({
        name: predData[i][0],
        picks: JSON.parse(predData[i][2])
      });
    }
  }

  // Sort players alphabetically
  players.sort((a, b) => a.name.localeCompare(b.name));

  return { matches: matches, players: players };
}
