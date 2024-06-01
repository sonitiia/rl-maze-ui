const Goal = {
  draw: (context, cellSize, goal) => {
    context.fillStyle = "brown";
    context.beginPath();
    context.arc(
      (goal.x + 0.5) * cellSize,
      (goal.y + 0.5) * cellSize,
      cellSize / 3,
      0,
      2 * Math.PI,
    );
    context.fill();
  },
};

export default Goal;
