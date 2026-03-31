const colorString = "wksgoxpnyzru";
let colorOwnerMap = { 'w': 'w', 'k': 'k', 's': '-', 'g': '-', 'o': '-', 'x': '-', 'p': '-', 'n': '-', 'y': '-', 'z': '-', 'r': '-', 'u': '-' };
const pieceString = "KQRBNP";
let pieceValueMap = { 'K': 1000, 'Q': 9, 'R': 5, 'B': 3, 'N': 3, 'P': 1 };
const SIZE = 16;
const DEPTH = 1;
const INF = 10000;
const sColor = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'r', ' ', ' ', ' ', ' ', ' ', ' ', 'u', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'y', ' ', 'p', 'n', ' ', 'z', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', 's', ' ', ' ', 'g', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'o', ' ', 'w', 'k', ' ', 'x', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'x', ' ', 'k', 'w', ' ', 'o', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', 'g', ' ', ' ', 's', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'z', ' ', 'n', 'p', ' ', 'y', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'u', ' ', ' ', ' ', ' ', ' ', ' ', 'r', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];
let engineMoveChoice = null;

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
  const engine = req.body.engineLevel;
  
  console.log(`Old board position: ${board}`);
  console.log(`Player moved from ${from} to ${to}.`);
  newBoard = conductMove(board, from, to);
  if (newBoard != board) {
    board = engineMove(newBoard, engine);
  }
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

function engineMove(inputString, engine) {
  if (engine == 0) return inputString;

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

  switch (engine) {
    case 1:
      getRandomMove(board, color, turn);
      break;
    case 2:
      alphaBetaMax(-INF, INF, DEPTH, board, color, turn);
      break;
    default:
      console.error("Unknown engine level.");
      break;
  }
  console.log(`Engine moved from ${String.fromCharCode(engineMoveChoice.fromC + 65)}${16 - engineMoveChoice.fromR} to ${String.fromCharCode(engineMoveChoice.toC + 65)}${16 - engineMoveChoice.toR}.`);

  // Switch turns
  turn = turn === "w" ? "k" : "w";
  
  let fromC = engineMoveChoice.fromC;
  let fromR = engineMoveChoice.fromR;
  let toC = engineMoveChoice.toC;
  let toR = engineMoveChoice.toR;

  board[toR][toC] = board[fromR][fromC];
  color[toR][toC] = color[fromR][fromC];
  board[fromR][fromC] = "";
  color[fromR][fromC] = "";

  // Promote pawns
  if (board[toR][toC] == "P" && toR >= 6 && toR < 10 && toC >= 6 && toC < 10) {
    board[toR][toC] = "Q";
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

  if (checkMove(board, color, fromC, fromR, toC, toR, turn)) {
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
function checkMove(board, color, fromC, fromR, toC, toR, turn) {
  if (!isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
    return false;
  }

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
function addMoves(board, color, turn) {
  let allMoves = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] != "" && color[r][c] == turn) {
        switch (board[r][c]) {
          case "K":
            allMoves = allMoves.concat(addKingMoves(board, color, c, r, turn));
            break;
          case "Q":
            allMoves = allMoves.concat(addRookMoves(board, color, c, r, turn));
            allMoves = allMoves.concat(addBishopMoves(board, color, c, r, turn));
            break;
          case "R":
            allMoves = allMoves.concat(addRookMoves(board, color, c, r, turn));
            break;
          case "B":
            allMoves = allMoves.concat(addBishopMoves(board, color, c, r, turn));
            break;
          case "N":
            allMoves = allMoves.concat(addKnightMoves(board, color, c, r, turn));
            break;
          case "P":
            allMoves = allMoves.concat(addPawnMoves(board, color, c, r, turn));
            break;
          default:
            console.error("Invalid piece.");
            break;
        }
      }
    }
  }

  return allMoves;
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
function addKingMoves(board, color, fromC, fromR, turn) {
  let addedMoves = [];
  let toC = null;
  let toR = null;
  
  if (fromC > 0) {
    toC = fromC - 1;
    toR = fromR;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromR > 0) {
    toC = fromC;
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 1) {
    toC = fromC + 1;
    toR = fromR;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromR < SIZE - 1) {
    toC = fromC;
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC > 0 && fromR > 0) {
    toC = fromC - 1;
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 1 && fromR > 0) {
    toC = fromC + 1;
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC > 0 && fromR < SIZE - 1) {
    toC = fromC - 1;
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 1 && fromR < SIZE - 1) {
    toC = fromC + 1;
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  
  return addedMoves;
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
function addRookMoves(board, color, fromC, fromR, turn) {
  let addedMoves = [];
  let toC = null;
  let toR = null;
  
  for (toC = fromC + 1; toC < SIZE && toC - fromC <= 8; toC++) {
    toR = fromR;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toC = fromC - 1; toC >= 0 && fromC - toC <= 8; toC--) {
    toR = fromR;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toR = fromR + 1; toR < SIZE && toR - fromR <= 8; toR++) {
    toC = fromC;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toR = fromR - 1; toR >= 0 && fromR - toR <= 8; toR--) {
    toC = fromC;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  
  return addedMoves;
}
function checkBishopMovement(board, fromC, fromR, toC, toR) {
  // R increasing, C increasing
  if ((toR - fromR == toC - fromC) && (toR - fromR > 0)) {
    // Check if moving too far
    if (toR - fromR > 8) {
      return false;
    }
    // Check if path is empty
    let r = fromR + 1;
    let c = fromC + 1;
    while (r < toR) {
      if (board[r][c] != "") {
        return false;
      }
      r++;
      c++;
    }
    return true;
  }
  // R increasing, C decreasing
  if ((toR - fromR == fromC - toC) && (toR - fromR > 0)) {
    // Check if moving too far
    if (toR - fromR > 8) {
      return false;
    }
    // Check if path is empty
    let r = fromR + 1;
    let c = fromC - 1;
    while (r < toR) {
      if (board[r][c] != "") {
        return false;
      }
      r++;
      c--;
    }
    return true;
  }
  // R decreasing, C increasing
  if ((fromR - toR == toC - fromC) && (toR - fromR < 0)) {
    // Check if moving too far
    if (fromR - toR > 8) {
      return false;
    }
    // Check if path is empty
    let r = fromR - 1;
    let c = fromC + 1;
    while (r > toR) {
      if (board[r][c] != "") {
        return false;
      }
      r--;
      c++;
    }
    return true;
  }
  // R decreasing, C decreasing
  if ((toR - fromR == toC - fromC) && (toR - fromR < 0)) {
    // Check if moving too far
    if (fromR - toR > 8) {
      return false;
    }
    // Check if path is empty
    let r = fromR - 1;
    let c = fromC - 1;
    while (r > toR) {
      if (board[r][c] != "") {
        return false;
      }
      r--;
      c--;
    }
    return true;
  }
  return false;
}
function addBishopMoves(board, color, fromC, fromR, turn) {
  let addedMoves = [];
  let toC = null;
  let toR = null;
  
  for (toC = fromC + 1, toR = fromR + 1; toC < SIZE && toR < SIZE && toR - fromR <= 8; toC++, toR++) {
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toC = fromC - 1, toR = fromR + 1; toC >= 0 && toR < SIZE && toR - fromR <= 8; toC--, toR++) {
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toC = fromC + 1, toR = fromR - 1; toC < SIZE && toR >= 0 && fromR - toR <= 8; toC++, toR--) {
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }
  for (toC = fromC - 1, toR = fromR - 1; toC >= 0 && toR >= 0 && fromR - toR <= 8; toC--, toR--) {
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) {
      addedMoves.push({fromC, fromR, toC, toR});
      if (board[toR][toC] != "") break;
    }
    else break;
  }

  return addedMoves;
}
function checkKnightMovement(board, fromC, fromR, toC, toR) {
  return (Math.abs(fromC - toC) == 2) && (Math.abs(fromR - toR) == 1) 
    || (Math.abs(fromC - toC) == 1) && (Math.abs(fromR - toR) == 2);
}
function addKnightMoves(board, color, fromC, fromR, turn) {
  let addedMoves = [];
  let toC = null;
  let toR = null;

  if (fromC > 0 && fromR > 1) {
    toC = fromC - 1;
    toR = fromR - 2;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC > 1 && fromR > 0) {
    toC = fromC - 2;
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC > 1 && fromR < SIZE - 1) {
    toC = fromC - 2;
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC > 0 && fromR < SIZE - 2) {
    toC = fromC - 1;
    toR = fromR + 2;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 1 && fromR < SIZE - 2) {
    toC = fromC + 1;
    toR = fromR + 2;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 2 && fromR < SIZE - 1) {
    toC = fromC + 2;
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 2 && fromR > 0) {
    toC = fromC + 2;
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }
  if (fromC < SIZE - 1 && fromR > 1) {
    toC = fromC + 1;
    toR = fromR - 2;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn)) addedMoves.push({fromC, fromR, toC, toR});
  }

  return addedMoves;
}
function checkPawnMovement(board, fromC, fromR, toC, toR) {
  // Move vertically
  if (board[toR][toC] == "" && fromC == toC) {
    // Move up two
    if (toR - fromR == 2 && fromR < 2) {
      if (board[toR - 1][toC] == "") {
        return true;
      }
    }
    // Move up one
    if (toR - fromR == 1 && fromR < 7) {
      return true;
    }
    // Move down two
    if (fromR - toR == 2 && fromR > 13) {
      if (board[toR + 1][toC] == "") {
        return true;
      }
    }
    // Move down one
    if (fromR - toR == 1 && fromR > 8) {
      return true;
    }
  }
  // Move horizontally
  else if (board[toR][toC] == "" && fromR == toR) {
    // Move right two
    if (toC - fromC == 2 && fromC < 2) {
      if (board[toR][toC - 1] == "") {
        return true;
      }
    }
    // Move right one
    if (toC - fromC == 1 && fromC < 7) {
      return true;
    }
    // Move left two
    if (fromC - toC == 2 && fromC > 13) {
      if (board[toR][toC + 1] == "") {
        return true;
      }
    }
    // Move left one
    if (fromC - toC == 1 && fromC > 8) {
      return true;
    }
  }
  // Capture diagonally
  else if (board[toR][toC] != "") {
    // Capture up right
    if (toR - fromR == 1 && toC - fromC == 1) {
      return fromR <= 7 || fromC <= 7;
    }
    // Capture up left
    if (toR - fromR == 1 && fromC - toC == 1) {
      return fromR <= 7 || fromC >= 8;
    }
    // Capture down right
    if (fromR - toR == 1 && toC - fromC == 1) {
      return fromR >= 8 || fromC <= 7;
    }
    // Capture down left
    if (fromR - toR == 1 && fromC - toC == 1) {
      return fromR >= 8 || fromC >= 8;
    }
  }
  return false;
}
function addPawnMoves(board, color, fromC, fromR, turn) {
  let addedMoves = [];
  let toC = null;
  let toR = null;

  // Move vertically
  toR = fromR;
  if (fromC < 7) {
    // Move up one
    toC = fromC + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
      addedMoves.push({fromC, fromR, toC, toR});
      if (fromC < 2) {
        // Move up two
        toC = fromC + 2;
        if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
          addedMoves.push({fromC, fromR, toC, toR});
        }
      }
    }
  }
  if (fromC > 8) {
    // Move down one
    toC = fromC - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
      addedMoves.push({fromC, fromR, toC, toR});
      if (fromC > 13) {
        // Move down two
        toC = fromC - 2;
        if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
          addedMoves.push({fromC, fromR, toC, toR});
        }
      }
    }
  }
  // Move horizontally
  toC = fromC;
  if (fromR < 7) {
    // Move right one
    toR = fromR + 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
      addedMoves.push({fromC, fromR, toC, toR});
      if (fromR < 2) {
        // Move right two
        toR = fromR + 2;
        if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
          addedMoves.push({fromC, fromR, toC, toR});
        }
      }
    }
  }
  if (fromR > 8) {
    // Move left one
    toR = fromR - 1;
    if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
      addedMoves.push({fromC, fromR, toC, toR});
      if (fromR > 13) {
        // Move left two
        toR = fromR - 2;
        if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] == "") {
          addedMoves.push({fromC, fromR, toC, toR});
        }
      }
    }
  }
  // Capture diagonally
  if (fromR <= 7) {
    if (fromC <= 7) {
      // Capture up right
      toR = fromR + 1;
      toC = fromC + 1;
      if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] != "") {
        addedMoves.push({fromC, fromR, toC, toR});
      }
    }
    if (fromC >= 8) {
      // Capture up left
      toR = fromR + 1;
      toC = fromC - 1;
      if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] != "") {
        addedMoves.push({fromC, fromR, toC, toR});
      }
    }
  }
  if (fromR >= 8) {
    if (fromC <= 7) {
      // Capture down right
      toR = fromR - 1;
      toC = fromC + 1;
      if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] != "") {
        addedMoves.push({fromC, fromR, toC, toR});
      }
    }
    if (fromC >= 8) {
      // Capture down left
      toR = fromR - 1;
      toC = fromC - 1;
      if (isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) && board[toR][toC] != "") {
        addedMoves.push({fromC, fromR, toC, toR});
      }
    }
  }

  return addedMoves;
}
function returnControlColors(color, pieceColor) {
  let controlColors = [];
  for (let r = 4; r < SIZE - 4; r++) {
    for (let c = 4; c < SIZE - 4; c++) {
      // Check if this square has a piece of the given color.
      if (color[r][c] == pieceColor) {
        if (sColor[r][c] != " " && sColor[r][c] != "w" && sColor[r][c] != "k") {
          controlColors.push(sColor[r][c]);
        }
      }
    }
  }
  return controlColors;
}
function isAvailableSquare(board, color, fromC, fromR, toC, toR, turn) {
  // Check if there is a piece
  if (color[toR][toC] == "") {}
  // Check if opponent controls piece
  else {
    let found = false;
    let colorControl = [];
    colorControl.push(turn === "w" ? "k" : "w");
    while(colorControl.length > 0 && !found) {
      let nextColor = colorControl.pop();
      if (color[toR][toC] == nextColor) {
        found = true;
      }
      let newColors = returnControlColors(color, nextColor);
      while (newColors.length > 0) {
        colorControl.push(newColors.pop());
      }
    }
    if (!found) return false;
  }
  // Check if square color matches piece color
  if (color[fromR][fromC] == sColor[toR][toC]) {
    return false;
  }
  // Check if matching square is empty
  if (sColor[toR][toC] != " ") {
    if (board[15 - toR][15 - toC] != "") {
      if (!(fromR == 15 - toR && fromC == 15 - toC)) {
        return false;
      }
    }
  }

  return true;
}
function getRandomMove(board, color, turn) {
  let allMoves = addMoves(board, color, turn);
  engineMoveChoice = allMoves[Math.floor(Math.random() * allMoves.length)];
}
function alphaBetaMax(alpha, beta, depthleft, board, color, turn) {
  if (depthleft == 0) return evaluate(board, color);
  let bestValue = -INF;
  let newTurn = turn === "w" ? "k" : "w";
  //for ( all moves) {
    // Make the move
    let newBoard = [];
    let newColor = [];
    let score = alphaBetaMin( alpha, beta, depthleft - 1, newBoard, newColor, newTurn);
    if(score > bestValue) {
      if (depthleft == DEPTH) {
        engineMoveChoice = move;
      }
      bestValue = score;
      if(score > alpha) alpha = score; // alpha acts like max in MiniMax
    }
    if(score >= beta) return score;   // fail soft beta-cutoff
  //}
  return bestValue;
}
function alphaBetaMin(alpha, beta, depthleft, board, color, turn) {
  if ( depthleft == 0 ) return -evaluate();
  let bestValue = INF;
  let newTurn = turn === "w" ? "k" : "w";
  //for ( all moves) {
    // Make the move
    let newBoard = [];
    let newColor = [];
    let score = alphaBetaMax( alpha, beta, depthleft - 1, newBoard, newColor, newTurn);
    if(score < bestValue) {
      bestValue = score;
      if(score < beta) beta = score; // beta acts like min in MiniMax
    }
    if(score <= alpha) return score; // fail soft alpha-cutoff, break can also be used here
  //}
  return bestValue;
}
function evaluate(board, color) {
  let score = 0;
  
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] != "") {
        switch (colorOwnerMap[color[r][c]]) {
          case "w":
            score += pieceValueMap[board[r][c]];
            break;
          case "k":
            score -= pieceValueMap[board[r][c]];
            break;
        }
      }
    }
  }

  return score;
}