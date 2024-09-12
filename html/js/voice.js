import { submitButtonHandler } from "./submit.js    ";
import { createBubble } from "./bubbles.js";

let mediaRecorder;
let audioChunks = [];
let recordIsOn = false;

document.addEventListener("DOMContentLoaded", () => {
  const recordButton = document.getElementById("record-button");

  recordButton.addEventListener("click", async () => {
    await recordHandler(recordButton);
  });
});

export async function recordHandler() {
  try {
    if (!recordIsOn) {
      recordIsOn = true;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        recordIsOn = false;
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = [];
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
        } catch (error) {
          console.error("Error uploading audio:", error);
        }
        stream.getTracks().forEach((track) => track.stop());
        submitButtonHandler();
      };
    } else {
      mediaRecorder.stop();
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
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
