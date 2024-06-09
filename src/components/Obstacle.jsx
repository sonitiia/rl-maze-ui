import GhostImage from "../assets/ghost.png";

const Obstacle = {
  draw: (context, cellSize, dynamicObstacle) => {
    const obstacle = new Image();
    obstacle.src = GhostImage;
    obstacle.onload = () => {
      context.drawImage(
        obstacle,
        dynamicObstacle.x * cellSize,
        dynamicObstacle.y * cellSize,
        cellSize,
        cellSize,
      );
    };
  },
};

export default Obstacle;
