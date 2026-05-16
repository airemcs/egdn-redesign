import slugifyLib from 'slugify';

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Title-case words while preserving hyphenated parts:
 *   "GATMAITAN" → "Gatmaitan", "CARDEÑO-TORRES" → "Cardeño-Torres"
 */
function titleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => {
          if (part.length === 0) return part;
          // Preserve initial sequences like "M.", "S.G.", "T.J.K." as all-caps.
          if (/^([A-Za-z]\.)+$/.test(part)) return part.toUpperCase();
          return part[0].toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('-'),
    )
    .join(' ');
}

function formatSingleDentistName(name: string): string {
  const trimmed = name.trim();
  const titleMatch = trimmed.match(/^(DR\.?|Dr\.?)\s+(.*)/i);
  if (!titleMatch) return titleCase(trimmed);

  // Normalize spaced hyphens ("ESCAÑO - PARREÑAS" → "ESCAÑO-PARREÑAS") so the
  // hyphenated last name stays one token.
  const rest = titleMatch[2].replace(/\s*-\s*/g, '-').trim();
  const tokens = rest.split(/\s+/);
  if (tokens.length < 2) return `Dr. ${titleCase(rest)}`;

  const last = tokens.pop()!;
  const firstMiddle = tokens.join(' ');
  return `Dr. ${titleCase(last)}, ${titleCase(firstMiddle)}`;
}

/**
 * Reformat a dentist's full name from "Dr. FIRST MIDDLE LAST" to
 * "Dr. Last, First Middle". Handles slash-separated multi-doctor names
 * by reformatting each part independently.
 *
 *   "DR. MELISSA ANGELICA M. GATMAITAN" → "Dr. Gatmaitan, Melissa Angelica M."
 *   "DR. RAMON E. GUERRERO / DR. DINA GUERRERO"
 *     → "Dr. Guerrero, Ramon E. / Dr. Guerrero, Dina"
 */
export function formatDentistName(name: string): string {
  const parts = name.split(/\s*\/\s*/);
  if (parts.length > 1) {
    return parts.map(formatSingleDentistName).join(' / ');
  }
  return formatSingleDentistName(name);
}

/**
 * Strip a trailing " City" suffix for display contexts where the suffix
 * adds noise ("Quezon City" → "Quezon", "Makati City" → "Makati"). Leaves
 * standalone names untouched ("Manila" → "Manila") and preserves cities
 * where "City" is followed by more words ("City of San Fernando" → unchanged,
 * which doesn't end in " City"). Only used for display — keep the raw
 * value when handing the city to Google Maps or other external systems.
 */
export function formatCity(city: string): string {
  return city.replace(/\s+City\s*$/i, '').trim();
}

/**
 * Split a phone-number string that may contain multiple numbers separated by
 * "/", ",", ";", or "|" into a clean array. Empty/whitespace-only entries
 * are dropped.
 *
 *   "0917-890-9467 / 0905-576-8685" → ["0917-890-9467", "0905-576-8685"]
 *   "(02) 8836-7181"               → ["(02) 8836-7181"]
 */
export function splitPhoneNumbers(raw: string): string[] {
  return raw
    .split(/\s*[/,;|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}
