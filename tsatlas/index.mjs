import data from './index.json' assert { type: 'json' };

/**
 * Look up all timezone entries for a given abbreviation.
 * @param {string} abbr - Timezone abbreviation (e.g. "IST", "PST")
 * @returns {Array<{value: string, text: string, utc: string[]}>}
 */
export function lookup(abbr) {
  return data[abbr.toUpperCase()] || [];
}

/**
 * Get all IANA timezone identifiers for a given abbreviation.
 * @param {string} abbr - Timezone abbreviation
 * @returns {string[]}
 */
export function getUtcZones(abbr) {
  return lookup(abbr)
    .flatMap(entry => entry.utc)
    .filter(Boolean);
}

/**
 * Get all known timezone abbreviations.
 * @returns {string[]}
 */
export function getAllAbbreviations() {
  return Object.keys(data);
}

export { data };
export default data;
