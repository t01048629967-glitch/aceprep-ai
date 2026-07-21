// SM-2 Spaced Repetition Algorithm
// quality: 1 = Again (didn't know it), 3 = Hard, 4 = Good, 5 = Easy
// This is the same core algorithm used by Anki and SuperMemo.

export function calculateNextReview(quality, prevRepetitions = 0, prevEaseFactor = 2.5, prevInterval = 0) {
  let repetitions = prevRepetitions;
  let easeFactor = prevEaseFactor;
  let interval = prevInterval;

  if (quality < 3) {
    // Failed recall — reset progress, review again tomorrow
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * easeFactor);
    }
  }

  // Adjust ease factor based on how easy/hard this was
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    nextReview: nextReviewDate.toISOString(),
  };
}

// Default SRS state for a brand-new note
export function defaultSrsState() {
  return {
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReview: new Date().toISOString(), // due immediately
  };
}

// Returns notes that are due for review today (or overdue), sorted by most overdue first
export function getDueNotes(notes) {
  const now = new Date();
  return notes
    .filter((note) => !note.srs || new Date(note.srs.nextReview) <= now)
    .sort((a, b) => {
      const aDate = a.srs ? new Date(a.srs.nextReview) : new Date(0);
      const bDate = b.srs ? new Date(b.srs.nextReview) : new Date(0);
      return aDate - bDate;
    });
}