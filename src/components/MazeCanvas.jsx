import { useEffect, useRef, useState } from "react";
import Agent from "./Agent";
import Goal from "./Goal";
import Obstacle from "./Obstacle";
import { LEFT_DIRECTION, RIGHT_DIRECTION } from "../constants/agentDirections";

const MazeCanvas = ({
  maze,
  cellSize,
  agentPositions,
  animateAgent,
  start,
  goal,
  dynamicObstacles,
  onCanvasClick,
}) => {
  const canvasRef = useRef(null);
  const [prevAgentPositions, setPrevAgentPositions] = useState(agentPositions);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const canvasWidth = maze[0].length * cellSize;
    const canvasHeight = maze.length * cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);

    maze.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        context.fillStyle = cell === 1 ? "#331b2a" : "#8c1c6e";
        context.strokeStyle = cell === 1 ? "transparent" : "#f97316";
        context.lineWidth = 2;
        context.fillRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize,
        );
        context.strokeRect(
          colIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize,
        );
      });
    });

    agentPositions.forEach((position, index) => {
      const prevPosition = prevAgentPositions[index];
      let direction = RIGHT_DIRECTION;

      if (prevPosition) {
        if (position.x < prevPosition.x) {
          direction = LEFT_DIRECTION;
        } else if (position.x > prevPosition.x) {
          direction = RIGHT_DIRECTION;
        }
      }

      Agent.draw(context, cellSize, animateAgent, direction, position);
    });

    if (goal) Goal.draw(context, cellSize, goal);

    if (dynamicObstacles.length > 0) {
      dynamicObstacles.forEach((dynamicObstacle) => {
        Obstacle.draw(context, cellSize, dynamicObstacle);
      });
    }

    setPrevAgentPositions(agentPositions);
  }, [
    maze,
    cellSize,
    animateAgent,
    agentPositions,
    start,
    goal,
    dynamicObstacles,
    prevAgentPositions,
  ]);

  return <canvas ref={canvasRef} onClick={onCanvasClick} />;
};

export default MazeCanvas;
