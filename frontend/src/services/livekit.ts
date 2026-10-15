import { Room, RoomEvent, Track, type TranscriptionSegment } from 'livekit-client';
import type { LiveKitTokenResponse } from '../types/voice';

const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT ?? 'http://localhost:8000/api/livekit/token';

export async function fetchLiveKitCredentials(): Promise<{ serverUrl: string; token: string }> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomName: `voice-room-${crypto.randomUUID()}`,
      participantName: 'Guest',
    }),
  });

  if (!response.ok) {
    throw new Error(`Token endpoint failed (${response.status}). Check your Python backend.`);
  }

  const data = (await response.json()) as LiveKitTokenResponse;
  const serverUrl = data.serverUrl ?? data.livekitUrl ?? data.url;
  if (!serverUrl || !data.token) {
    throw new Error('Token response must include serverUrl (or url) and token.');
  }
  return { serverUrl, token: data.token };
}

export function createRoom(onTranscript: (speaker: string, text: string) => void): Room {
  const room = new Room({ adaptiveStream: true, dynacast: true });

  room.on(RoomEvent.TrackSubscribed, (track, _publication, _participant) => {
    if (track.kind === Track.Kind.Audio) {
      const audio = track.attach();
      audio.dataset.livekitAudio = 'true';
      document.body.appendChild(audio);
    }
  });

  room.on(RoomEvent.TrackUnsubscribed, (track) => {
    track.detach().forEach((element) => element.remove());
  });

  room.on(RoomEvent.TranscriptionReceived, (segments: TranscriptionSegment[], participant) => {
    const text = segments.map((segment) => segment.text).join('').trim();
    if (text) onTranscript(participant?.identity ?? 'Assistant', text);
  });

  return room;
}

export function removeAttachedAudio(): void {
  document.querySelectorAll<HTMLAudioElement>('audio[data-livekit-audio="true"]').forEach((audio) => audio.remove());
}
