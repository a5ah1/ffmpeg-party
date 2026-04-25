const fs = require('fs');
const path = require('path');

function countMd(dir) {
  try {
    return fs.readdirSync(path.join(__dirname, '..', dir))
      .filter(f => f.endsWith('.md'))
      .length;
  } catch {
    return 0;
  }
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} UTC`;

module.exports = {
  timestamp: now.getTime(),
  date,
  time,
  isoDate: now.toISOString(),
  toolCount: countMd('tools'),
  guideCount: countMd('guides')
};
