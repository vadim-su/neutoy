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
    audio.play();
}
