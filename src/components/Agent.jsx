import CharacterImage1 from "../assets/skeleton-09_attack_00.png";
import CharacterImage2 from "../assets/skeleton-09_attack_02.png";

const Agent = {
  draw: (context, cellSize, frame, direction, position) => {
    const agent = new Image();
    agent.src = frame === 0 ? CharacterImage1 : CharacterImage2;
    agent.onload = () => {
      if (direction === "left") {
        context.save();
        context.scale(-1, 1);
        context.drawImage(
          agent,
          -((position.x + 1) * cellSize),
          position.y * cellSize,
          cellSize,
          cellSize,
        );
        context.restore();
      } else {
        context.drawImage(
          agent,
          position.x * cellSize,
          position.y * cellSize,
          cellSize,
          cellSize,
        );
      }
    };
  },
};

export default Agent;
