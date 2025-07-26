let selected = null;
let gameMode = "pvp";
const pieceMap = { 'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟', '': '', '♚': 'K', '♛': 'Q', '♜': 'R', '♝': 'B', '♞': 'N', '♟': 'P' };
const colorString = "wksgoxpnyzru";
const pieceString = "KQRBNP";
const startPosition = "gQBnRNkRNBQKBNRyNRsBQ/gRNnPPkPPPPPPPPyPPsNR/uBPcoPB/uQPcoPQ/xRPcrPR/xNPcrPN/zBPcpPB/zQPcpPQ/yQPcnPQ/yBPcnPB/oNPcuPN/oRPcuPR/rQPcxPQ/rBPcxPB/sRNpPPwPPPPPPPPzPPgNR/sQBpRNwRNBQKBNRzNRgBQ/w";
const SIZE = 16;

function getBoardString() {
  let string = "";
  let emptySquares = 0;
  let prevColor = "";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let square = document.getElementById(`sq-${r}-${c}`);
      if (square.textContent == "") {
        emptySquares += 1;
      }
      else {
        if (emptySquares > 0) {
          string += (emptySquares.toString(16));
          emptySquares = 0;
          prevColor = "";
        }
        pieceColor = square.classList[2];
        if (prevColor != pieceColor) {
          string += pieceColor;
          prevColor = pieceColor;
        }
        // string += square.textContent;
        string += pieceMap[square.textContent];
      }
    }
    if (emptySquares > 0) {
      string += (emptySquares.toString(16));
      emptySquares = 0;
      prevColor = "";
    }
    string += "/";
  }
  string += document.getElementById("turnBox").style.backgroundColor === "white" ? "w" : "k";
  return string;
}
function setBoardFromString(inputString = startPosition) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      document.getElementById(`sq-${r}-${c}`).textContent = "";
      for (let n = 0; n < colorString.length; n++) {
        document.getElementById(`sq-${r}-${c}`).classList.remove(colorString.charAt(n));
      }
    }
  }
  for (let r = 0; r < SIZE; r++) {
    let currColor = null;

    for (let c = 0; c < SIZE; c++) {
      let firstChar = inputString.charAt(0);

      // Check if the color gets set first.
      if (colorString.includes(firstChar)) {
        currColor = firstChar;
        inputString = inputString.substring(1);
        firstChar = inputString.charAt(0);
      }

      // Check if a piece should be placed.
      if (pieceString.includes(firstChar)) {
        let square = document.getElementById(`sq-${r}-${c}`);
        //square.textContent = firstChar;
        square.textContent = pieceMap[firstChar];
        square.classList.add(currColor);
      }
      // Squares should be blanked. 
      else {
        let length = parseInt(firstChar, 16);
        for (let x = c; x < c + length; x++) {
          let square = document.getElementById(`sq-${r}-${x}`);
          square.textContent = "";
        }
        c += length - 1;
      }
      inputString = inputString.substring(1);
    }
    if (inputString.charAt(0) == "/") {
      inputString = inputString.substring(1);
    }
    else {
      console.error("Error: expected (/) but received (" + inputString.charAt(0) + ").");
    }
  }
  document.getElementById("positionString").textContent = getBoardString();
  updateTurnIndicator(inputString.charAt(0));
}
function createRankLabels() {
  const left = document.getElementById('rankLabelsLeft');
  const right = document.getElementById('rankLabelsRight');
  left.innerHTML = '';
  right.innerHTML = '';
  for (let i = 16; i >= 1; i--) {
    const lblLeft = document.createElement('div');
    lblLeft.textContent = i;
    lblLeft.style.height = '50px';
    lblLeft.style.lineHeight = '50px';
    left.appendChild(lblLeft);

    const lblRight = document.createElement('div');
    lblRight.textContent = i;
    lblRight.style.height = '50px';
    lblRight.style.lineHeight = '50px';
    right.appendChild(lblRight);
  }
}
function createFileLabels() {
  const top = document.getElementById('fileLabelsTop');
  const bottom = document.getElementById('fileLabelsBottom');
  top.innerHTML = '';
  bottom.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const letter = String.fromCharCode('A'.charCodeAt(0) + i);
    const lblTop = document.createElement('div');
    lblTop.textContent = letter;
    lblTop.style.height = '30px';
    lblTop.style.lineHeight = '30px';
    top.appendChild(lblTop);

    const lblBottom = document.createElement('div');
    lblBottom.textContent = letter;
    lblBottom.style.height = '30px';
    lblBottom.style.lineHeight = '30px';
    bottom.appendChild(lblBottom);
  }
}
function updateTurnIndicator(turnColor) {
  const turnBox = document.getElementById("turnBox");
  turnBox.style.backgroundColor = turnColor === "w" ? "white" : "black";
}
function returnControlColors(pieceColor) {
  let controlColors = [];
  for (let r = 4; r < SIZE - 4; r++) {
    for (let c = 4; c < SIZE - 4; c++) {
      // Check if this square has a piece of the given color.
      if (document.getElementById(`sq-${r}-${c}`).classList[2] == pieceColor) {
        switch (document.getElementById(`sq-${r}-${c}`).classList[1]) {
          case "light":
          case "dark":
          case "white":
          case "black":
            break;
          case "silver":
            controlColors.push("s");
            break;
          case "gold":
            controlColors.push("g");
            break;
          case "purple":
            controlColors.push("p");
            break;
          case "brown":
            controlColors.push("n");
            break;
          case "royalblue":
            controlColors.push("x");
            break;
          case "orange":
            controlColors.push("o");
            break;
          case "yellow":
            controlColors.push("y");
            break;
          case "green":
            controlColors.push("z");
            break;
          case "red":
            controlColors.push("r");
            break;
          case "blue":
            controlColors.push("u");
            break;
        }
      }
    }
  }
  return controlColors;
}
function isValidSquare(square) {
  let moveColor = square.classList[2];
  let turnColor = null;
  if (turnBox.style.backgroundColor == "white") turnColor = "w";
  if (turnBox.style.backgroundColor == "black") turnColor = "k";

  // Check if an empty square is selected.
  if (moveColor == "") {
    return false;
  }
  // Check if piece color matches whose turn it is.
  else if (moveColor == turnColor) {
    return true;
  }
  else {
    let colorControl = [];
    colorControl.push(turnColor);
    for (let i = 0; i < 12 && colorControl.length > 0; i++) {
      let nextColor = colorControl.pop();
      if (moveColor == nextColor) {
        return true;
      }
      let newColors = returnControlColors(nextColor);
      while (newColors.length > 0) {
        colorControl.push(newColors.pop());
      }
    }
  }
  return false;
}

window.onload = function() {
  const sColor = [
      ['light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'red', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'blue', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'yellow', 'dark', 'purple', 'brown', 'light', 'green', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'dark', 'silver', 'dark', 'light', 'gold', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'orange', 'dark', 'white', 'black', 'light', 'royalblue', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'royalblue', 'light', 'black', 'white', 'dark', 'orange', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'light', 'gold', 'light', 'dark', 'silver', 'dark', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'green', 'light', 'brown', 'purple', 'dark', 'yellow', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'blue', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'red', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light'],
      ['light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark'],
      ['dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light', 'dark', 'light'],
  ];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let square = document.createElement('div');
      square.classList.add('square');
      square.classList.add(sColor[r][c]);
      square.id = `sq-${r}-${c}`;

      square.addEventListener("click", () => {
        let board = getBoardString();
        if (!selected) {
          if (isValidSquare(document.getElementById(square.id))) {
            selected = square.id;
            square.style.border = "2px solid red";
          }
        } else {
          const from = String.fromCharCode(Number(selected.split("-")[2]) + 65) + (16 - selected.split("-")[1]).toString();
          const to = String.fromCharCode(Number(square.id.split("-")[2]) + 65) + (16 - square.id.split("-")[1]).toString();
          const engineLevel = gameMode === "pvc" ? 1 : 0;
          
          document.getElementById("status").textContent = `You moved ${from} → ${to}`;
          fetch("/move", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ board, from, to, engineLevel })
          })
            .then((res) => res.json())
            .then((data) => {
              board = data.board;
              setBoardFromString(board);
            });

          document.getElementById(selected).style.border = "1px solid #999";
          selected = null;
        }
        //console.log("Response: " + board);
        document.getElementById("positionString").textContent = board;
      });

      document.getElementById('board').appendChild(square);
    }
  }

  setBoardFromString();
  createRankLabels();
  createFileLabels();

  // Add event listener for mode selection if needed:
  document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      console.log(`Game mode changed to ${e.target.value}`);
      gameMode = e.target.value;
    });
  });

  document.getElementById("restoreBtn").addEventListener("click", () => {
    const input = document.getElementById("positionInput").value.trim();
    setBoardFromString(input);
  });

}
