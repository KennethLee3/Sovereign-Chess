let selected = null;

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

window.onload = function() {
  const SIZE = 16;
  let board = [
      ['Q', 'B', 'R', 'N', 'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R', 'N', 'R', 'B', 'Q'],
      ['R', 'N', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'N', 'R'],
      ['B', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'B'],
      ['Q', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'Q'],
      ['R', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'R'],
      ['N', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'N'],
      ['B', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'B'],
      ['Q', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'Q'],
      ['Q', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'Q'],
      ['B', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'B'],
      ['N', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'N'],
      ['R', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'R'],
      ['Q', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'Q'],
      ['B', 'P', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'P', 'B'],
      ['R', 'N', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'N', 'R'],
      ['Q', 'B', 'R', 'N', 'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R', 'N', 'R', 'B', 'Q']
  ];
  let pColor = [
      ['go', 'go', 'br', 'br', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'ye', 'ye', 'si', 'si'],
      ['go', 'go', 'br', 'br', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'ye', 'ye', 'si', 'si'],
      ['bu', 'bu', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'or', 'or'],
      ['bu', 'bu', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'or', 'or'],
      ['rb', 'rb', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 're', 're'],
      ['rb', 'rb', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 're', 're'],
      ['gr', 'gr', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'pu', 'pu'],
      ['gr', 'gr', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'pu', 'pu'],
      ['ye', 'ye', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'br', 'br'],
      ['ye', 'ye', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'br', 'br'],
      ['or', 'or', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bu', 'bu'],
      ['or', 'or', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bu', 'bu'],
      ['re', 're', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'rb', 'rb'],
      ['re', 're', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'bl', 'rb', 'rb'],
      ['si', 'si', 'pu', 'pu', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'gr', 'gr', 'go', 'go'],
      ['si', 'si', 'pu', 'pu', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'wh', 'gr', 'gr', 'go', 'go']
  ];
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
      square.classList.add(pColor[r][c]);
      square.textContent = board[r][c];
      square.id = `sq-${r}-${c}`;

      square.addEventListener("click", () => {
        if (!selected) {
          selected = square.id;
          square.style.border = "2px solid red";
        } else {
          const from = selected.split("-").slice(1).join("");
          const to = square.id.split("-").slice(1).join("");
          document.getElementById("status").textContent = `You moved ${from} → ${to}`;
          fetch("/move", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ from, to })
          })
            .then((res) => res.json())
            .then((data) => {
              document.getElementById("status").textContent += ` | Engine: ${data.engineMove}`;
            });
          document.getElementById(selected).style.border = "1px solid #999";
          selected = null;
        }
      });

      document.getElementById('board').appendChild(square);
    }
  }

  createRankLabels();
  createFileLabels();

  // Add event listener for mode selection if needed:
  document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      console.log(`Game mode changed to ${e.target.value}`);
      // TODO: react to mode change as needed
    });
  });

}
