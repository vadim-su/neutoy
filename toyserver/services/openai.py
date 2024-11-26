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

        raw_resp = await self.client.beta.chat.completions.parse(
            model=model,
            max_tokens=2000,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_request,
                }
            ],
            response_format=LlmResponse,
        )

        return raw_resp.choices[0].message.parsed
