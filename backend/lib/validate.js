export const BANNED_WORDS = [
  'focal length', 'aperture', 'rule of thirds', 'bokeh',
  'exposure', 'iso', 'shutter speed', 'depth of field', 'composition'
];

export function validateInstructions(photographer, subject) {
  if (!photographer || !subject) {
    return { valid: false, reason: 'Both fields must be present and non-empty' };
  }

  const trimmedPhotographer = photographer.trim();
  const trimmedSubject = subject.trim();

  if (!trimmedPhotographer || !trimmedSubject) {
    return { valid: false, reason: 'Both fields must be present and non-empty' };
  }

  if (trimmedPhotographer.length > 18) {
    return { valid: false, reason: `photographer exceeds 18 characters: ${trimmedPhotographer.length}` };
  }

  if (trimmedSubject.length > 18) {
    return { valid: false, reason: `subject exceeds 18 characters: ${trimmedSubject.length}` };
  }

  const lower = (trimmedPhotographer + ' ' + trimmedSubject).toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) {
      return { valid: false, reason: `Banned word found: "${word}"` };
    }
  }

  return { valid: true };
}
