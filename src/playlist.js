import Track from './track';

class Playlist {
    constructor() {
        this.tracks = Array.from(document.querySelectorAll('.track'))
        .map(($track, index) => {
            return new Track($track, index)
        });

        this.currTrack = null;

        window.addEventListener('audio-play', this.onAudioPlay.bind(this));
        window.addEventListener('playlist-next', this.next.bind(this));
        window.addEventListener('audio-ended', this.next.bind(this));
    }

    onAudioPlay(evt) {
        this.currTrack = evt.detail;
    }

    next() {
        const currIndex = this.tracks.findIndex(t => t === this.currTrack);
        const nextTrack = this.tracks[currIndex + 1] || this.tracks[0];

        const event = new CustomEvent('audio-play', { detail: nextTrack });
        window.dispatchEvent(event);
    }
}

export default new Playlist();