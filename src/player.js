const PLAY_ICON = '/assets/icon-play.svg';
const PAUSE_ICON = '/assets/icon-pause.svg';

class Player {
    constructor() {
        this.$el = document.querySelector('.player');
        this.$playButton = this.$el.querySelector('.play-button');
        this.$nextButton = this.$el.querySelector('.next-button');
        this.$navbar = this.$el.querySelector('.navbar');
        this.$lyricButton = this.$el.querySelector('.lyrics-button');
        this.$durationDisplay = this.$el.querySelector('.duration-display');
        
        this.playing = false;
        this.navbarShouldUpdate = true;
        this.navbarIsBeingDragged = false;
        this.navbarLastChange = 0;
        this.duration = 0;

        window.addEventListener('audio-playing', this.onAudioPlay.bind(this));
        window.addEventListener('audio-paused', this.onAudioPause.bind(this));
        window.addEventListener('audio-time-update', this.onAudioTimeUpdate.bind(this));
        window.addEventListener('mousemove', this.onNavbarDrag.bind(this));
        window.addEventListener('touchmove', this.onNavbarDrag.bind(this));
        window.addEventListener('mouseup', this.onNavbarRelease.bind(this));
        window.addEventListener('touchend', this.onNavbarRelease.bind(this));

        this.$playButton.addEventListener('click', this.onPlayButtonClick.bind(this));
        this.$nextButton.addEventListener('click', this.onNextButtonClick.bind(this));
        this.$navbar.addEventListener('change', this.onNavbarChange.bind(this));
        this.$navbar.addEventListener('mousedown', this.onNavbarStartDragging.bind(this));
        this.$navbar.addEventListener('touchstart', this.onNavbarStartDragging.bind(this));
    }

    onAudioPause() {
        this.playing = false;
        this.renderPlayButton();
    }

    onAudioPlay() {
        this.playing = true;
        this.showPlayer();
        this.renderPlayButton();
    }

    showPlayer() {
        this.$el.classList.add('player--active');
        this.$playButton.focus();
    }

    renderPlayButton() {
        this.$playButton.querySelector('img').src = this.playing ?
            PAUSE_ICON : PLAY_ICON;
    }

    onAudioTimeUpdate(evt) {
        const { duration, currentTime } = evt.detail;
        
        if (isNaN(duration)) {
            this.$navbar.value = 0;
        } else {
            if (this.navbarShouldUpdate) {
                const value = parseInt((currentTime / duration) * 100, 10);
                this.$navbar.value = value;
            }

            const dtCurrTime = new Date();
            dtCurrTime.setHours('0');
            dtCurrTime.setMinutes('0');
            dtCurrTime.setSeconds(Math.round(currentTime));
            const fCurrTime = `${('0' + dtCurrTime.getMinutes()).slice(-2)}:${('0' + dtCurrTime.getSeconds()).slice(-2)}`;

            this.$durationDisplay.innerHTML = `${fCurrTime}`;
        }
    }

    onPlayButtonClick() {
        let event;

        if (this.playing) {
            event = new CustomEvent('audio-pause');
        } else {
            event = new CustomEvent('audio-play');
        }

        window.dispatchEvent(event);
    }

    onNextButtonClick() {
        const event = new CustomEvent('playlist-next');
        window.dispatchEvent(event);
    }

    onNavbarChange() {
        this.navbarShouldUpdate = false;
        this.navbarLastChange = new Date();

        setTimeout(() => {
            const diff = new Date() - this.navbarLastChange;
            if (diff >= 450 || this.navbarIsBeingDragged) {

                const value = parseInt(this.$navbar.value, 10);
                const event = new CustomEvent('audio-jump', { detail: value });
                window.dispatchEvent(event);

                this.navbarShouldUpdate = true;
            }
        }, 500);
    }

    onNavbarStartDragging() {
        this.navbarShouldUpdate = false;
        this.navbarIsBeingDragged = true;
        this.navbarLastChange = new Date();
    }

    onNavbarDrag() {
        if ( ! this.navbarIsBeingDragged) return;
        this.navbarLastChange = new Date();
    }

    onNavbarRelease() {
        if ( ! this.navbarIsBeingDragged) return;
        this.navbarIsBeingDragged = false;
        this.navbarLastChange = new Date();
        this.$navbar.dispatchEvent(new Event('change'));
    }
}

export default new Player();