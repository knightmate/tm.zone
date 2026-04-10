export interface TimezoneEntry {
  value: string;
  text: string;
  utc: (string | null)[];
}

export type TimezoneData = Record<string, TimezoneEntry[]>;

/** Raw timezone abbreviation → entries map */
export declare const data: TimezoneData;

/**
 * Look up all timezone entries for a given abbreviation.
 * @example lookup("IST") // [{ value: "India Standard Time", text: "...", utc: ["Asia/Kolkata"] }]
 */
export declare function lookup(abbr: string): TimezoneEntry[];

/**
 * Get all IANA timezone identifiers for a given abbreviation.
 * @example getUtcZones("IST") // ["Asia/Kolkata"]
 */
export declare function getUtcZones(abbr: string): string[];

/**
 * Get all known timezone abbreviations.
 * @example getAllAbbreviations() // ["DST", "HST", "IST", ...]
 */
export declare function getAllAbbreviations(): string[];

export default data;
