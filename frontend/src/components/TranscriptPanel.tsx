import { MessageSquareText } from 'lucide-react';
import type { TranscriptLine } from '../types/voice';

export default function TranscriptPanel({ lines }: { lines: TranscriptLine[] }) {
  return (
    <section className="transcript-card">
      <div className="section-heading">
        <div className="section-icon"><MessageSquareText size={17} /></div>
        <div><h2>Conversation transcript</h2><p>Your conversation appears here</p></div>
        <span className="line-count">{lines.length} {lines.length === 1 ? 'message' : 'messages'}</span>
      </div>
      <div className="transcript-body" aria-live="polite">
        {lines.length === 0 ? (
          <div className="empty-transcript"><div className="empty-icon"><MessageSquareText size={22} /></div><p>No messages yet</p><span>Start a conversation to see the transcript.</span></div>
        ) : lines.map((line) => (
          <article className="transcript-line" key={line.id}>
            <div className="transcript-meta"><strong>{line.speaker}</strong><time>{line.timestamp}</time></div>
            <p>{line.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
