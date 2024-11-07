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

    // When button is PRESSED DOWN - startRecording = true
    speakButton.addEventListener('mousedown', async (e) => {
        e.preventDefault();
        console.log('Button pressed - starting recording'); // Debug log
        await recordHandler(true);  // HERE - startRecording is TRUE
    });
    
    // When button is RELEASED - startRecording = false
    speakButton.addEventListener('mouseup', async (e) => {
        e.preventDefault();
        console.log('Button released - stopping recording'); // Debug log
        await recordHandler(false);  // HERE - startRecording is FALSE
    });

    // Same for touch events on mobile
    speakButton.addEventListener('touchstart', async (e) => {
        e.preventDefault();
        console.log('Touch started - starting recording'); // Debug log
        await recordHandler(true);  // HERE - startRecording is TRUE
    });

    speakButton.addEventListener('touchend', async (e) => {
        e.preventDefault();
        console.log('Touch ended - stopping recording'); // Debug log
        await recordHandler(false);  // HERE - startRecording is FALSE
    });

    speakButton.addEventListener('mouseup', async () => {
        await recordHandler(false); // Stop recording and send
    });

    speakButton.addEventListener('mouseleave', async () => {
        await recordHandler(false); // Stop recording if mouse leaves button
    });

    const infoToggle = document.getElementById('info-toggle');
    const projectInfo = document.getElementById('project-info');

    infoToggle.addEventListener('click', () => {
        projectInfo.classList.toggle('show');
    });
});
