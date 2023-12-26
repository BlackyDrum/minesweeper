function setup() {
  let canvas = createCanvas(600, 600);
  canvas.style("border-width: 10px");
  canvas.style("border-color: gray");
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
