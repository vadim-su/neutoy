from __future__ import annotations

import base64
from dataclasses import dataclass
from typing import Any, BinaryIO

from replicate.client import Client

WHISPER_MODEL = 'openai/whisper:cdd97b257f93cb89dede1c7584e3f3dfc969571b357dbcee08e793740bedd854'


class WhisperService:
    """The Whisper service interaction class."""

    def __init__(self, api_key: str) -> None:
        """Initialize the Whisper service."""
        self.client = Client(api_key)

    async def get_voice_transcript(self, file: BinaryIO) -> VoiceTranscript:
        """Run the whisper model on the given audio data."""
        base64_data = base64.b64encode(file.read()).decode('utf-8')
        request = {
            'audio': f'data:application/octet-stream;base64,{base64_data}',
            'model': 'large-v3',
            'language': 'auto',
            'translate': True,
            'temperature': 0.1,
            'transcription': 'plain text',
            'suppress_tokens': '-1',
            'logprob_threshold': -1,
            'no_speech_threshold': 0.6,
            'condition_on_previous_text': True,
            'compression_ratio_threshold': 2.4,
            'temperature_increment_on_fallback': 0.2,
        }

        whisper_resp: Any = await self.client.async_run(
            WHISPER_MODEL,
            input=request,
        )

        return VoiceTranscript(
            text=whisper_resp['transcription'],
            language=whisper_resp['detected_language'],
        )


@dataclass
class VoiceTranscript:
    """The Whisper configuration dataclass."""

    text: str
    language: str
