'use strict';

const data = require('./index.json');

/**
 * Look up all timezone entries for a given abbreviation.
 * @param {string} abbr - Timezone abbreviation (e.g. "IST", "PST")
 * @returns {Array<{value: string, text: string, utc: string[]}>}
 */
function lookup(abbr) {
  return data[abbr.toUpperCase()] || [];
}

/**
 * Get all IANA timezone identifiers for a given abbreviation.
 * @param {string} abbr - Timezone abbreviation
 * @returns {string[]}
 */
function getUtcZones(abbr) {
  return lookup(abbr)
    .flatMap(entry => entry.utc)
    .filter(Boolean);
}

/**
 * Get all known timezone abbreviations.
 * @returns {string[]}
 */
function getAllAbbreviations() {
  return Object.keys(data);
}

module.exports = { data, lookup, getUtcZones, getAllAbbreviations };
