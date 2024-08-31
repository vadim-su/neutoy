import { init_lib, clear, draw, set_pixel, set_button_handler, set_timeout, cleanup } from './lib.js';
const LLM_URL = 'api/produce_code';


const allowedFunctions = {
    clear,
    draw,
    set_pixel,
    set_button_handler,
    set_timeout,
    cleanup
};

document.addEventListener('DOMContentLoaded', () => {
    init_lib();

    const submit_button = document.getElementById('submit-button');
    submit_button.addEventListener('click', submit_button_handler);

    const rerun_button = document.getElementById('rerun-button');
    rerun_button.addEventListener('click', rerun_button_handler);
});

async function submit_button_handler() {
    const submit_button = document.getElementById('submit-button');
    submit_button.disabled = true;
    const { system_prompt, user_request } = get_prompts();

    const reason_text = document.getElementById('reasoning-text');
    const code_text = document.getElementById('code-text');

    const response = await fetch(LLM_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            system_prompt: system_prompt,
            user_request: user_request,
        })
    })

    submit_button.disabled = false;
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const resp_body = await response.json();
    console.log(resp_body);

    reason_text.value = resp_body.reason;
    code_text.value = resp_body.code
    run_code(resp_body.code);
}

function rerun_button_handler() {
    const code_text = document.getElementById('code-text');
    run_code(code_text.value);
}

function get_prompts() {
    const system_prompt = document.getElementById('system-prompt')
    const user_request = document.getElementById('user-request')
    return {
        system_prompt: system_prompt.value,
        user_request: user_request.value
    }
}

function run_code(code) {
    cleanup();
    const wrap = new Function('functions',
        `with (functions) {
                ${code}
            }`
    );

    return wrap(allowedFunctions);
};
