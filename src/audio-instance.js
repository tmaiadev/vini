class AudioInstance {
    constructor() {
        this.audio = new Audio();
        this.track = null;

        window.addEventListener('audio-play', this.play.bind(this));
        window.addEventListener('audio-pause', this.pause.bind(this));
        window.addEventListener('audio-jump', this.jumpTo.bind(this));

        this.audio.addEventListener('playing', this.playing.bind(this));
        this.audio.addEventListener('pause', this.paused.bind(this));
        this.audio.addEventListener('timeupdate', this.timeUpdate.bind(this));
        this.audio.addEventListener('ended', this.ended.bind(this));
        this.audio.addEventListener('canplay', this.canPlay.bind(this));
    }

    play(evt) {
        this.track = evt.detail;
        if (this.track) this.audio.src = this.track.src;
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    playing() {
        const detail = this.track;
        const event = new CustomEvent('audio-playing', { detail });
        window.dispatchEvent(event);
    }

    paused() {
        const event = new CustomEvent('audio-paused');
        window.dispatchEvent(event);
    }

    jumpTo(event) {
        const percentage = event.detail * 0.01;
        const time = this.audio.duration * percentage;
        this.audio.currentTime = time;
    }

    timeUpdate() {
        const detail = {
            currentTime: this.audio.currentTime,
            duration: this.audio.duration
        };

        const event = new CustomEvent('audio-time-update', { detail });
        window.dispatchEvent(event);
    }

    ended() {
        const event = new CustomEvent('audio-ended');
        window.dispatchEvent(event);
    }

    canPlay() {
        const event = new CustomEvent('audio-can-play');
        window.dispatchEvent(event);
    }
}

export default new AudioInstance();