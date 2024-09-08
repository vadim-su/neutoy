from typing import BinaryIO

from google.cloud import speech, texttospeech
from google.oauth2 import service_account


class GoogleVoiceService:
    """The Google Voice Service interaction class."""

    def __init__(self, cred_config: dict[str, str]) -> None:
        """Initialize the Google Voice Service.

        Args:
            cred_config (dict[str, str]): The credentials configuration.
        """
        credentials = service_account.Credentials.from_service_account_info(cred_config)
        self.tts_client = texttospeech.TextToSpeechClient(credentials=credentials)
        self.client = speech.SpeechClient(credentials=credentials)

    async def get_voice_transcript(self, stream: BinaryIO) -> str:
        """Get the transcript of the voice."""
        audio = speech.RecognitionAudio(content=stream.read())
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US',
        )

        response = self.client.recognize(config=config, audio=audio)
        return response.results[0].alternatives[0].transcript

    async def text_to_speech(self, text: str, lang: str) -> bytes:
        """Get the audio from the text."""
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=lang,
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
        )
        response = self.tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
        )
        return response.audio_content
