// 화면 조작 관련 변수
const $screen = document.querySelector('#screen');
const $pc = $screen.querySelector('.pc span');
const $user = $screen.querySelector('.user span');
const $userImg = $screen.querySelector('.userImg');
const $btn = $screen.querySelector('.selectItem');
const $score = $screen.querySelector('.score');

// 점수 산정 관련 변수
const $result = $screen.querySelector('.score h2 span');
const $resultEmoji = $screen.querySelector('.score h2 img');
const $pcScore = $screen.querySelector('.pc-score');
const $userScore = $screen.querySelector('.user-score');
const $restart = $screen.querySelector('.restart');

// 게임 데이터
const casesArr = ['가위', '바위', '보'];
const resultArr = ['draw', 'lose', 'win']

// 게임 사운드
const win = new Audio('./asset/sound/win.wav');
const lose = new Audio('./asset/sound/lose.wav');
const draw = new Audio('./asset/sound/draw.wav');
const start = new Audio('./asset/sound/start.wav');

let interval;


/**
 ** 1. 컴퓨터와 가위바위보 게임 시작
 * 1-1. '가위', '바위', '보'가 담긴 배열을 만들고 랜덤 index를 생성하여 변수에 담는다.
 * 1-2. setInterval() 함수로 랜덤 index에 해당하는 배열 값을 화면에 textContents로 넣어준다.
 * 1-3. 사용자가 버튼을 클릭하면, 버튼의 textContent를 가져온다.
 * 1-4. 사용자가 버튼을 클릭하면 clearInterval()로 setInterval()을 종료한다.
 */


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
    // classList.add('hide')로 숨겨진 클래스를 제거하여 화면에 표시
    $score.classList.remove('hide');
    $btn.classList.add('hide');
}

const replayGame = () => {
    // 게임결과 화면 초기화 후 startGame() 함수 실행
    $result.textContent = '';
    startGame();
    // classList.add('hide')로 숨겨진 클래스를 제거하여 화면에 표시
    $score.classList.add('hide');
    $btn.classList.remove('hide');
}

const replaceEmoji = name => {
    // name을 인자로 받아, textContent에 따라 emoji를 변경.
    // classList를 추가하여 css에서 back
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
    return $userImg.setAttribute('src', `./asset/img/user-${randomImg}.png`);
})();



/**
 ** 2. 가위바위보 버튼에 이벤트 등록
 * 2-1. 버튼을 클릭하면 게임 결과를 출력한다.
 * 2-2. 버튼을 클릭하면, 버튼의 textContent를 가져온다.
 * 2-3. 버튼을 클릭하면 clearInterval() 함수를 이용하여 setInterval() 함수를 종료한다.
 * 2-4. 버튼을 클릭하면 재시작 버튼을 활성화시킨다.
 */

// 가위바위보 버튼 클릭시 게임 결과 출력
$btn.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    playGame($pc.textContent, e.target.dataset.result);
    mySelect(e.target.textContent.trim());
    endGame();
});

// 재시작 버튼 클릭시 게임 재시작
$restart.addEventListener('click', () => {
    replayGame();
    start.play();
});



/**
 **  3. 가위바위보 승패 결정
 * 3-1. pc와 user의 값이 같으면 'DRAW!'를 출력한다.
 * 3-2. pc와 user의 값이 다르면 switch문을 이용하여 승패를 결정한다.
 * 3-3. 승패에 따라 결과를 출력한다.
 * 3-4. 승패에 따라 점수를 +1씩 증가시킨다.
 */


// pc와 user의 textContent를 비교하여 승패 결정.
// 승패 결과에 따라 Message, Sound 출력.
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
            // console.log($result.textContent)
        }
    };
}

// 승패 결과에 따라 Message
const resultMessage = num => {
    // img 태그를 생성하여 화면에 표시
    const resultImg = document.createElement('img');
    $resultEmoji.setAttribute('src', `./asset/img/result-${resultArr[num]}.gif`);

    // 승패 결과에 따라 resultArr배열에 있는 index를 가져와서 대문자 메시지 표시.
    $result.textContent = ` ${resultArr[num].toUpperCase()}!`
}

// playGame switch문 결과에 따라 점수 증가
const addScore = name => {
    name.textContent = parseInt(name.textContent) + 1;
}

