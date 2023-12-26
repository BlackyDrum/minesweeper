let grid = [];

let bomb;
let flag;

const bombCount = 40;

function preload() {
  bomb = loadImage("assets/Bomb.png");
  flag = loadImage("assets/Flag.png");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.style("border-width: 10px");
  canvas.style("border-color: gray");

  for (let i = 0; i < 20; i++) {
    grid.push([]);
    for (let j = 0; j < 20; j++) {
      grid[i].push(0);
    }
  }

  calculateBombPosition();
  calculateNumbers();
  console.table(grid);
}

function draw() {
  background(220);

  let cellWidth = width / 20;
  let cellHeight = height / 20;
  let borderSize = 3.5;

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      noStroke();

      fill(198);
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);

      fill(255);
      rect(i * cellWidth, j * cellHeight, cellWidth, borderSize);
      rect(i * cellWidth, j * cellHeight, borderSize, cellHeight);

      fill(120);
      rect(i * cellWidth, (j + 1) * cellHeight - borderSize, cellWidth, borderSize);
      rect((i + 1) * cellWidth - borderSize, j * cellHeight, borderSize, cellHeight);
    }
  }
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
