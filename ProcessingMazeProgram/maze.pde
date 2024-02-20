int n = 20;
int factor = 40;
final int NORTH = 0;
final int EAST = 1;
final int SOUTH = 2;
final int WEST = 3;
boolean [][] north;
boolean [][] east;
boolean [][] south;
boolean [][] west;
boolean [][] visited;

void settings() {
  size((n+2) * factor, (n+2) * factor);
}

void setup() {
  init();
  generate(1,1);
  drawMaze();
  save("lab.png");
}


void init() {
  visited = new boolean[n + 2][n + 2];
  for (int x = 0; x < n+2; x++) {
    visited[x][0] = true;
    visited[x][n+1] = true;
  }
  for (int y = 0; y < n+2; y++) {
    visited[0][y] = true;
    visited[n+1][y] = true;
  }

  north = new boolean[n+2][n+2];
  east  = new boolean[n+2][n+2];
  south = new boolean[n+2][n+2];
  west  = new boolean[n+2][n+2];
  for (int x = 0; x < n+2; x++) {
    for (int y = 0; y < n+2; y++) {
      north[x][y] = true;
      east[x][y]  = true;
      south[x][y] = true;
      west[x][y]  = true;
    }
  }
}

void drawMaze() {
  north[1][1] = false;
  south[n][n] = false;
  strokeWeight(5);
  for (int x = 1; x <= n; x++) {
    for (int y = 1; y <= n; y++) {
      if (north[x][y]) line(x * factor, y * factor, (x+1) * factor, y * factor);
      if (south[x][y]) line(x * factor, (y+1) * factor, (x+1) * factor, (y+1) * factor);
      if (west[x][y])  line(x * factor, y * factor, x * factor, (y+1) * factor);
      if (east[x][y])  line((x+1) * factor, y * factor, (x+1) * factor, (y+1) * factor);
    }
  }
}

void generate(int x, int y) {
  visited[x][y] = true;
  while (!visited[x][y+1] || !visited[x+1][y] || !visited[x][y-1] || !visited[x-1][y]) {
    double r = int(random(0, 4));
    if (r == NORTH && !visited[x][y-1]) {
      north[x][y] = false;
      south[x][y-1] = false;
      generate(x, y-1);
    } else if (r == EAST && !visited[x+1][y]) {
      east[x][y] = false;
      west[x+1][y] = false;
      generate(x+1, y);
    } else if (r == SOUTH && !visited[x][y+1]) {
      south[x][y] = false;
      north[x][y+1] = false;
      generate(x, y + 1);
    } else if (r == WEST && !visited[x-1][y]) {
      west[x][y] = false;
      east[x-1][y] = false;
      generate(x-1, y);
    }
  }
}