let n = 20;
let factor = 40;
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
let north, east, south, west, visited;

function setupCanvas() {
    const mazeCanvas = document.getElementById("mazeCanvas");
    mazeCanvas.width = (n+2) * factor;
    mazeCanvas.height = (n+2) * factor;
}

function setup() {
    n = parseInt(document.getElementById("sizeInput").value);
    setupCanvas();
    init();
    generate(1, 1);
    drawMaze();
}


function init() {
    visited = new Array(n + 2).fill(null).map(() => new Array(n + 2).fill(false));
    for (let x = 0; x < n+2; x++) {
        visited[x][0] = true;
        visited[x][n+1] = true;
    }
    for (let y = 0; y < n+2; y++) {
        visited[0][y] = true;
        visited[n+1][y] = true;
    }

    north = new Array(n+2).fill(null).map(() => new Array(n+2).fill(true));
    east  = new Array(n+2).fill(null).map(() => new Array(n+2).fill(true));
    south = new Array(n+2).fill(null).map(() => new Array(n+2).fill(true));
    west  = new Array(n+2).fill(null).map(() => new Array(n+2).fill(true));
}

function drawMaze() {
    const ctx = document.getElementById("mazeCanvas").getContext("2d");
    north[1][1] = false;
    south[n][n] = false;
    ctx.strokeStyle = "orangered";
    ctx.lineWidth = 5;
    for (let x = 1; x <= n; x++) {
        for (let y = 1; y <= n; y++) {
            if (north[x][y]) ctx.beginPath(), ctx.moveTo(x * factor, y * factor), ctx.lineTo((x+1) * factor, y * factor), ctx.stroke();
            if (south[x][y]) ctx.beginPath(), ctx.moveTo(x * factor, (y+1) * factor), ctx.lineTo((x+1) * factor, (y+1) * factor), ctx.stroke();
            if (west[x][y])  ctx.beginPath(), ctx.moveTo(x * factor, y * factor), ctx.lineTo(x * factor, (y+1) * factor), ctx.stroke();
            if (east[x][y])  ctx.beginPath(), ctx.moveTo((x+1) * factor, y * factor), ctx.lineTo((x+1) * factor, (y+1) * factor), ctx.stroke();
        }
    }
}

function generate(x, y) {
    visited[x][y] = true;
    while (!visited[x][y+1] || !visited[x+1][y] || !visited[x][y-1] || !visited[x-1][y]) {
        let r = Math.floor(Math.random() * 4); // Math.random() statt Math.random(0, 4)
        if (r === NORTH && !visited[x][y-1]) {
            north[x][y] = false;
            south[x][y-1] = false;
            generate(x, y-1);
        } else if (r === EAST && !visited[x+1][y]) {
            east[x][y] = false;
            west[x+1][y] = false;
            generate(x+1, y);
        } else if (r === SOUTH && !visited[x][y+1]) {
            south[x][y] = false;
            north[x][y+1] = false;
            generate(x, y + 1);
        } else if (r === WEST && !visited[x-1][y]) {
            west[x][y] = false;
            east[x-1][y] = false;
            generate(x-1, y);
        }
    }
}

