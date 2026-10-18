export const SEVERITY_ORDER = ['critical', 'serious', 'moderate', 'minor'];

// "https://www.suratmunicipal.gov.in/path" -> "suratmunicipal.gov.in"
export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// { critical: 2, serious: 5, ... } for one scan's violations
export function severityCounts(violations = []) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  violations.forEach((v) => {
    if (counts[v.impact] !== undefined) counts[v.impact] += 1;
  });
  return counts;
}

// The most severe level present, or null when there are no violations
export function worstSeverity(violations = []) {
  const counts = severityCounts(violations);
  return SEVERITY_ORDER.find((level) => counts[level] > 0) || null;
}
