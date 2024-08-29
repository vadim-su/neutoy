import os
from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, UploadFile
from fastapi.responses import JSONResponse

from toyserver.llms.anthropic import AnthropicInterface
from toyserver.llms.whisper import Whisper
from toyserver.models import LlmRequest, LlmResponse

# Create an instance of the FastAPI class
router = APIRouter(prefix='/api')


# Define a simple route

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')
REPLICATE_API_KEY = os.getenv('REPLICATE_API_KEY', '')

if not ANTHROPIC_API_KEY or not REPLICATE_API_KEY:
    raise ValueError('Please set the ANTHROPIC_API_KEY and REPLICATE_API_KEY environment variables.')


def anthropic_interface() -> AnthropicInterface:
    """Create an instance of the AnthropicInterface class."""
    return AnthropicInterface(ANTHROPIC_API_KEY)


def whisper() -> Whisper:
    """Create an instance of the Whisper class."""
    return Whisper(REPLICATE_API_KEY)


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


@router.post('/upload_audio')
async def upload_audio(whisper: Annotated[Whisper, Depends(whisper)], audio: UploadFile) -> JSONResponse:
    """Endpoint to receive an audio file."""
    try:
        result = await whisper.get_text(audio.file)
        return JSONResponse(content=result, status_code=200)
    except Exception as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)


app = FastAPI()
app.include_router(router)
