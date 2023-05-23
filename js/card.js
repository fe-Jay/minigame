// Game Constants
const gameElements = {
    gameTimer: document.querySelector('.game-timer'),
    gameBoard: document.querySelector('.game-board'),
    dialog: document.querySelector('#dialog-default'),
    restart: document.querySelector('.restart'),
};

let gameStatus = {
    clickPause: false,
    matchedCount: 0,
    cards: null,
    cardOne: null,
    cardTwo: null,
    time: null
};

// ? 두 가지 요소를 비교하는 방법으로 item 객체를 만드는 게 최선일까?
let item = [
    { id: 1, idx: "1" },
    { id: 2, idx: "2" },
    { id: 3, idx: "3" },
    { id: 4, idx: "4" },
    { id: 5, idx: "5" },
    { id: 6, idx: "0" },
    { id: 7, idx: "1" },
    { id: 8, idx: "2" },
    { id: 9, idx: "3" },
    { id: 10, idx: "4" },
    { id: 11, idx: "5" },
    { id: 12, idx: "0" },
]

let gameResults = {
    cleared: {
        msg: 'Cleared',
        img: 'result-win.gif',
        sound: new Audio('../asset/sound/win.wav')
    },
    failed: {
        msg: 'Failed',
        img: 'result-lose.gif',
        sound: new Audio('../asset/sound/lose.wav')
    },
    playSound: function (result) {
        this[result].play();
    }
};

// 게임 상태 구조 분해 할당
let { cleared, failed } = gameResults;
let { gameTimer, gameBoard, dialog, restart } = gameElements;
let { clickPause, matchedCount, cards, cardOne, cardTwo, time } = gameStatus;

// 게임 사운드
const start = new Audio('../asset/sound/start.wav');




/**
 * 1. 카드 랜덤 배치
 * @param {Array} item 카드 배열
 * @returns {Array} item 카드 배열
 * @description item 객체의 순서를 변경해서 0 이상 1 미만의 부동소수점 난수 값을 반환.
 * @description -0.5는 반환되는 난수의 중간 값, .sort() 메서드로 매번 랜덤 한 값으로 정렬시켜 섞어준다.
 */
const shuffleCards = () => {
    item.sort(() => Math.random() - 0.5);
}



/**
 * 2. DOM 제어로 카드 생성
 * @param {Array} item 카드 배열
 * @description 카드를 순회하면서 카드를 생성하고, 카드의 앞면과 뒷면을 생성하고  $gameBoard에 추가.
 */
const renderCards = () => {
    // 초기화
    gameBoard.innerHTML = '';

    // 카드 생성
    for (let i = 0; i < item.length; i++) {
        const $createCard = document.createElement('div');
        const $front = document.createElement('div');
        const $back = document.createElement('div');
        const $img = document.createElement('img');
        $createCard.classList.add('card', 'nes-container', 'is-rounded');

        $front.classList.add('front');
        $front.append($img);
        $img.setAttribute('src', `../asset/img/user-${item[i].idx}.png`);

        $back.classList.add('back');
        $back.innerText = '?';

        gameBoard.append($createCard);
        $createCard.append($front, $back);

        addCardClickEvent();
    }
};



/**
 * 3. 카드 미리보기
 * @param {Array} cards 카드 배열
 * @description 카드를 순회하면서 카드 앞면을 보여하고 2초 후 뒷면으로 뒤집기.
 */
const showCards = () => {
    cards = document.querySelectorAll('.card');
    // 카드를 순회하면서 show class 추가
    cards.forEach((card, index) => {
        // 카드에 data-id 속성 추가
        card.dataset.idx = item[index].idx;

        setTimeout(() => {
            card.classList.add('show');
        }, index * 80)
        setTimeout(() => {
            card.classList.remove('show');
        }, 2000)
    })
};



/**
 * 4. 카운트다운 타이머
 * @description 30초 카운트다운 후 clearInterval() 메서드로 타이머 제거 후 게임 재시작 팝업창 띄우기
 */
const startTimer = () => {
    let count = 30;
    time = setInterval(() => {
        count--;
        gameTimer.innerText = count;
        if (count === 0) {
            endGame(failed);
        }
    }, 1000)
};



/**
 * 5. 카드 뒤집기 게임 실행
 * @param {*} event
 * @return {*} cards 카드 배열
 * @description 카드를 순회하면서 클릭이벤트가 발생하면 두 카드를 비교하고 match되면 matchCard() 함수 실행.
 */
const flipCard = (event) => {
    let clickedCard = event.target.closest('.card');
    // cardOne의 값이 비어있는 상태이며, clickPause가 false일 때만 실행
    if (cardOne !== clickedCard && !clickPause) {
        clickedCard.classList.add('show');

        // 카드를 2번 클릭했을 때만 cardOne에 값이 들어가도록 cardOne이 비어있는지 확인
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        clickPause = true;

        // cardOne, cardTwo의 data-idx 값을 가져와서 matchCards() 함수 실행
        matchCards(cardOne.dataset.idx, cardTwo.dataset.idx)
    }
};



/**
 * 6. 카드 매칭
 * @param {one, two}
 * @return {*} equals() or differs()
 * @description cardOne, cardTwo의 data-id 값이 같으면 equals() 함수 실행, 다르면 differs() 함수 실행
 */
const matchCards = (one, two) => {
    if (one === two) {
        return equals();
    }
    return differs();
}



/**
 * 7-1. 카드 매칭 성공 시
 * @return {*} 초기화된 cardOne, cardTwo
 * @description Match된 카드는 클릭 이벤트를 제거하고 Count 1씩 증가.
 */
function equals() {
    // ? 이벤트를 cardOne, cardTwo 두 변수에 각각 주는 게 최선일까?
    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);
    matchedCount++;


    // Match된 카드가 6개가 되면 게임 종료
    if (matchedCount === 6) {
        endGame(cleared);
    }

    cardReset();
}



/**
 * 7-2. 카드 매칭 실패 시
 *  @return {*} 초기화된 cardOne, cardTwo
 *  @description Match되지 않으면 shake Css Animation 0.4초 동안 실행 후 카드 뒤집기.
 */
function differs() {
    setTimeout(() => {
        // ? 두 변수에 중복된 이벤트를 주다보니 코드가 지저분하다.
        // Match되지 않으면 shake Css Animation 0.4초 동안 실행
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        // 1초 후 shake, show class 제거해서 뒤집힌 카드로 원상복귀
        cardOne.classList.remove("shake", "show");
        cardTwo.classList.remove("shake", "show");
        cardReset();
    }, 1000);
}



/**
 * 7-3. 카드 초기화
 * @description cardOne, cardTwo, clickPause 초기화
 */
const cardReset = () => {
    cardOne = cardTwo = "";
    return clickPause = false;
}



/**
 * 8. 게임 종료
 * @description 게임이 종료되면 clearInterval() 메서드로 타이머 제거 후 게임 재시작 팝업창 띄우기
 * @param {*} cleared
 * @param {*} failed
*/
const endGame = result => {
    let resultMsg = dialog.querySelector('h3 span');
    let resultImg = dialog.querySelector('h3 img');
    resultImg.setAttribute('src', `../asset/img/${result.img}`);
    resultMsg.innerText = `Game ${result.msg}!`;
    result.sound.play();
    clearInterval(time);
    dialog.showModal();
}



/**
 * 9. 카드 클릭 이벤트
 * @param {*} event
 * @return {*} cards 카드 배열
*/
// 카드 클릭 이벤트
const addCardClickEvent = () => {
    // ? 변수를 중복해서 선언하는 게 최선일까? DOM으로 요소가 뿌려지기 전에 전역에서 선언하면 안 나옴...
    cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
};



/**
 * 10. 게임 시작 함수
 * @description 화면이 로드되거나 사용자가 재시작 버튼을 눌렀을 때 game() 함수 실행.
*/
const game = () => {
    // ? 이런식으로 랜더링을 함수로 빼는 게 최선일까?
    shuffleCards();
    renderCards();
    showCards();
    startTimer();
    addCardClickEvent();
}
game();



// 재시작 버튼 클릭 이벤트
restart.addEventListener('click', () => {
    start.play();
    cardReset();
    game();
});


/**
 * TodoList
 * 현재 함수 순서 배치가 효율적인지 확인
 * 변수를 효율적으로 선언 및 사용했는지 확인
 * 함수를 효율적으로 분리해서 배치했는지 확인
 * 함수를 효율적으로 작성했는지 확인
 */
