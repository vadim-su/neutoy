import enum
from pydantic import BaseModel, Field


class LlmResponse(BaseModel, arbitrary_types_allowed=True):
    """Response from the language model."""

    reason: str = Field(description='Reasoning of your decisions.')
    voice_over: str = Field(
        description='Voice over to explain the reasoning for a kid.',
    )
    lang: str = Field(description='Language of the voice over, 2 letter code.')
    code: str = Field(description='Javascript code to control the device.')


@enum.unique
class LlmModel(enum.StrEnum):
    """Language model for the code generation."""

    ANTHROPIC_SONNET_3_5 = 'claude-3-5-sonnet-latest'
    ANTHROPIC_SONNET_3_5_OLD = 'claude-3-5-sonnet-20240620'
    ANTHROPIC_HAIKU_3_5 = 'claude-3-5-haiku-latest'
    OPENAI_GPT4O = 'gpt-4o'
    OPENAI_GPT4O_MINI = 'gpt-4o-mini'
    OPENAI_O1 = 'o1-preview'
    OPENAI_O1_MINI = 'o1-mini'


class LlmRequest(BaseModel):
    """Request to the language model."""

    system_prompt: str
    user_request: str
    model: LlmModel = LlmModel.ANTHROPIC_SONNET_3_5


class SpeachTranscriptResponse(BaseModel):
    """Response from the speech recognition service."""

    transcript: str
    language: str


class TextToSpeechRequest(BaseModel):
    """Request to the text to speech service."""

    text: str
    lang: str
