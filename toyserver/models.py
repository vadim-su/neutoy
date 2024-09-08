from pydantic import BaseModel


class LlmResponse(BaseModel, extra='allow'):
    """Response from the language model."""

    reason: str
    voice_over: str
    lang: str
    code: str


class LlmRequest(BaseModel):
    """Request to the language model."""

    system_prompt: str
    user_request: str
    model: str = 'claude-3-5-sonnet-20240620'


class SpeachTranscriptResponse(BaseModel):
    """Response from the speech recognition service."""

    transcript: str
    language: str


class TextToSpeechRequest(BaseModel):
    """Request to the text to speech service."""

    text: str
    lang: str
