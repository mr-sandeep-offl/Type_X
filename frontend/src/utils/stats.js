/**
 * Calculate gross WPM (all typed characters / 5 / minutes)
 */
export function calcGrossWPM(totalCharsTyped, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(totalCharsTyped / 5 / minutes);
}

/**
 * Calculate net WPM (subtracts uncorrected error words)
 */
export function calcNetWPM(totalCharsTyped, errorCount, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const gross = totalCharsTyped / 5 / minutes;
  const net = gross - errorCount / minutes;
  return Math.max(0, Math.round(net));
}

/**
 * Calculate accuracy percentage
 */
export function calcAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

/**
 * Build mistake frequency map from typed vs passage
 */
export function buildMistakeMap(passage, typedArr) {
  const map = {};
  for (let i = 0; i < typedArr.length; i++) {
    const expected = passage[i];
    const actual = typedArr[i];
    if (actual !== undefined && actual !== expected) {
      map[expected] = (map[expected] || 0) + 1;
    }
  }
  return map;
}

/**
 * Get top N most-mistyped characters as sorted array
 */
export function getTopMistakes(mistakeMap, n = 10) {
  return Object.entries(mistakeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([char, count]) => ({ char, count }));
}

/**
 * Format seconds into MM:SS display
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
