export const getRandomPosition = (maze) => {
  const availablePositions = [];
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        availablePositions.push({ x, y });
      }
    }
  }
  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  return availablePositions[randomIndex];
};
