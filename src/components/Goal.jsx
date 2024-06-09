import DoorImage from "../assets/door.png";

const Goal = {
  draw: (context, cellSize, goal) => {
    const goalImg = new Image();
    goalImg.src = DoorImage;
    goalImg.onload = () => {
      context.drawImage(
        goalImg,
        goal.x * cellSize,
        goal.y * cellSize,
        cellSize,
        cellSize,
      );
    };
  },
};

export default Goal;
