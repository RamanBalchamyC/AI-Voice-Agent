import { Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import Header from './components/Header';
import VoiceVisualizer from './components/VoiceVisualizer';
import StatusIndicator from './components/StatusIndicator';
import CallControls from './components/CallControls';
import TranscriptPanel from './components/TranscriptPanel';
import { useVoiceAgent } from './hooks/useVoiceAgent';

export default function App() {
  const voice = useVoiceAgent();
  const connected = voice.status === 'connected';

  return (
    <div className="app-shell" id="top">
      <Header />
      <main className="main-content">
        <div className="eyebrow"><Sparkles size={14} /> LAUKI VOICE AGENT</div>
        <h1>A voice that’s<br /><span>ready to help.</span></h1>
        <p className="intro">Have a natural conversation with Lauki Voice Agent.<br className="desktop-break" /> Just press start and speak normally.</p>

        <section className="voice-card">
          <div className="assistant-avatar"><div className="avatar-inner"><Headphones size={30} /></div><span className={`avatar-orbit ${connected ? 'orbit-active' : ''}`} /></div>
          <div className="assistant-name">Lauki Voice Agent</div>
          <StatusIndicator status={voice.status} />
          <VoiceVisualizer active={connected} />
          <CallControls status={voice.status} isMuted={voice.isMuted} onStart={() => void voice.startCall()} onEnd={() => void voice.endCall()} onToggleMute={() => void voice.toggleMute()} />
          {voice.error && <div className="error-message" role="alert">{voice.error}</div>}
          <div className="privacy-note"><ShieldCheck size={14} /> Your microphone is only enabled during a call.</div>
        </section>

        <TranscriptPanel lines={voice.transcript} />
        <footer className="footer"><span>Designed for natural conversations</span><span className="footer-dot">·</span><span>Powered by AI</span></footer>
      </main>
    </div>
  );
}
