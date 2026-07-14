import { useRef, useState, useEffect, useCallback } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useGhostReplay } from '../../hooks/useGhostReplay';
import { formatTime, getTopMistakes } from '../../utils/stats';
import MistakeHeatmap from '../MistakeHeatmap/MistakeHeatmap';
import './SoloTest.css';

export default function SoloTest({ passage, passageId, onDone, onRestart }) {
  const {
    typed, cursor, errors, started, finished,
    elapsedMs, wpm, netWpm, accuracy,
    streak, multiplier, mistakeMap, progress, reset,
  } = useTypingEngine(passage);

  const { startRecording, recordPosition, saveReplay, loadReplay, getGhostCursor } = useGhostReplay(passageId);

  const [ghostReplay, setGhostReplay] = useState(null);
  const [ghostCursor, setGhostCursor] = useState(0);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const containerRef = useRef(null);
  const startMsRef = useRef(null);
  const ghostRafRef = useRef(null);

  // Load ghost on mount
  useEffect(() => {
    const saved = loadReplay();
    setGhostReplay(saved);
  }, [passageId, loadReplay]);

  // Start ghost playback when race starts
  useEffect(() => {
    if (started && ghostReplay) {
      startMsRef.current = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startMsRef.current;
        setGhostCursor(getGhostCursor(ghostReplay, elapsed));
        ghostRafRef.current = requestAnimationFrame(tick);
      };
      ghostRafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(ghostRafRef.current);
    }
  }, [started, ghostReplay, getGhostCursor]);

  // Record positions while typing
  useEffect(() => {
    if (started && !finished) {
      if (cursor === 0) startRecording();
      recordPosition(cursor);
    }
  }, [cursor, started, finished, startRecording, recordPosition]);

  // Save replay and notify parent when finished
  useEffect(() => {
    if (finished) {
      cancelAnimationFrame(ghostRafRef.current);
      saveReplay();
      onDone?.({ wpm, netWpm, accuracy, elapsedMs, mistakeMap });
    }
  }, [finished]); // eslint-disable-line

  const focusTest = useCallback(() => containerRef.current?.focus(), []);

  const handleReset = () => { reset(); onRestart?.(); };

  // Build character spans
  const chars = passage.split('').map((ch, i) => {
    let cls = 'char char--untyped';
    if (i < typed.length) {
      cls = errors.has(i) ? 'char char--wrong' : 'char char--correct';
    }
    if (i === cursor) cls += ' char--cursor';
    // Ghost cursor overlay
    if (ghostReplay && i === ghostCursor && i !== cursor) cls += ' char--ghost';
    return (
      <span key={i} className={cls}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    );
  });

  const multiplierColors = ['', '', '#e8a020', '#d44', '#a22', '#700'];
  const multColor = multiplierColors[Math.min(multiplier, 5)] || '#e63946';

  return (
    <div className="solo-test page-enter">
      {/* ── Stats bar ── */}
      <div className="solo-stats-bar">
        <div className="solo-stat">
          <span className="solo-stat-val">{wpm}</span>
          <span className="solo-stat-label">WPM</span>
        </div>
        <div className="solo-stat">
          <span className="solo-stat-val">{accuracy}%</span>
          <span className="solo-stat-label">Accuracy</span>
        </div>
        <div className="solo-stat">
          <span className="solo-stat-val">{formatTime(elapsedMs)}</span>
          <span className="solo-stat-label">Time</span>
        </div>
        <div className="solo-stat solo-stat--streak">
          <span className="solo-stat-val" style={{ color: streak > 0 ? '#e63946' : 'var(--muted-light)' }}>
            {streak}
          </span>
          <span className="solo-stat-label">Streak</span>
        </div>
        <div className="solo-multiplier" style={{ color: multColor }}>
          <span>×{multiplier}</span>
          <span className="solo-mult-label">COMBO</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="solo-progress-track">
        <div className="solo-progress-fill" style={{ width: `${progress}%` }} />
        {ghostReplay && (
          <div
            className="solo-progress-ghost"
            style={{ width: `${Math.round((ghostCursor / passage.length) * 100)}%` }}
          />
        )}
      </div>

      {/* ── Typing area ── */}
      <div
        className="solo-passage-wrap"
        ref={containerRef}
        tabIndex={0}
        onClick={focusTest}
        aria-label="Typing test area"
        role="textbox"
        aria-readonly="false"
      >
        {!started && (
          <div className="solo-start-hint">
            Click here and start typing to begin…
          </div>
        )}
        <div className="solo-passage" aria-hidden={!started}>
          {chars}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="solo-controls">
        <button className="btn btn-ghost btn-sm" id="btn-reset-solo" onClick={handleReset}>
          ↺ Restart
        </button>
        <button
          className="btn btn-ghost btn-sm"
          id="btn-custom-text"
          onClick={() => setShowCustom(true)}
        >
          📋 Custom Text
        </button>
        {ghostReplay && (
          <span className="solo-ghost-indicator">👻 Ghost active</span>
        )}
      </div>

      {/* ── Finished overlay ── */}
      {finished && (
        <div className="solo-results-overlay page-enter" role="dialog" aria-modal="true">
          <div className="solo-results-card">
            <div className="solo-results-header">
              <h2>Race Complete!</h2>
              <div className="solo-results-wpm">{wpm} <span>WPM</span></div>
            </div>
            <div className="solo-results-grid">
              <div className="solo-results-stat">
                <span className="val">{netWpm}</span>
                <span className="lbl">Net WPM</span>
              </div>
              <div className="solo-results-stat">
                <span className="val">{accuracy}%</span>
                <span className="lbl">Accuracy</span>
              </div>
              <div className="solo-results-stat">
                <span className="val">{formatTime(elapsedMs)}</span>
                <span className="lbl">Time</span>
              </div>
              <div className="solo-results-stat">
                <span className="val">{errors.size}</span>
                <span className="lbl">Errors</span>
              </div>
            </div>
            <MistakeHeatmap mistakeMap={mistakeMap} />
            <div className="solo-results-actions">
              <button className="btn btn-primary" id="btn-ghost-replay" onClick={handleReset}>
                👻 Ghost Replay
              </button>
              <button className="btn btn-ghost" id="btn-new-passage" onClick={() => { reset(); onRestart?.('new'); }}>
                New Passage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom text modal ── */}
      {showCustom && (
        <div className="custom-modal-overlay" onClick={() => setShowCustom(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <h3>Custom Text</h3>
            <p className="custom-modal-hint">Paste your own text to practice on</p>
            <textarea
              className="custom-textarea"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Paste your passage here…"
              rows={6}
              autoFocus
            />
            <div className="custom-modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCustom(false)}>Cancel</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (customText.trim().length > 10) {
                    setShowCustom(false);
                    onRestart?.('custom', customText.trim());
                  }
                }}
              >
                Use This Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
