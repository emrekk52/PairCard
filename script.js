class Sound {
    constructor() {
        this.game_music = new Audio('Assets/Audio/game_music.mp3');
        this.game_music.loop = true;
        this.clickAudio = new Audio('Assets/Audio/click.wav');
        this.failAudio = new Audio('Assets/Audio/fail.wav');
        this.wrongAudio = new Audio('Assets/Audio/wrong.wav');
        this.pairAudio = new Audio('Assets/Audio/pair.wav');
        this.winAudio = new Audio('Assets/Audio/win.wav');

    }

    click() {
        this.clickAudio.play();
    }
    wrong() {
        this.wrongAudio.play();
    }
    win() {
        this.stopGameMusic();
        this.winAudio.play();
    }
    gameOver() {
        this.stopGameMusic();
        this.failAudio.play();
    }
    pair() {
        this.pairAudio.play();
    }


    startGameMusic() {
        this.game_music.play();
    }
    stopGameMusic() {
        this.game_music.currentTime = 0;
        this.game_music.pause();
    }

}

class PairCard {



    constructor(totalTime, cards) {
        this.time = "";
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.second = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.soundController = new Sound();
    }

    startGame() {
        this.totalClicks = 0;
        this.second = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.soundController.startGameMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 400)
        this.hideCards();
        this.timer.innerText = '0' + parseInt(this.second / 60) + '.00';
        this.ticker.innerText = this.totalClicks;
    }


    startCountdown() {
        return setInterval(() => {
            this.second--;
            if (this.second % 60 >= 10) {
                this.time = '0' + parseInt(this.second / 60) + '.' + (this.second % 60);
                this.timer.innerText = '0' + parseInt(this.second / 60) + '.' + (this.second % 60);
            }
            else {

                this.time = '0' + parseInt(this.second / 60) + '.0' + (this.second % 60);
                this.timer.innerText = '0' + parseInt(this.second / 60) + '.0' + (this.second % 60);
            }

            if (this.second === 0)
                this.gameOver();


        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.soundController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    win() {
        clearInterval(this.countdown);
        this.soundController.win();
        document.getElementById('win-text').innerHTML = "SKORUN : " + this.totalClicks + "<br>" + "<span  class='overlay-text-small'>Kalan zaman: " + this.time + "</span>" + "<br>" + "<span  class='overlay-text-small'>Tekrar oynamak i??in dokun</span>";
        document.getElementById('win-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.soundController.click();
            this.ticker.innerText = ++this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck != null) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if (this.getCardFilePath(card) === this.getCardFilePath(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.soundController.pair();
        if (this.matchedCards.length === this.cardsArray.length)
            this.win();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        this.soundController.wrong();
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardFilePath(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
    shuffleCards(cardsArray) {
        for (let i = 0; i < cardsArray.length; i++) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new PairCard(120, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

}



var _CONTENT = [
    "Kategorini se??",
    "E??le??tirmeye ba??la",
    "Skorunu topla",
    "Oyunun tad??n?? ????kar!",
    "Emre K??????k.."
];


var _PART = 0;


var _PART_INDEX = 0;


var _INTERVAL_VAL;


var _ELEMENT = document.querySelector("#text");

var _CURSOR = document.querySelector("#cursor");


function Type() {
    var text = _CONTENT[_PART].substring(0, _PART_INDEX + 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX++;

    if (text === _CONTENT[_PART]) {
        _CURSOR.style.display = 'none';

        clearInterval(_INTERVAL_VAL);
        setTimeout(function () {
            _INTERVAL_VAL = setInterval(Delete, 50);
        }, 1000);
    }
}

function Delete() {
    var text = _CONTENT[_PART].substring(0, _PART_INDEX - 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX--;

    if (text === '') {
        clearInterval(_INTERVAL_VAL);

        if (_PART == (_CONTENT.length - 1))
            _PART = 0;
        else
            _PART++;

        _PART_INDEX = 0;

        setTimeout(function () {
            _CURSOR.style.display = 'inline-block';
            _INTERVAL_VAL = setInterval(Type, 100);
        }, 200);
    }
}

_INTERVAL_VAL = setInterval(Type, 100);









