export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
}

export interface LiveKitTokenResponse {
  serverUrl?: string;
  url?: string;
  livekitUrl?: string;
  token: string;
}
