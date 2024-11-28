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
            messages = [

                {
                    "role": "user",
                    "content": f'Task: {system_prompt}\n\nUser Request: {user_request}',
                }
            ]
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
            max_tokens=2000,
            messages=messages,
            response_format=LlmResponse,
        )

        return raw_resp.choices[0].message.parsed
