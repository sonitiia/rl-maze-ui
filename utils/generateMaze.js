export const generateMaze = (width, height) => {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1),
  );

  const startRow = Math.floor(Math.random() * height);
  const startCol = Math.floor(Math.random() * width);
  const endRow = Math.floor(Math.random() * height);
  const endCol = Math.floor(Math.random() * width);

  for (let i = 0; i < height; i++) {
    maze[i][0] = 0; // left wall
    maze[i][width - 1] = 0; // right wall
  }
  for (let j = 0; j < width; j++) {
    maze[0][j] = 0; // top wall
    maze[height - 1][j] = 0; // bottom wall
  }

  maze[startRow][startCol] = 1;
  maze[endRow][endCol] = 1;

  recursiveBacktracker(maze, startRow, startCol);

  return maze;
};

const recursiveBacktracker = (maze, row, col) => {
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  directions.sort(() => Math.random() - 0.5);

  for (const [dx, dy] of directions) {
    const newRow = row + dy * 2;
    const newCol = col + dx * 2;

    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] === 1
    ) {
      maze[row + dy][col + dx] = 0;
      maze[newRow][newCol] = 0;
      recursiveBacktracker(maze, newRow, newCol);
    }
  }
};
