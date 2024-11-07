import { submitButtonHandler } from "./submit.js    ";
import { createBubble } from "./bubbles.js";

let mediaRecorder;
let audioChunks = [];
let recordingStream = null;
let isRecording = false;  // Add state tracking

export async function recordHandler(startRecording) {
    try {
        if (startRecording && !isRecording) {  // Only start if not already recording
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

export async function play_speech(text, lang) {
    try {
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
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Add error handling
        audio.onerror = (e) => {
            console.error('Audio playback error:', e);
        };

        // Handle mobile autoplay restrictions
        const playAudio = async () => {
            try {
                // Set audio context to resume after user interaction
                if (window.AudioContext || window.webkitAudioContext) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioContext.state === 'suspended') {
                        await audioContext.resume();
                    }
                }
                
                // Play with user gesture requirement handling
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Audio playback started successfully');
                        })
                        .catch(error => {
                            console.error('Playback error:', error);
                            // If autoplay was prevented, we can show a play button or retry
                            if (error.name === 'NotAllowedError') {
                                console.log('Autoplay prevented - requires user interaction');
                            }
                        });
                }
            } catch (error) {
                console.error('Error in playAudio:', error);
            }
        };

        // Ensure audio can play on mobile
        audio.load();
        await playAudio();
        
        // Clean up URL after playback
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
        };

    } catch (error) {
        console.error('Error in play_speech:', error);
    }
}