import { getTopMistakes } from '../../utils/stats';
import './MistakeHeatmap.css';

export default function MistakeHeatmap({ mistakeMap }) {
  const mistakes = getTopMistakes(mistakeMap, 10);
  const maxCount = mistakes[0]?.count || 1;

  if (mistakes.length === 0) {
    return (
      <div className="heatmap-empty">
        <span>🎯</span>
        <p>No mistakes! Perfect accuracy.</p>
      </div>
    );
  }

  return (
    <div className="heatmap">
      <h4 className="heatmap-title">Mistake Heatmap</h4>
      <p className="heatmap-sub">Most frequently mistyped characters</p>
      <div className="heatmap-bars">
        {mistakes.map(({ char, count }) => {
          const pct = Math.round((count / maxCount) * 100);
          const displayChar = char === ' ' ? 'SPACE' : char;
          return (
            <div key={char} className="heatmap-row">
              <span className="heatmap-key">{displayChar}</span>
              <div className="heatmap-bar-track">
                <div
                  className="heatmap-bar-fill"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="heatmap-count">{count}×</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
