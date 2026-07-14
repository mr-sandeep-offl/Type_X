import { useState, useEffect, useRef, useCallback } from 'react';
import { calcGrossWPM, calcNetWPM, calcAccuracy, buildMistakeMap } from '../utils/stats';

/**
 * Core typing engine hook.
 * Manages all state for a typing test: typed chars, cursor, errors, WPM, accuracy, streak.
 */
export function useTypingEngine(passage) {
  const [typed, setTyped] = useState([]);       // array of typed characters
  const [cursor, setCursor] = useState(0);       // current position in passage
  const [errors, setErrors] = useState(new Set()); // indices of wrong chars
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakeMap, setMistakeMap] = useState({});

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const typedRef = useRef([]);
  const errorsRef = useRef(new Set());
  const streakRef = useRef(0);

  // Sync refs
  typedRef.current = typed;
  errorsRef.current = errors;
  streakRef.current = streak;

  // Start timer on first keystroke
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedMs(elapsed);
      const correctChars = typedRef.current.filter((c, i) => c === passage[i]).length;
      const g = calcGrossWPM(typedRef.current.length, elapsed);
      const n = calcNetWPM(typedRef.current.length, errorsRef.current.size, elapsed);
      setWpm(g);
      setNetWpm(n);
      setAccuracy(calcAccuracy(correctChars, typedRef.current.length));
    }, 250);
  }, [passage]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle a keystroke
  const handleKey = useCallback((e) => {
    if (!passage) return;

    // Ignore keypresses when typing in inputs/textareas
    const active = document.activeElement;
    if (active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    )) {
      return;
    }

    if (finished) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      if (cursor === 0) return;
      const newCursor = cursor - 1;
      const newTyped = typed.slice(0, newCursor);
      const newErrors = new Set(errors);
      newErrors.delete(newCursor);
      setTyped(newTyped);
      setCursor(newCursor);
      setErrors(newErrors);
      return;
    }

    if (key.length !== 1) return; // ignore modifier keys

    e.preventDefault();

    if (!started) {
      setStarted(true);
      startTimer();
    }

    const expected = passage[cursor];
    const isCorrect = key === expected;
    const newTyped = [...typed, key];
    const newErrors = new Set(errors);

    if (!isCorrect) {
      newErrors.add(cursor);
      setStreak(0);
      streakRef.current = 0;
    } else {
      const newStreak = streakRef.current + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    }

    setTyped(newTyped);
    setErrors(newErrors);
    const newCursor = cursor + 1;
    setCursor(newCursor);

    // Finished
    if (newCursor >= passage.length) {
      stopTimer();
      setFinished(true);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const correctChars = newTyped.filter((c, i) => c === passage[i]).length;
      const finalWpm = calcGrossWPM(newTyped.length, elapsed);
      const finalNet = calcNetWPM(newTyped.length, newErrors.size, elapsed);
      const finalAcc = calcAccuracy(correctChars, newTyped.length);
      setWpm(finalWpm);
      setNetWpm(finalNet);
      setAccuracy(finalAcc);
      setElapsedMs(elapsed);
      setMistakeMap(buildMistakeMap(passage, newTyped));
    }
  }, [cursor, errors, finished, passage, started, streak, maxStreak, typed, startTimer, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setTyped([]);
    setCursor(0);
    setErrors(new Set());
    setStarted(false);
    setFinished(false);
    setElapsedMs(0);
    setWpm(0);
    setNetWpm(0);
    setAccuracy(100);
    setStreak(0);
    setMistakeMap({});
    startTimeRef.current = null;
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  // Attach global keydown
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const getMultiplier = () => {
    if (streak >= 50) return 5;
    if (streak >= 30) return 4;
    if (streak >= 20) return 3;
    if (streak >= 10) return 2;
    return 1;
  };

  return {
    typed, cursor, errors, started, finished,
    elapsedMs, wpm, netWpm, accuracy,
    streak, maxStreak, mistakeMap,
    multiplier: getMultiplier(),
    progress: passage ? Math.round((cursor / passage.length) * 100) : 0,
    reset,
  };
}
