from __future__ import annotations

from typing import cast

from anthropic import AsyncClient
from anthropic.types.message_create_params import ToolChoiceToolChoiceTool
from anthropic.types.message_param import MessageParam
from anthropic.types.tool_param import ToolParam
from anthropic.types.tool_use_block import ToolUseBlock

from toyserver.models import LlmResponse


class AnthropicInterface:
    """Interface to interact with the Anthropic API."""

    def __init__(self, api_key: str):
        self.client = AsyncClient(api_key=api_key)

    async def make_completion(
        self,
        system_prompt: str,
        user_request: str,
        model: str = 'claude-3-5-sonnet-20240620',
    ) -> LlmResponse:
        """Make a completion request to the Anthropic API."""
        raw_resp = await self.client.messages.create(
            model=model,
            max_tokens=2000,
            system=system_prompt,
            messages=[MessageParam(content=user_request, role='user')],
            tools=[
                ToolParam(
                    name='device_controller',
                    description='Validate to see if the response is appropriate. Your reasoning and code will be used to control the device.',
                    input_schema={
                        'type': 'object',
                        'properties': {
                            'reason': {
                                'type': 'string',
                                'description': 'Reasoning of your decisions.',
                            },
                            'voice_over': {
                                'type': 'string',
                                'description': 'Voice over to explain the reasoning for a kid.',
                            },
                            'code': {
                                'type': 'string',
                                'description': 'Javascript code to control the device.',
                            },
                        },
                    },
                ),
            ],
            tool_choice=ToolChoiceToolChoiceTool(
                name='device_controller',
                type='tool',
            ),
        )
        tool_resp = cast(ToolUseBlock, raw_resp.content[0])

        return LlmResponse.model_validate(tool_resp.input)
