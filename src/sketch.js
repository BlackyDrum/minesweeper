let grid = [];
let clickedGrid = [];

let bomb;
let flag;

let gameStarted = false;
let gameLost = false;
let timeCounter = 0;

const bombCount = 40;

let remainingFlags = bombCount;

const borderSize = 3.5;

const sadSmiley = "&#128577;";
const happySmiley = "&#128578;";

const colors = {
  0: [255],
  1: [0, 0, 255],
  2: [0, 128, 0],
  3: [255, 0, 0],
  4: [0, 0, 128],
  5: [128, 0, 0],
  6: [0, 128, 128],
  7: [0],
  8: [128],
};

function preload() {
  bomb = loadImage("assets/Bomb.png");
  flag = loadImage("assets/Flag.png");

  setInterval(() => {
    if (gameStarted && timeCounter <= 999 && !gameLost) {
      $("#timeCount").sevenSeg({ value: String(timeCounter).padStart(3, "0"), digits: 3 });
      timeCounter++;
    }
  }, 1000);
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.style("border-width: 10px");
  canvas.style("border-color: gray");

  for (let i = 0; i < 20; i++) {
    grid.push([]);
    clickedGrid.push([]);
    for (let j = 0; j < 20; j++) {
      grid[i].push(0);
      clickedGrid[i].push(0);
    }
  }

  calculateBombPosition();
  calculateNumbers();

  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  document.getElementById("reset").innerHTML = happySmiley;

  $("#flagCount").sevenSeg({ value: String(remainingFlags).padStart(3, "0"), digits: 3 });
  $("#timeCount").sevenSeg({ value: String(timeCounter).padStart(3, "0"), digits: 3 });

  loop();
}

function draw() {
  background(220);

  let cellWidth = width / 20;
  let cellHeight = height / 20;

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      noStroke();

      if (clickedGrid[i][j] === 0) {
        fill(198);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);

        fill(255);
        rect(i * cellWidth, j * cellHeight, cellWidth, borderSize);
        rect(i * cellWidth, j * cellHeight, borderSize, cellHeight);

        fill(120);
        rect(i * cellWidth, (j + 1) * cellHeight - borderSize, cellWidth, borderSize);
        rect((i + 1) * cellWidth - borderSize, j * cellHeight, borderSize, cellHeight);
      } else if (clickedGrid[i][j] === 2) {
        imageMode(CENTER);
        image(flag, i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
      } else if (grid[i][j] === -1) {
        imageMode(CENTER);
        image(bomb, i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
        document.getElementById("reset").innerHTML = sadSmiley;
        gameLost = true;
        noLoop();
      } else {
        textStyle(BOLD);
        fill(colors[grid[i][j]] || 0);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(grid[i][j], i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
      }
    }
  }

  changeCursor();
}

function reset() {
  grid = [];
  clickedGrid = [];

  gameStarted = false;
  gameLost = false;
  timeCounter = 0;

  remainingFlags = bombCount;

  setup();
}

function calculateBombPosition() {
  for (let i = 0; i < bombCount; i++) {
    let options = [];

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (grid[i][j] === 0) {
          options.push({ x: i, y: j });
        }
      }
    }

    let index = int(random(0, options.length - 1));
    let pos = options[index];
    grid[pos.x][pos.y] = -1; // -1 represents a bomb
  }
}

function calculateNumbers() {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (grid[i][j] === -1) continue;

      let currentNum = 0;
      if (i - 1 >= 0 && grid[i - 1][j] === -1) {
        currentNum++;
      }
      if (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j - 1] === -1) {
        currentNum++;
      }
      if (i - 1 >= 0 && j + 1 < grid.length && grid[i - 1][j + 1] === -1) {
        currentNum++;
      }
      if (i + 1 < grid.length && grid[i + 1][j] === -1) {
        currentNum++;
      }
      if (i + 1 < grid.length && j - 1 >= 0 && grid[i + 1][j - 1] === -1) {
        currentNum++;
      }
      if (i + 1 < grid.length && j + 1 < grid.length && grid[i + 1][j + 1] === -1) {
        currentNum++;
      }
      if (j - 1 >= 0 && grid[i][j - 1] === -1) {
        currentNum++;
      }
      if (j + 1 < grid.length && grid[i][j + 1] === -1) {
        currentNum++;
      }

      grid[i][j] = currentNum;
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    let x = int((mouseX - borderSize * 2) / (width / 20));
    let y = int((mouseY - borderSize * 2) / (width / 20));

    gameStarted = true;

    if (mouseButton === RIGHT && clickedGrid[x][y] !== 1) {
      if (clickedGrid[x][y] === 2) {
        clickedGrid[x][y] = 0;
        remainingFlags++;
      } else {
        if (remainingFlags <= 0) return;
        clickedGrid[x][y] = 2;
        remainingFlags--;
      }

      $("#flagCount").sevenSeg({ value: String(remainingFlags).padStart(3, "0"), digits: 3 });
      return;
    }

    if (clickedGrid[x][y] !== 0) {
      return;
    }

    // Flood fill
    let toCheck = [{ x, y }];
    while (toCheck.length > 0) {
      let current = toCheck.pop();
      let i = current.x;
      let j = current.y;

      if (i < 0 || i >= grid.length || j < 0 || j >= grid.length || clickedGrid[i][j] !== 0) {
        continue;
      }

      clickedGrid[i][j] = 1;

      if (grid[i][j] === 0) {
        toCheck.push({ x: i - 1, y: j });
        toCheck.push({ x: i - 1, y: j - 1 });
        toCheck.push({ x: i - 1, y: j + 1 });
        toCheck.push({ x: i + 1, y: j });
        toCheck.push({ x: i + 1, y: j - 1 });
        toCheck.push({ x: i + 1, y: j + 1 });
        toCheck.push({ x: i, y: j - 1 });
        toCheck.push({ x: i, y: j + 1 });
      }
    }

    clickedGrid[x][y] = 1;
  }
}

function changeCursor() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    let x = int((mouseX - borderSize * 2) / (width / 20));
    let y = int((mouseY - borderSize * 2) / (width / 20));

    cursor("initial");
    if (clickedGrid[x][y] === 0) {
      cursor("pointer");
    }
  }
}
