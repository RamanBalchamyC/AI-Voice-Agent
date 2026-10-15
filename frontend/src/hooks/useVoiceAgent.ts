import { useCallback, useEffect, useRef, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { createRoom, fetchLiveKitCredentials, removeAttachedAudio } from '../services/livekit';
import type { ConnectionStatus, TranscriptLine } from '../types/voice';

export function useVoiceAgent() {
  const roomRef = useRef<Room | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTranscript = useCallback((speaker: string, text: string) => {
    setTranscript((current) => [
      ...current,
      { id: crypto.randomUUID(), speaker, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
  }, []);

  const endCall = useCallback(async () => {
    const room = roomRef.current;
    roomRef.current = null;
    if (room) await room.disconnect();
    removeAttachedAudio();
    setStatus('disconnected');
    setIsMuted(false);
  }, []);

  const startCall = useCallback(async () => {
    if (status === 'connecting' || status === 'connected') return;
    setError(null);
    setStatus('connecting');
    setTranscript([]);

    try {
      const { serverUrl, token } = await fetchLiveKitCredentials();
      const room = createRoom(addTranscript);
      roomRef.current = room;
      room.on(RoomEvent.Disconnected, () => {
        roomRef.current = null;
        removeAttachedAudio();
        setStatus('disconnected');
        setIsMuted(false);
      });
      await room.connect(serverUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
      setStatus('connected');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Could not connect to the voice agent.';
      setError(message);
      await endCall();
    }
  }, [addTranscript, endCall, status]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room || status !== 'connected') return;
    const nextMuted = !isMuted;
    await room.localParticipant.setMicrophoneEnabled(!nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted, status]);

  useEffect(() => () => {
    void roomRef.current?.disconnect();
    removeAttachedAudio();
  }, []);

  return { status, isMuted, transcript, error, startCall, endCall, toggleMute };
}
