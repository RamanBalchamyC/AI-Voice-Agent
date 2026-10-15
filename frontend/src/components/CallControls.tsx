import { LoaderCircle, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import type { ConnectionStatus } from '../types/voice';

interface Props {
  status: ConnectionStatus;
  isMuted: boolean;
  onStart: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

export default function CallControls({ status, isMuted, onStart, onEnd, onToggleMute }: Props) {
  const busy = status === 'connecting';
  const connected = status === 'connected';
  return (
    <div className="call-controls">
      {!connected ? (
        <button className="call-button start-button" onClick={onStart} disabled={busy}>
          {busy ? <LoaderCircle className="spin" size={19} /> : <Phone size={19} />}
          {busy ? 'Connecting' : 'Start conversation'}
        </button>
      ) : (
        <>
          <button className={`icon-button ${isMuted ? 'muted' : ''}`} onClick={onToggleMute} aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button className="call-button end-button" onClick={onEnd}><PhoneOff size={19} /> End call</button>
        </>
      )}
    </div>
  );
}
