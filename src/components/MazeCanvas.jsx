import { useEffect, useRef } from "react";
import Agent from "./Agent";
import Goal from "./Goal";

const MazeCanvas = ({ maze, position, animateAgent, direction, goal }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const cellSize = 20;

    const canvasWidth = maze[0].length * cellSize;
    const canvasHeight = maze.length * cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);

    maze.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        context.fillStyle = cell === 1 ? "#ddd" : cell === 2 ? "#333" : "#333";
        context.strokeStyle = "#999";
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

    if (position)
      Agent.draw(context, cellSize, animateAgent, direction, position);
    if (goal) Goal.draw(context, cellSize, goal);
  }, [maze, animateAgent, direction, position, goal]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="box-border"
    ></canvas>
  );
};

export default MazeCanvas;
