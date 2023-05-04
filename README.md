# minigame

## 1. 가위바위보 게임

컴퓨터의 랜덤 케이스와 유저가 대결하는 가위바위보 게임.

<br/>

### PREVIEW

![Image](https://user-images.githubusercontent.com/22652668/236240465-e4f5efb1-72ee-4c20-bc22-e2af01d8f411.gif)

<br/>

### PC는 `가위`,`바위`,`보` 중 랜덤케이스를 출력

```js
const startGame = () => {
  // pc가 랜덤으로 가위바위보 선택
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

### 사용자의 버튼클릭 이벤트 발생시 switch문으로 승패 결정.

```js
// pc와 user의 textContent를 비교하여 승패 결정.
// 승패 결과에 따라 Message, Sound 출력.
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
      // console.log($result.textContent)
    }
  }
};
```
