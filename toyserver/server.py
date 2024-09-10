from io import BytesIO
import json
import os
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse

from toyserver.models import LlmRequest, LlmResponse, SpeachTranscriptResponse, TextToSpeechRequest
from toyserver.services.anthropic import AnthropicInterface
from toyserver.services.gspeach import GoogleVoiceService
from toyserver.services.whisper import WhisperService

router = APIRouter(prefix='/api')


# Define a simple route
def get_cred_value(cred_name):
    cred = os.getenv(cred_name, '')
    if cred:
        return cred
    # ls of /run/secrets will raise an exception if the directory does not exist
    # print list of secrets
    with Path(f'/run/secrets/{cred_name.lower()}').open() as f:
        return f.read().strip()


ANTHROPIC_API_KEY = get_cred_value('ANTHROPIC_API_KEY')
REPLICATE_API_KEY = get_cred_value('REPLICATE_API_KEY')
GOOGLE_OAUTH_CONFIG = json.loads(get_cred_value('GOOGLE_OAUTH_CONFIG'))

print(type(GOOGLE_OAUTH_CONFIG))
print(GOOGLE_OAUTH_CONFIG)

if not ANTHROPIC_API_KEY or not REPLICATE_API_KEY:
    raise ValueError('Please set the ANTHROPIC_API_KEY and REPLICATE_API_KEY environment variables.')


def anthropic_interface() -> AnthropicInterface:
    """Create an instance of the AnthropicInterface class."""
    return AnthropicInterface(ANTHROPIC_API_KEY)


def whisper() -> WhisperService:
    """Create an instance of the WhisperService class."""
    return WhisperService(REPLICATE_API_KEY)


def google_voice_service() -> GoogleVoiceService:
    """Create an instance of the GoogleVoiceService class."""
    return GoogleVoiceService(GOOGLE_OAUTH_CONFIG)


@router.post('/produce_code')
async def produce_code(
    body: LlmRequest,
    llm_interface: Annotated[AnthropicInterface, Depends(anthropic_interface)],
) -> LlmResponse:
    """Produce code using the language model."""
    return await llm_interface.make_completion(
        system_prompt=body.system_prompt,
        user_request=body.user_request,
    )


@router.post('/recognize_speech')
async def recognize_speech(
    whisper: Annotated[WhisperService, Depends(whisper)],
    speach: UploadFile,
) -> SpeachTranscriptResponse | dict[str, str]:
    """Recognize the speech."""
    try:
        transcript = await whisper.get_voice_transcript(speach.file)
    except Exception as err:
        return JSONResponse(content={'error': str(err)}, status_code=500)

    return SpeachTranscriptResponse(
        transcript=transcript.text,
        language=transcript.language,
    )


@router.post('/synthesize_speech')
async def synthesize_speech(
    body: TextToSpeechRequest,
    google_voice: Annotated[GoogleVoiceService, Depends(google_voice_service)],
) -> bytes | dict[str, str]:
    """Synthesize the speech."""
    try:
        audio = await google_voice.text_to_speech(
            text=body.text,
            lang=body.lang,
        )
    except Exception as err:
        return JSONResponse(content={'error': str(err)}, status_code=500)

    audio_stream = BytesIO(audio)
    return StreamingResponse(audio_stream, media_type="audio/mpeg")


app = FastAPI()
app.include_router(router)
