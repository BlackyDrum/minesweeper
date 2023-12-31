let grid = [];
let clickedGrid = [];

let bomb;
let flag;

let gameStarted = false;
let gameLost = false;
let timeCounter = 0;

const bombCount = 50;

let remainingFlags = bombCount;

const borderSize = 3;

const sadSmiley = "&#128577;";
const happySmiley = "&#128578;";
const sunGlassSmiley = "&#128526;";

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
    if (gameStarted && timeCounter <= 999 && !gameLost && !isWin()) {
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

  flag.resize(20, 20);

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

  if (isWin()) {
    showAllBombs();
    document.getElementById("reset").innerHTML = sunGlassSmiley;
    noLoop();
  }

  if (gameLost) {
    showAllBombs();
    noLoop();
  }

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      noStroke();

      if (clickedGrid[i][j] === 0) {
        fill(198);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);

        fill(255);
        drawVertices(i, j, cellWidth, cellHeight);

        //rect(i * cellWidth, j * cellHeight, cellWidth, borderSize);
        //rect(i * cellWidth, j * cellHeight, borderSize, cellHeight);

        //fill(120);
        //rect(i * cellWidth, (j + 1) * cellHeight - borderSize, cellWidth, borderSize);
        //rect((i + 1) * cellWidth - borderSize, j * cellHeight, borderSize, cellHeight);
      } else if (clickedGrid[i][j] === 2) {
        fill(255);
        drawVertices(i, j, cellWidth, cellHeight);

        imageMode(CENTER);
        image(flag, i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
      } else if (grid[i][j] === -1) {
        imageMode(CENTER);
        image(bomb, i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
        if (!isWin()) {
          document.getElementById("reset").innerHTML = sadSmiley;
          gameLost = true;
        }
      } else {
        push();
        noFill();
        stroke(120);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        pop();
        textStyle(BOLD);
        fill(colors[grid[i][j]] || 0);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(
          grid[i][j] === 0 ? "" : grid[i][j],
          i * cellWidth + cellWidth / 2,
          j * cellHeight + cellHeight / 2
        );
      }
    }
  }

  changeCursor();
}

function drawVertices(i, j, cellWidth, cellHeight) {
  // top
  push();
  beginShape();
  stroke(255);
  vertex(i * cellWidth, j * cellHeight);
  vertex(i * cellWidth + cellWidth, j * cellHeight);
  vertex(i * cellWidth + cellWidth - borderSize, j * cellHeight + borderSize);
  vertex(i * cellWidth, j * cellHeight + borderSize);
  endShape(CLOSE);
  pop();

  // left
  push();
  beginShape();
  stroke(255);
  vertex(i * cellWidth, j * cellHeight);
  vertex(i * cellWidth, j * cellHeight + cellHeight);
  vertex(i * cellWidth + borderSize, j * cellHeight + cellHeight - borderSize);
  vertex(i * cellWidth + borderSize, j * cellHeight);
  endShape(CLOSE);
  pop();

  // right
  push();
  beginShape();
  stroke(120);
  fill(120);
  vertex(i * cellWidth + cellWidth, j * cellHeight);
  vertex(i * cellWidth + cellWidth, j * cellHeight + cellHeight);
  vertex(i * cellWidth + cellWidth - borderSize, j * cellHeight + cellHeight - borderSize);
  vertex(i * cellWidth + cellWidth - borderSize, j * cellHeight + borderSize + 1);
  endShape(CLOSE);

  // bottom
  beginShape();
  stroke(120);
  fill(120);
  vertex(i * cellWidth, j * cellHeight + cellHeight);
  vertex(i * cellWidth + cellWidth, j * cellHeight + cellHeight);
  vertex(i * cellWidth + cellWidth - borderSize, j * cellHeight + cellHeight - borderSize);
  vertex(i * cellWidth + borderSize + 1, j * cellHeight + cellHeight - borderSize);
  endShape(CLOSE);
  pop();
}

function showAllBombs() {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (grid[i][j] === -1 && isWin()) {
        clickedGrid[i][j] = 1;
      } else if (grid[i][j] === -1 && clickedGrid[i][j] !== 2) {
        clickedGrid[i][j] = 1;
      }
    }
  }
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
  for (let k = 0; k < bombCount; k++) {
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

function isWin() {
  let win = true;
  for (let i = 0; i < 20 && win; i++) {
    for (let j = 0; j < 20 && win; j++) {
      if (grid[i][j] !== -1 && clickedGrid[i][j] === 0) {
        win = false;
      }
    }
  }
  return win;
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
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height && !gameLost) {
    let x = int((mouseX - borderSize * 2) / (width / 20));
    let y = int((mouseY - borderSize * 2) / (width / 20));

    gameStarted = true;

    if (mouseButton === RIGHT && clickedGrid[x][y] !== 1) {
      if (clickedGrid[x][y] === 2) {
        // 2 represents a flag
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

      if (
        i < 0 ||
        i >= grid.length ||
        j < 0 ||
        j >= grid.length ||
        (clickedGrid[i][j] !== 0 && clickedGrid[i][j] !== 2)
      ) {
        continue;
      }

      if (clickedGrid[i][j] === 2) {
        remainingFlags++;
        $("#flagCount").sevenSeg({ value: String(remainingFlags).padStart(3, "0"), digits: 3 });
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
