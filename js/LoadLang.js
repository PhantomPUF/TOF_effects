let languageIndex = {};

function buildIndex(obj, parentKey = '') {
  for (const key in obj) {
    languageIndex[key] = obj[key];

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      buildIndex(obj[key], key);
    }
  }
}

function findValueByIndex(targetKey) {
  return languageIndex[targetKey] || '';
}