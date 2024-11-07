// interact.js
import { recordHandler } from './voice.js';

document.addEventListener('DOMContentLoaded', () => {
    const touchButton = document.getElementById('touch_button');
    const speakButton = document.getElementById('speak_button');
    const tapSound = document.getElementById('tapSound');

    function playTapSound() {
        tapSound.currentTime = 0;
        tapSound.play();
    }

    // Function to ensure recording stops
    const forceStopRecording = async () => {
        console.log('Force stopping recording');
        await recordHandler(false);
    };

    // Remove document-wide event listeners and only add them to speak button
    speakButton.addEventListener('mousedown', async (e) => {
        e.preventDefault();
        console.log('Speak button mousedown');
        playTapSound();
        await recordHandler(true);
    });

    speakButton.addEventListener('mouseup', async (e) => {
        e.preventDefault();
        console.log('Speak button mouseup');
        await recordHandler(false);
    });

    speakButton.addEventListener('touchstart', async (e) => {
        e.preventDefault();
        console.log('Speak button touchstart');
        playTapSound();
        await recordHandler(true);
    }, { passive: false });

    speakButton.addEventListener('touchend', async (e) => {
        e.preventDefault();
        console.log('Speak button touchend');
        await recordHandler(false);
    }, { passive: false });

    speakButton.addEventListener('touchcancel', async (e) => {
        e.preventDefault();
        console.log('Speak button touchcancel');
        await forceStopRecording();
    });

    // Safety: stop recording if touch moves out
    speakButton.addEventListener('touchmove', async (e) => {
        const touch = e.touches[0];
        const buttonRect = speakButton.getBoundingClientRect();
        
        if (touch.clientX < buttonRect.left || 
            touch.clientX > buttonRect.right || 
            touch.clientY < buttonRect.top || 
            touch.clientY > buttonRect.bottom) {
            console.log('Touch moved outside button');
            await forceStopRecording();
        }
    });

    // Keep these global safety events
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            await forceStopRecording();
        }
    });

    window.addEventListener('beforeunload', async () => {
        await forceStopRecording();
    });

    const infoToggle = document.getElementById('info-toggle');
    const projectInfo = document.getElementById('project-info');

    infoToggle.addEventListener('click', () => {
        projectInfo.classList.toggle('show');
    });
});