import { play_speech } from "./voice.js";
import { createBubble } from "./bubbles.js";
import {
  cleanup,
  clear,
  draw,
  set_button1_handler,
  set_button2_handler,
  set_pixel,
  set_timeout,
} from "./lib.js";

const LLM_URL = "api/produce_code";

const allowedFunctions = {
  clear,
  draw,
  set_pixel,
  set_button1_handler,
  set_button2_handler,
  set_timeout,
  cleanup,
};

export async function submitButtonHandler(submitButton, with_code) {
  if (submitButton) {
    submitButton.disabled = true;
  }

  const code_text = document.getElementById("code-text");

  if (with_code) {
    document.getElementById("user-code").value = code_text.value;
  }

  const { system_prompt, user_request, user_code } = get_prompts();

  const reason_text = document.getElementById("reasoning-text");
  const voiceover_text = document.getElementById("voiceover-text");
  const model_list = document.getElementById("llm-model");


  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_prompt: system_prompt,
      user_request: user_request + "\n\n **My code is:**\n\n " + user_code,
      model: model_list.value,
    }),
  });

  if (!response.ok) {
    if (submitButton) {
      submitButton.disabled = false;
    }
    throw new Error("Network response was not ok");
  }
  const resp_body = await response.json();
  console.log(resp_body);

  reason_text.value = resp_body.reason;
  voiceover_text.value = resp_body.voice_over;
  code_text.value = resp_body.code;
  createBubble(resp_body.voice_over, false);
  play_speech(resp_body.voice_over, resp_body.lang);
  run_code(resp_body.code);
  if (submitButton) {
    submitButton.disabled = false;
  }
}

function get_prompts() {
  const system_prompt = document.getElementById("system-prompt");
  const user_request = document.getElementById("user-request");
  const user_code = document.getElementById("user-code");
  createBubble(user_request.value, true);

  return {
    system_prompt: system_prompt.value,
    user_request: user_request.value,
    user_code: user_code.value,
  };
}

function run_code(code) {
  cleanup();
  const wrap = new Function(
    "functions",
    `with (functions) {
        ${code}
    }`,
  );

  return wrap(allowedFunctions);
}
