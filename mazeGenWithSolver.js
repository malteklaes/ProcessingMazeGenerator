let n = 20;
let factor = 40;
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
let north, east, south, west, visited;
let timeoutID; // global variable for saving the timeout-ID

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

/**
 * Naiv algorithm (like BFS) with the following strategy:
 *  - Save neighbors that have already been visited and do not visit them again
 *  - Move in the direction where there is no wall (e.g., east[x][y]==false)
 *      - Simple case: there is only one direction to move
 *      - More complex case: at Forking-Nodes with more than one direction, choose one (here direction order heuristic: first south, then east, then west, north if necessary)
 *  - Recursion with backtracking: if in the more complex case at a Forking-Node: start recursion here, i.e., if a direction ends in a dead end, then backtracking to the Forking-Node and try the next direction
 *  - The algorithm starts with the starting point [1][1] and ends with [n][n]
 * @param {*} north (true, if there is a wall in the northern direction of the field)
 * @param {*} south (true, if there is a wall in the southern direction of the field)
 * @param {*} east (true, if there is a wall in the eastern direction of the field)
 * @param {*} west (true, if there is a wall in the western direction of the field)
 */

function naivPathFinder(north, south, east, west) {
    const n = north.length - 2;
    const path = [];
    const visited = new Array(n + 2).fill(null).map(() => new Array(n + 2).fill(false));

    function explore(x, y) {
        if (x === n && y === n) {
            path.push([x, y]);
            return true;
        }

        visited[x][y] = true;

        // neighbor with heuristic first south, then east, then west, north if necessary
        const neighbors = [];
        if (!south[x][y] && !visited[x][y + 1]) neighbors.push([x, y + 1]); // South
        if (!east[x][y] && !visited[x + 1][y]) neighbors.push([x + 1, y]); // East
        if (!west[x][y] && !visited[x - 1][y]) neighbors.push([x - 1, y]); // West
        if (!north[x][y] && !visited[x][y - 1]) neighbors.push([x, y - 1]); // North

        if (neighbors.length === 0) {
            return false; // deadlock
        }

        for (const [nx, ny] of neighbors) {
            if (explore(nx, ny)) {
                path.push([x, y]);
                return true;
            }
        }

        return false;
    }

    explore(1, 1);
    
    return path.reverse();
}

function drawSolution(ctx, solutionPath, speed) {
    ctx.strokeStyle = "#0BA95B";
    ctx.lineWidth = 20;
    ctx.beginPath();
    const step = 1;
    let currentStep = 0;

    function drawStep() {
        if (currentStep >= solutionPath.length) return;
        const [x, y] = solutionPath[currentStep];
        ctx.lineTo(x * factor + factor / 2, y * factor + factor / 2);
        ctx.stroke();
        currentStep += step;
        timeoutID = setTimeout(drawStep, speed);
    }

    ctx.moveTo(solutionPath[0][0] * factor + factor / 2, solutionPath[0][1] * factor + factor / 2);
    drawStep();
}

function resetMaze() {
    clearTimeout(timeoutID);
    const ctx = document.getElementById("mazeCanvas").getContext("2d");
    ctx.clearRect(0, 0, (n+2) * factor, (n+2) * factor);
    drawMaze();
}

function generate(x, y) {
    visited[x][y] = true;
    while (!visited[x][y+1] || !visited[x+1][y] || !visited[x][y-1] || !visited[x-1][y]) {
        let r = Math.floor(Math.random() * 4);
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

function raceMaze(level) {
    const ctx = document.getElementById("mazeCanvas").getContext("2d");
    const solutionPath = naivPathFinder(north, south, east, west);

    // Stop the ongoing animation, if any
    clearTimeout(timeoutID);

    switch(level) {
        case "puppy":
            drawSolution(ctx, solutionPath, 500);
            break;
        case "medium":
            drawSolution(ctx, solutionPath, 200);
            break;
        case "hard":
            drawSolution(ctx, solutionPath, 100);
            break;
        case "nightmare":
            drawSolution(ctx, solutionPath, 50);
            break;
        case "show result":
            drawSolution(ctx, solutionPath, 1);
            break;
        default:
            drawSolution(ctx, solutionPath, 1);
            break;
    }
}
