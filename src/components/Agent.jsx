import CharacterImage1 from "../assets/skeleton-09_attack_00.png";
import CharacterImage2 from "../assets/skeleton-09_attack_02.png";
import { LEFT_DIRECTION } from "../constants/agentDirections";

const Agent = {
  draw: (context, cellSize, frame, direction, position) => {
    const agent = new Image();
    agent.src = frame === 0 ? CharacterImage1 : CharacterImage2;
    agent.onload = () => {
      context.save();
      if (direction === LEFT_DIRECTION) {
        context.scale(-1, 1);
        context.drawImage(
          agent,
          -(position.x * cellSize + cellSize),
          position.y * cellSize,
          cellSize,
          cellSize,
        );
      } else {
        context.drawImage(
          agent,
          position.x * cellSize,
          position.y * cellSize,
          cellSize,
          cellSize,
        );
      }

      context.restore();
    };
  },
};

export default Agent;
