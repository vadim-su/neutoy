import { submitButtonHandler } from "./submit.js    ";
import { createBubble } from "./bubbles.js";

let mediaRecorder;
let audioChunks = [];
let recordingStream = null;
let isRecording = false;  // Add state tracking


let audioContext = null;
let hasAudioPermissions = false;

// Initialize audio context and request permissions
async function initAudioSystem() {
    try {
        // Create audio context if not exists
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.resume();
        }
        
        // Request both microphone and audio playback permissions together
        if (!hasAudioPermissions) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            hasAudioPermissions = true;
            // Stop the stream right away as we just needed it for permissions
            stream.getTracks().forEach(track => track.stop());
        }
        
        return true;
    } catch (error) {
        console.error('Error initializing audio system:', error);
        return false;
    }
}


export async function recordHandler(startRecording) {
    try {
        if (startRecording && !isRecording) {  // Only start if not already recording
            // Initialize audio system first
            await initAudioSystem();

            isRecording = true;
            // Start recording
            audioChunks = []; // Clear previous chunks
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recordingStream = stream;
            
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                isRecording = false;  // Reset recording state
                if (audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                    const formData = new FormData();
                    formData.append("speach", audioBlob, "recording.wav");

                    try {
                        const response = await fetch("api/recognize_speech", {
                            method: "POST",
                            body: formData,
                        });
                        const body = await response.json();
                        const user_request = document.getElementById("user-request");
                        user_request.value = body.transcript;

                        createBubble(body.transcript, true);
                        submitButtonHandler();
                    } catch (error) {
                        console.error("Error uploading audio:", error);
                    }
                }
                // Clean up the stream
                if (recordingStream) {
                    recordingStream.getTracks().forEach(track => track.stop());
                    recordingStream = null;
                }
            };

            mediaRecorder.start();
            console.log('Recording started');  // Debug log
            
        } else if (!startRecording && isRecording) {  // Only stop if currently recording
            console.log('Stopping recording');  // Debug log
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                isRecording = false;  // Reset recording state
            }
        }
    } catch (error) {
        console.error("Error in recordHandler:", error);
        isRecording = false;  // Reset state on error
    }
}

// Modified play_speech function
export async function play_speech(text, lang) {
    console.log('Starting play_speech with text:', text);
    try {
        if (!hasAudioPermissions) {
            await initAudioSystem();
        }
        
        console.log('Fetching speech from API');
        const response = await fetch("api/synthesize_speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                lang: lang,
            }),
        });
        console.log('API response received');

        const audioBlob = await response.blob();
        console.log('Audio blob size:', audioBlob.size);
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio();
        
        // Set up event listeners before setting source
        audio.addEventListener('canplay', () => {
            console.log('Audio can play');
        });
        
        audio.addEventListener('playing', () => {
            console.log('Audio started playing');
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Error code:', audio.error ? audio.error.code : 'unknown');
        });
        
        audio.addEventListener('ended', () => {
            console.log('Audio playback ended');
            URL.revokeObjectURL(audioUrl);
        });

        // Try to play immediately after loading
        audio.addEventListener('loadeddata', async () => {
            console.log('Audio data loaded, attempting to play');
            try {
                await audio.play();
                console.log('Play command issued successfully');
            } catch (error) {
                console.error('Error during play:', error);
                
                // Fallback for mobile: create and click a temporary button
                if (error.name === 'NotAllowedError') {
                    console.log('Attempting mobile fallback playback');
                    const tempButton = document.createElement('button');
                    tempButton.style.position = 'fixed';
                    tempButton.style.top = '0';
                    tempButton.style.zIndex = '9999';
                    tempButton.textContent = 'Tap to play audio';
                    
                    tempButton.addEventListener('touchend', async () => {
                        try {
                            await audio.play();
                            tempButton.remove();
                        } catch (e) {
                            console.error('Fallback playback failed:', e);
                        }
                    });
                    
                    document.body.appendChild(tempButton);
                }
            }
        });

        // Set the source last
        audio.src = audioUrl;
        audio.load();

    } catch (error) {
        console.error('Fatal error in play_speech:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio on any user interaction
    const initAudioOnInteraction = async () => {
        console.log('User interaction detected');
        await initAudioContext();
        // Remove listeners after first interaction
        ['touchstart', 'touchend', 'click', 'mousedown'].forEach(event => {
            document.removeEventListener(event, initAudioOnInteraction);
        });
    };

    ['touchstart', 'touchend', 'click', 'mousedown'].forEach(event => {
        document.addEventListener(event, initAudioOnInteraction);
    });
});