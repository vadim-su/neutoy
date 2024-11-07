class Speaker {
    constructor() {
        this.audio = null;
        this.audioContext = null;
        this.initialized = false;
    }

    async init() {
        if (!this.initialized) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        }
    }

    async playAudio(audioFile) {
        try {
            await this.init();
            
            if (this.audio) {
                this.stopAudio();
            }

            this.audio = new Audio(audioFile);
            await this.audioContext.resume();
            
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                await playPromise;
            }
        } catch (error) {
            console.error('Speaker playAudio error:', error);
        }
    }

    stopAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}

export default Speaker;