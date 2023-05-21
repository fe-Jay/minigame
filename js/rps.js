// 화면 조작 관련 변수
const $screen = document.querySelector('#wrap');
const $dialog = document.querySelector('#dialog-default')
const $pc = $screen.querySelector('.pc span');
const $user = $screen.querySelector('.user span');
const $userImg = $screen.querySelector('.userImg');
const $btn = $screen.querySelector('.selectItem');
const $score = $screen.querySelector('.score');

// 점수 산정 관련 변수
const $result = $screen.querySelector('.score h3 span');
const $resultEmoji = $screen.querySelector('.score h3 img');
const $pcScore = $screen.querySelector('.pc-score');
const $userScore = $screen.querySelector('.user-score');
const $restart = $screen.querySelector('.restart');


// 게임 데이터
const casesArr = ['가위', '바위', '보'];
const resultArr = ['draw', 'lose', 'win']

// 게임 사운드
const win = new Audio('../asset/sound/win.wav');
const lose = new Audio('../asset/sound/lose.wav');
const draw = new Audio('../asset/sound/draw.wav');
const start = new Audio('../asset/sound/start.wav');

let interval;


/**
 * 1. 컴퓨터와 가위바위보 게임 시작
 * @param {String} userSelect 사용자가 선택한 가위바위보
 * @returns {Function} pcSelect 함수
 * @description - setInterval() 함수로 랜덤 index에 해당하는 랜덤 배열 값을 화면에 textContents로 넣어준다.
 **/
const startGame = () => {
    // pc가 랜덤으로 가위바위보 선택
    const pcSelect = () => {
        let randomCase = casesArr[parseInt(Math.random() * casesArr.length)];
        $pc.textContent = randomCase;
        replaceEmoji($pc)
    }
    // pcSelect 함수를 0.1초마다 실행
    interval = setInterval(pcSelect, 100);
}

const endGame = () => {
    // setInterval() 함수 종료
    clearInterval(interval);
}

const replayGame = () => {
    $result.textContent = '';
    startGame();
}


/**
 * 2. name을 인자로 받아, textContent에 따라 emoji를 변경.
 * @param {*} name
 * @description - classList를 추가하여 css에서 background-image를 변경.
 */
const replaceEmoji = name => {
    if (name.textContent === '가위') {
        name.parentElement.classList.add('item-scissors');
        name.parentElement.classList.remove('item-paper') || name.parentElement.classList.remove('item-rock');
    } else if (name.textContent === '바위') {
        name.parentElement.classList.add('item-rock');
        name.parentElement.classList.remove('item-scissors') || name.parentElement.classList.remove('item-paper');
    } else if (name.textContent === '보') {
        name.parentElement.classList.add('item-paper');
        name.parentElement.classList.remove('item-scissors') || name.parentElement.classList.remove('item-rock');
    }
};


/**
 * 3. 사용자가 가위바위보 선택
 * @param {String} userSelect 사용자가 선택한 가위바위보
 * @returns {Function} endGame 함수
 * @description - setInterval() 함수를 종료하고, 사용자가 선택한 가위바위보와 pc가 선택한 가위바위보를 비교한다.
 **/
// 유저 가위바위보 선택
const mySelect = item => {
    $user.textContent = item;
    replaceEmoji($user);
}

// 화면 로딩시 즉시 실행 함수
startGame();
replaceEmoji($user);
// 랜덤 유저이미지 생성
(function userImg() {
    let randomImg = parseInt(Math.random() * 6);
    return $userImg.setAttribute('src', `../asset/img/user-${randomImg}.png`);
})();


/**
 * 4. 가위바위보 버튼에 이벤트 등록
 * @param {'click'} e
 * @returns {Function} playGame, mySelect, endGame 함수
 * @description - 버튼을 클릭하면, 승패를 산정하고 결과를 출력하는 모달을 노출시킨다.
 */
$btn.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    playGame($pc.textContent, e.target.dataset.result);
    mySelect(e.target.textContent.trim());
    endGame();
    $dialog.showModal()
});

// 재시작 버튼 클릭시 게임 재시작
$restart.addEventListener('click', () => {
    replayGame();
    start.play();
});



/**
 * 5. 사용자의 버튼클릭 이벤트 발생시 switch문으로 승패 결정.
 * @param {String} pc pc가 선택한 가위바위보
 * @param {String} user user가 선택한 가위바위보
 * @returns {Function} addScore 함수
 * @description - pc와 user의 textContent를 비교하고 switch문으로 조건을 걸어 승패를 노출시키고, 점수를 증가시킨다.
 */
const playGame = (pc, user) => {
    if (pc === user) {
        resultMessage(0)
        draw.play();
    } else {
        switch (pc + user) {
            case '보바위':
            case '바위가위':
            case '가위보':
                addScore($pcScore)
                lose.play();
                resultMessage(1)
                break;
            default:
                addScore($userScore)
                win.play();
                resultMessage(2)
        }
    };
}


/**
 * 6. 승패 결과에 따라 메시지 출력
 * @param {*} num 
 * @returns {Function} resultMessage 함수
 * @description - 승패 결과에 따라 resultArr배열에 있는 index를 가져와서 대문자 메시지 표시.
 */
const resultMessage = num => {
    // img 태그를 생성하여 화면에 표시
    const resultImg = document.createElement('img');
    $resultEmoji.setAttribute('src', `../asset/img/result-${resultArr[num]}.gif`);
    $result.textContent = ` ${resultArr[num].toUpperCase()}!`
}

// playGame switch문 결과에 따라 점수 증가
const addScore = name => {
    name.textContent = parseInt(name.textContent) + 1;
}

