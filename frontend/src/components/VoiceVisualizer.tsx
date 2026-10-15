import type { CSSProperties } from 'react';

interface VoiceVisualizerProps { active: boolean }

export default function VoiceVisualizer({ active }: VoiceVisualizerProps) {
  return (
    <div className={`visualizer ${active ? 'is-active' : ''}`} aria-label={active ? 'Voice session active' : 'Voice session inactive'}>
      {Array.from({ length: 35 }, (_, index) => (
        <span key={index} style={{ '--bar-index': index } as CSSProperties} />
      ))}
    </div>
  );
}
