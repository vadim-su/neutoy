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

    // Desktop events
    speakButton.addEventListener('mousedown', async (e) => {
        e.preventDefault();
        playTapSound();
        await recordHandler(true);
    });

    speakButton.addEventListener('mouseup', async (e) => {
        e.preventDefault();
        await recordHandler(false);
    });

    // Mobile touch events with additional safety
    speakButton.addEventListener('touchstart', async (e) => {
        e.preventDefault(); // Prevent default to avoid double-firing
        playTapSound();
        await recordHandler(true);
    }, { passive: false }); // Ensure preventDefault works

    speakButton.addEventListener('touchend', async (e) => {
        e.preventDefault();
        await recordHandler(false);
    }, { passive: false });

    // Additional safety events for mobile
    speakButton.addEventListener('touchcancel', async (e) => {
        e.preventDefault();
        await forceStopRecording();
    }, { passive: false });

    // If touch moves out of button
    speakButton.addEventListener('touchmove', async (e) => {
        const touch = e.touches[0];
        const buttonRect = speakButton.getBoundingClientRect();
        
        // If touch moves outside button bounds
        if (touch.clientX < buttonRect.left || 
            touch.clientX > buttonRect.right || 
            touch.clientY < buttonRect.top || 
            touch.clientY > buttonRect.bottom) {
            await forceStopRecording();
        }
    }, { passive: true });

    // Global safety net
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            await forceStopRecording();
        }
    });

    // Backup cleanup when page is unloaded
    window.addEventListener('beforeunload', async () => {
        await forceStopRecording();
    });

    const infoToggle = document.getElementById('info-toggle');
    const projectInfo = document.getElementById('project-info');

    infoToggle.addEventListener('click', () => {
        projectInfo.classList.toggle('show');
    });
});