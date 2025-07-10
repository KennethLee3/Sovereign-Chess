const colorString = "wksgoxpnyzru";
const pieceString = "KQRBNP";
const SIZE = 16;

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

  if (checkMove(board, from, to)) {
    board = conductMove(board, from, to);
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

function checkMove(board, from, to) {
  return true;
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
  string += turn === "w" ? "k" : "w";
  return string;
}
