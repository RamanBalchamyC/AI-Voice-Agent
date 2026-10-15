import type { ConnectionStatus } from '../types/voice';

const labels: Record<ConnectionStatus, string> = {
  disconnected: 'Ready when you are',
  connecting: 'Connecting securely…',
  connected: 'You’re connected',
};

export default function StatusIndicator({ status }: { status: ConnectionStatus }) {
  return <div className={`status-line status-${status}`}><span className="status-dot" />{labels[status]}</div>;
}
