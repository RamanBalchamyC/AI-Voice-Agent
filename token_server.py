
from datetime import timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from livekit import api
from fastapi.middleware.cors import CORSMiddleware

from config import settings

app = FastAPI(title="Lauki Voice Agent Token API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TokenRequest(BaseModel):
    roomName: str
    participantName: str


@app.post("/api/livekit/token")
async def create_token(request: TokenRequest):
    room_name = request.roomName.strip()
    participant_name = request.participantName.strip()

    if not room_name or not participant_name:
        raise HTTPException(
            status_code=400,
            detail="Room name and participant name are required.",
        )

    try:
        token = (
            api.AccessToken(
                settings.livekit_api_key,
                settings.livekit_api_secret,
            )
            .with_identity(participant_name)
            .with_name(participant_name)
            .with_ttl(timedelta(minutes=10))
            .with_grants(
                api.VideoGrants(
                    room_join=True,
                    room=room_name,
                    can_publish=True,
                    can_subscribe=True,
                    can_publish_data=True,
                )
            )
            .to_jwt()
        )

        return {
            "serverUrl": settings.livekit_url,
            "token": token,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Could not create LiveKit access token.",
        )
