# AI Voice Agent — React + Vite UI

A small React + TypeScript frontend starter for a Python voice-agent backend using LiveKit.

## Requirements
- Node.js 20 or newer
- Your Python backend running locally
- A backend endpoint that creates LiveKit access tokens

## Run locally (Windows PowerShell)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Backend contract

The frontend sends a `POST` request to `VITE_TOKEN_ENDPOINT` with:

```json
{
  "roomName": "voice-room-unique-id",
  "participantName": "Guest"
}
```

The endpoint should return:

```json
{
  "serverUrl": "wss://your-livekit-server",
  "token": "participant-access-token"
}
```

`url` or `livekitUrl` is also accepted instead of `serverUrl`.

Your Python backend must generate the token securely and configure CORS to allow your frontend origin. Your agent must join or be dispatched into the same LiveKit room. To display transcript messages, the agent must publish transcription using LiveKit's transcription events/data flow supported by your agent implementation.

## Important
- Never put LiveKit API secrets, Groq API keys, or other private credentials in `VITE_*` variables.
- The token endpoint shown here is an expected contract; it is not included in this frontend scaffold. Adapt `src/services/livekit.ts` to match your existing backend API if it uses a different route or response shape.
- Run `npm run build` to check the frontend production build.
