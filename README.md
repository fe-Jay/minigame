# minigame

## 1. 카드 짝 맞추기 게임

### 카드를 뒤집어 같은 그림의 카드를 찾는 메모리 카드 게임.

- 게임을 시작하면 카드 앞면을 2초 동안 미리 볼 수 있다.
- 카드는 총 12개로 구성된다.
- 같은 그림의 카드를 모두 찾은 경우 게임을 clear한다.
- 게임은 30초 동안 진행되며 시간 내에 모든 카드의 짝을 맞추지 못하면 종료된다.

<br/>
<br/>

### PREVIEW

![Image](https://github.com/JAYCODE-git/testRepo/assets/22652668/f1bae50c-193b-4d96-b529-bc2fa0119c07)

<br/>
<br/>

### 카드를 순회하면서 클릭이벤트가 발생하면 두 카드를 비교.

- cardOne의 값이 비어있는 상태이며, clickPause가 false일 때만 비교 실행한다.
- 카드를 2번 클릭했을 때만 cardOne에 값이 들어가도록 cardOne이 비어있는지 확인
- cardOne, cardTwo의 data-idx 값을 가져와서 비교하는 matchCards() 함수 실행

<br/>

```js
const flipCard = (event) => {
  let clickedCard = event.target.closest('.card');

  if (cardOne !== clickedCard && !clickPause) {
    clickedCard.classList.add('show');

    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    clickPause = true;

    matchCards(cardOne.dataset.idx, cardTwo.dataset.idx);
  }
};
```

<br/>
<br/>

### cardOne, cardTwo의 data-id 값이 같으면 equals() 함수 실행, 다르면 differs() 함수 실행.

- 카드를 2번 클릭했을 때만 cardOne에 값이 들어가도록 cardOne이 비어있는지 확인한다.
- cardOne, cardTwo의 data-idx 값을 가져와서 비교하는 matchCards() 함수를 실행한다.
- 순차적으로 클릭을 진행할 수 있도록 clickPause가 false일 때만 비교를 실행한다.
- Match되지 않으면 shake Css Animation 0.4초 동안 실행한 뒤 1초 후 뒤집힌 카드 원상복귀한다.

<br/>

```js
function equals() {
  cardOne.removeEventListener('click', flipCard);
  cardTwo.removeEventListener('click', flipCard);
  matchedCount++;

  if (matchedCount === 6) {
    endGame(cleared);
  }

  cardOne = cardTwo = '';
  return (clickPause = false);
}

function differs() {
  setTimeout(() => {
    cardOne.classList.add('shake');
    cardTwo.classList.add('shake');
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove('shake', 'show');
    cardTwo.classList.remove('shake', 'show');

    cardOne = cardTwo = '';
    return (clickPause = false);
  }, 1000);
}
```

<br/>
<br/>

### Match된 카드가 6개가 되거나, 게임 시작으로부터 30초가 지나면 게임 종료.

- Match된 카드가 6개가 되면 게임 종료 후 cardOne, cardTwo 초기화한다.
- 게임이 종료되면 clearInterval() 메서드로 타이머 제거 후 게임 재시작 팝업창을 띄운다.
- 게임 결과에 따라 팝업창의 메시지와 이미지를 변경하고, 게임 결과에 따른 음악을 재생한다.

```js
const endGame = (result) => {
  let resultMsg = $dialog.querySelector('h3 span');
  let resultImg = $dialog.querySelector('h3 img');
  resultImg.setAttribute('src', `../asset/img/${result.img}`);
  resultMsg.innerText = `Game ${result.msg}!`;
  result.sound.play();
  clearInterval(time);
  $dialog.showModal();
};
```

<br/>
<br/>

## 2. 가위바위보 게임

### 컴퓨터의 랜덤 케이스와 유저가 대결하는 가위바위보 게임.

- PC는 `가위`,`바위`,`보` 중 랜덤케이스를 출력한다.
- 사용자가 `가위`,`바위`,`보` 버튼 중 하나를 선택하는 순간 컴퓨터가 선택한 랜덤 값과 비교하여 결과를 산정한다.
- 게임의 승패 결과를 화면에 출력한다.
- 사용자가 이길 경우 점수가 1씩 증가한다.

<br/>

### PREVIEW

![Image](https://user-images.githubusercontent.com/22652668/236240465-e4f5efb1-72ee-4c20-bc22-e2af01d8f411.gif)

<br/>
<br/>

### pc가 랜덤으로 가위바위보 선택.

- Math.random() 함수로 0~2 사이의 랜덤 숫자를 생성한다.
- setInterval() 함수로 랜덤 index에 해당하는 랜덤 배열 값을 화면에 textContents로 넣어준다.

<br/>

```js
const startGame = () => {
  const pcSelect = () => {
    let randomCase = casesArr[parseInt(Math.random() * casesArr.length)];
    $pc.textContent = randomCase;
    replaceEmoji($pc);
  };
  // pcSelect 함수를 0.1초마다 실행
  interval = setInterval(pcSelect, 100);
};
```

<br/>
<br/>

### 사용자의 버튼클릭 이벤트 발생시 switch문으로 승패 결정.

- pc와 user의 textContent를 비교하고 switch문으로 조건을 걸어 승패를 노출시키고, 점수를 증가시킨다.
- 승패 결과에 따라 Message와 Sound를 출력한다.

<br/>

```js
const playGame = (pc, user) => {
  if (pc === user) {
    resultMessage(0);
    draw.play();
  } else {
    switch (pc + user) {
      case '보바위':
      case '바위가위':
      case '가위보':
        addScore($pcScore);
        lose.play();
        resultMessage(1);
        break;
      default:
        addScore($userScore);
        win.play();
        resultMessage(2);
    }
  }
};
```
