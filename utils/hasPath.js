export const hasPath = (maze) => {
  const visited = new Array(maze.length)
    .fill(false)
    .map(() => new Array(maze[0].length).fill(false));
  const queue = [];
  const endRow = maze.length - 2;
  const endCol = maze[0].length - 3;

  queue.push([1, 1]);
  visited[1][1] = true;

  while (queue.length) {
    const [row, col] = queue.shift();
    if (row === endRow && col === endCol) {
      return true;
    }

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dx, dy] of directions) {
      const newRow = row + dy;
      const newCol = col + dx;
      if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] === 1
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
      }
    }
  }
  return false;
};
