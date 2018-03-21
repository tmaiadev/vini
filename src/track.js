const PLAY_ICON = '/assets/icon-play.svg';
const PAUSE_ICON = '/assets/icon-pause.svg';
const LOADING_ICON = '/assets/icon-loading.svg';

class Track {
    constructor(domElement, id) {
        this.id = id;
        this.$el = domElement;
        this.src = domElement.getAttribute('href');
        this.playing = false;
        this.loading = false;

        this.$el.addEventListener('click', this.click.bind(this));
        window.addEventListener('audio-playing', this.onAudioPlaying.bind(this));
        window.addEventListener('audio-paused', this.onAudioPause.bind(this));
        window.addEventListener('audio-can-play', this.onAudioCanPlay.bind(this));
    }

    click(evt) {
        evt.preventDefault();

        if (this.playing) {
            const event = new CustomEvent('audio-pause');
            window.dispatchEvent(event);
        } else {
            this.loading = true;
            this.renderPlayButton();

            const detail = this;
            const event = new CustomEvent('audio-play', { detail });
            window.dispatchEvent(event);
        }
    }

    onAudioPlaying(evt) {
        const src = evt.detail;
        this.playing = src === this;

        this.renderPlayButton();
    }

    onAudioCanPlay() {
        this.loading = false;
        this.renderPlayButton();
    }

    renderPlayButton() {
        const $el = this.$el.querySelector('.track__play-button__image');

        if (this.loading) {
            $el.src = '';
            $el.classList.add('track__play-button__image--spin');
            $el.src = LOADING_ICON;
        } else {
            $el.classList.remove('track__play-button__image--spin');
            $el.src = this.playing ?
                PAUSE_ICON : PLAY_ICON;
        }
    }

    onAudioPause() {
        this.playing = false;
        this.renderPlayButton();
    }
}

export default Track;