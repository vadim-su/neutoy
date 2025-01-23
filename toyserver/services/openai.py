from __future__ import annotations

from typing import cast

from anthropic import AsyncClient
from openai import AsyncOpenAI

from toyserver.models import LlmModel, LlmResponse


class OpenaiInterface:
    """Interface to interact with the OpenAI API."""

    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def make_completion(
        self,
        system_prompt: str,
        user_request: str,
        model: LlmModel,
    ) -> LlmResponse:
        """Make a completion request to the OpenAI API."""

        if model in {LlmModel.OPENAI_O1, LlmModel.OPENAI_O1_MINI}:
            system_prompt += """
                Response should be in the following json format (only json, no add any other characters like ```json):
                {
                    "reason": "Reasoning of your decisions.",
                    "voice_over": "Voice over to explain the reasoning for a kid on user language.",
                    "lang": "en",
                    "code": "Python code to control the device. Raw code without ```"
                }
            """
            messages = [
                {
                    "role": "user",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_request,
                }
            ]
            raw_resp = await self.client.beta.chat.completions.parse(
                model=model,
                messages=messages,  # type: ignore
            )
            content = raw_resp.choices[0].message.content

            return LlmResponse.model_validate_json(content)
        else:
            messages = [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_request,
                }
            ]

            raw_resp = await self.client.beta.chat.completions.parse(
                model=model,
                messages=messages,
                response_format=LlmResponse,
            )

            return raw_resp.choices[0].message.parsed
