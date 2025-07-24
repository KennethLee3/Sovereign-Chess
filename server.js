const colorString = "wksgoxpnyzru";
const pieceString = "KQRBNP";
const SIZE = 16;
const sColor = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'red', ' ', ' ', ' ', ' ', ' ', ' ', 'blue', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'yellow', ' ', 'purple', 'brown', ' ', 'green', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', 'silver', ' ', ' ', 'gold', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'orange', ' ', 'white', 'black', ' ', 'royalblue', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'royalblue', ' ', 'black', 'white', ' ', 'orange', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', 'gold', ' ', ' ', 'silver', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'green', ' ', 'brown', 'purple', ' ', 'yellow', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'blue', ' ', ' ', ' ', ' ', ' ', ' ', 'red', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Serve static files from "public"
app.use(express.static("public"));
app.use(express.json()); // parse JSON POST requests

// API endpoint to process a move
app.post("/move", (req, res) => {
  let board = req.body.board;
  const { from, to } = req.body;
  
  console.log(`Old board position: ${board}`);
  console.log(`Player moved ${from} to ${to}`);
  board = conductMove(board, from, to);
  console.log(`New board position: ${board}`);

  res.json({
    valid: true,
    board
  });
});

// Start server
const server = app.listen(port, () =>
  console.log(`Sovereign Chess backend listening on port ${port}!`)
);
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

function conductMove(inputString, from, to) {
  let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  let color = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  let turn = null;

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
        board[r][c] = firstChar;
        color[r][c] = currColor;
      }
      // Squares should be blanked. 
      else {
        let length = parseInt(firstChar, 16);
        for (let x = c; x < c + length; x++) {
          board[r][c] = "";
          color[r][c] = "";
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
  turn = inputString.charAt(0);

  let fromC = Number(from.charAt(0).charCodeAt()) - 65;
  let fromR = 16 - Number(from.substring(1));
  let toC = Number(to.charAt(0).charCodeAt()) - 65;
  let toR = 16 - Number(to.substring(1));

  if (checkMove(board, color, fromC, fromR, toC, toR)) {
    turn = turn === "w" ? "k" : "w";

    board[toR][toC] = board[fromR][fromC];
    color[toR][toC] = color[fromR][fromC];
    board[fromR][fromC] = "";
    color[fromR][fromC] = "";

    // Promote pawns
    if (board[toR][toC] == "P" && toR >= 6 && toR < 10 && toC >= 6 && toC < 10) {
      board[toR][toC] = "Q";
    }
  }
  else {
    console.log("Move is illegal.");
  }
  
  let string = "";
  let emptySquares = 0;
  let prevColor = "";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] == "") {
        emptySquares += 1;
      }
      else {
        if (emptySquares > 0) {
          string += (emptySquares.toString(16));
          emptySquares = 0;
          prevColor = "";
        }
        pieceColor = color[r][c];
        if (prevColor != pieceColor) {
          string += pieceColor;
          prevColor = pieceColor;
        }
        string += board[r][c];
      }
    }
    if (emptySquares > 0) {
      string += (emptySquares.toString(16));
      emptySquares = 0;
      prevColor = "";
    }
    string += "/";
  }
  string += turn;
  return string;
}
function checkMove(board, color, fromC, fromR, toC, toR) {
  //if (!isAvailableSquare(board, color, fromC, fromR, toC, toR)) {
  //  return false;
  //}

  switch (board[fromR][fromC]) {
    case "K":
      return checkKingMovement(board, fromC, fromR, toC, toR);
    case "Q":
      return checkRookMovement(board, fromC, fromR, toC, toR) || checkBishopMovement(board, fromC, fromR, toC, toR);
    case "R":
      return checkRookMovement(board, fromC, fromR, toC, toR);
    case "B":
      return checkBishopMovement(board, fromC, fromR, toC, toR);
    case "N":
      return checkKnightMovement(board, fromC, fromR, toC, toR);
    case "P":
      return checkPawnMovement(board, fromC, fromR, toC, toR);
  }

  return false;
}
function checkKingMovement(board, fromC, fromR, toC, toR) {
  if (Math.abs(fromC - toC) > 1) {
    return false;
  }
  if (Math.abs(fromR - toR) > 1) {
    return false;
  }
  // TODO: add castling
  return true;
}
function checkRookMovement(board, fromC, fromR, toC, toR) {
  // Same column
  if (fromC == toC) {
    // Check if moving too far
    if (Math.abs(toR - fromR) > 8) {
      return false;
    }
    // Check if path is empty
    let invertVar = (toR - fromR) / Math.abs(toR - fromR); // Positive one if positive move
    for (let r = fromR + invertVar; invertVar === 1 ? (r < toR) : (r > toR); r += invertVar) {
      if (board[r][fromC] != "") {
        return false;
      }
    }
    return true;
  }
  // Same row
  if (fromR == toR) {
    // Check if moving too far
    if (Math.abs(toC - fromC) > 8) {
      return false;
    }
    // Check if path is empty
    let invertVar = (toC - fromC) / Math.abs(toC - fromC); // Positive one if positive move
    for (let c = fromC + invertVar; invertVar === 1 ? (c < toC) : (c > toC); c += invertVar) {
      if (board[fromR][c] != "") {
        return false;
      }
    }
    return true;
  }
  return false;
}
function checkBishopMovement(board, fromC, fromR, toC, toR) {
  return false;
}
function checkKnightMovement(board, fromC, fromR, toC, toR) {
  return false;
}
function checkPawnMovement(board, fromC, fromR, toC, toR) {
  return false;
}
function returnControlColors(color, pieceColor) {
  let controlColors = [];
  for (let r = 4; r < SIZE - 4; r++) {
    for (let c = 4; c < SIZE - 4; c++) {
      // Check if this square has a piece of the given color.
      if (color[r][c] == pieceColor) {
        switch (sColor[r][c]) {
          case " ":
          case "white":
            // Don't allow opponent to control opponent's color.
          case "black":
            // Don't allow opponent to control opponent's color.
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
function isAvailableSquare(board, color, fromC, fromR, toC, toR) {
  let colorControl = [];
  colorControl.push(color[fromR][fromC]);
  while(colorControl.length > 0) {
    let nextColor = colorControl.pop();
    if (color[toR][toC] == nextColor) {
      return false;
    }
    colorControl.push(returnControlColors(color, nextColor));
  }
  return true;
}