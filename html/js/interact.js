import { recordHandler } from './voice.js';

document.addEventListener('DOMContentLoaded', () => {
    const touchButton = document.getElementById('touch_button');
    const speakButton = document.getElementById('speak_button');
    const tapSound = document.getElementById('tapSound');

    function playTapSound() {
        tapSound.currentTime = 0; // Reset the audio to the beginning
        tapSound.play();
    }

    touchButton.addEventListener('mousedown', playTapSound);
    speakButton.addEventListener('mousedown', playTapSound);

    speakButton.addEventListener('mousedown', () => {
        recordHandler();
    });

    speakButton.addEventListener('mouseup', () => {
        recordHandler();
    });

    const infoToggle = document.getElementById('info-toggle');
    const projectInfo = document.getElementById('project-info');

    infoToggle.addEventListener('click', () => {
        projectInfo.classList.toggle('show');
    });
});
