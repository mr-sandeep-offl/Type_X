import { useRef, useCallback } from 'react';

const STORAGE_KEY = 'typeclash_ghost_';

/**
 * Records cursor positions over time and saves to localStorage.
 * On replay, returns the ghost cursor position for a given elapsed time.
 */
export function useGhostReplay(passageId) {
  const recordRef = useRef([]); // [{cursor, time}]
  const startRef = useRef(null);

  const startRecording = useCallback(() => {
    recordRef.current = [];
    startRef.current = Date.now();
  }, []);

  const recordPosition = useCallback((cursor) => {
    if (!startRef.current) return;
    const time = Date.now() - startRef.current;
    recordRef.current.push({ cursor, time });
  }, []);

  const saveReplay = useCallback(() => {
    if (!passageId || recordRef.current.length === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY + passageId,
        JSON.stringify(recordRef.current)
      );
    } catch (_) { /* storage full, ignore */ }
  }, [passageId]);

  const loadReplay = useCallback(() => {
    if (!passageId) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY + passageId);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }, [passageId]);

  /**
   * Given elapsed ms since race start, return the ghost cursor index.
   */
  const getGhostCursor = useCallback((replay, elapsedMs) => {
    if (!replay || replay.length === 0) return 0;
    // Binary search for the last record with time <= elapsedMs
    let lo = 0, hi = replay.length - 1, result = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (replay[mid].time <= elapsedMs) { result = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return replay[result].cursor;
  }, []);

  return { startRecording, recordPosition, saveReplay, loadReplay, getGhostCursor };
}
