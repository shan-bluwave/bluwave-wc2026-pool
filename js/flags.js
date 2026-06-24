// ============================================================
// Country Flag Image Mapping for FIFA World Cup 2026 Teams
// Uses flagcdn.com for cross-platform flag images
// ============================================================

const FLAG_CODES = {
    // Group A
    'Canada': 'ca',
    'Morocco': 'ma',
    'Australia': 'au',
    'Peru': 'pe',

    // Group B
    'USA': 'us',
    'United States': 'us',
    'Mexico': 'mx',
    'Ecuador': 'ec',
    'Bolivia': 'bo',

    // Group C
    'Argentina': 'ar',
    'Japan': 'jp',
    'Tunisia': 'tn',
    'Bahrain': 'bh',

    // Group D
    'France': 'fr',
    'Colombia': 'co',
    'Indonesia': 'id',
    'Uzbekistan': 'uz',

    // Group E
    'Brazil': 'br',
    'Nigeria': 'ng',
    'Saudi Arabia': 'sa',
    'New Zealand': 'nz',

    // Group F
    'England': 'gb-eng',
    'Senegal': 'sn',
    'Denmark': 'dk',
    'Panama': 'pa',

    // Group G
    'Spain': 'es',
    'Netherlands': 'nl',
    'Iran': 'ir',
    'Honduras': 'hn',

    // Group H
    'Germany': 'de',
    'Uruguay': 'uy',
    'South Korea': 'kr',
    'Cameroon': 'cm',

    // Group I
    'Portugal': 'pt',
    'Croatia': 'hr',
    'Serbia': 'rs',
    'Costa Rica': 'cr',

    // Group J
    'Belgium': 'be',
    'Switzerland': 'ch',
    'Paraguay': 'py',
    'Albania': 'al',

    // Group K
    'Italy': 'it',
    'Egypt': 'eg',
    'Ukraine': 'ua',
    'Trinidad and Tobago': 'tt',

    // Group L
    'Poland': 'pl',
    'Chile': 'cl',
    'Wales': 'gb-wls',
    'Slovakia': 'sk',

    // Additional common variations
    'Korea Republic': 'kr',
    'IR Iran': 'ir',
    'Saudi': 'sa',
    'Ivory Coast': 'ci',
    'Côte d\'Ivoire': 'ci',
    'DR Congo': 'cd',
    'Ghana': 'gh',
    'Algeria': 'dz',
    'Sweden': 'se',
    'Austria': 'at',
    'Czech Republic': 'cz',
    'Czechia': 'cz',
    'Scotland': 'gb-sct',
    'Turkey': 'tr',
    'Romania': 'ro',
    'Norway': 'no',
    'Russia': 'ru',
    'Qatar': 'qa',
    'Jamaica': 'jm',
    'Venezuela': 've',
    'China': 'cn',
    'Mali': 'ml',
    'Tanzania': 'tz',
    'Congo': 'cg',
    'Slovenia': 'si'
};

// Helper function to get team name with flag image
function withFlag(teamName) {
    const code = FLAG_CODES[teamName];
    if (code) {
        return `<img src="https://flagcdn.com/24x18/${code}.png" alt="${teamName}" class="inline-block mr-2 rounded-sm" style="vertical-align: middle; width:24px; height:18px;"> ${teamName}`;
    }
    return teamName;
}
