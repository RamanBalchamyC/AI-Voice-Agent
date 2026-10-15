import { AudioLines, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="AI Voice home">
        <span className="brand-mark"><AudioLines size={21} /></span>
        <span>voice<span className="brand-accent">mate</span></span>
      </a>
      <div className="topbar-tag"><Sparkles size={14} /> AI VOICE ASSISTANT</div>
    </header>
  );
}
