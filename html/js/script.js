import { init_lib } from './lib.js';
import { submitButtonHandler } from './submit.js';

document.addEventListener('DOMContentLoaded', () => {
    init_lib();

    const submit_button = document.getElementById('submit-button');
    submit_button.addEventListener('click', () => submitButtonHandler(submit_button, false));


    const submit_button_with_code = document.getElementById('submit-button-with-code');
    submit_button_with_code.addEventListener('click', () => submitButtonHandler(submit_button_with_code, true));

    const rerun_button = document.getElementById('rerun-button');
    rerun_button.addEventListener('click', rerun_button_handler);
});



function rerun_button_handler() {
    const code_text = document.getElementById('code-text');
    run_code(code_text.value);
}
