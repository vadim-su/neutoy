let mediaRecorder;
let audioChunks = [];

document.getElementById('record-button').addEventListener('click', async () => {
    const recordButton = document.getElementById('record-button');
    try {
        if (recordButton.textContent === 'Start Recording') {
            // Start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                recordButton.textContent = 'Uploading...';
                recordButton.disabled = true;

                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.wav');

                try {
                    const response = await fetch('api/upload_audio', {
                        method: 'POST',
                        body: formData
                    });
                    const body = await response.json();
                    const user_request = document.getElementById('user-request')
                    user_request.value = body.translation
                } catch (error) {
                    console.error('Error uploading audio:', error);
                }
                stream.getTracks().forEach(track => track.stop());
                recordButton.textContent = 'Start Recording';
                recordButton.disabled = false;

            };

            recordButton.textContent = 'Stop Recording';
        } else {
            mediaRecorder.stop();
        }
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
});
