import { useState, useEffect } from "react";
import { generateMaze } from "../../utils/generateMaze";
import { getRandomPosition } from "../../utils/getRandomPosition";
import { hasPath } from "../../utils/hasPath";
import MazeCanvas from "./MazeCanvas";
import SetupOptions from "./SetupOptions";
import ConfirmModal from "./ConfirmModal";
import useAnimateAgent from "../hooks/useAnimateAgent";
import {
  ALL_RANDOM,
  RANDOM_MAZE_AND_SET_START_GOAL,
} from "../constants/gameTypes";

const Game = () => {
  const [position, setPosition] = useState(null);
  const [direction, setDirection] = useState("right");
  const [maze, setMaze] = useState(null);
  const [goal, setGoal] = useState(null);
  const [setupPhase, setSetupPhase] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startSet, setStartSet] = useState(false);
  const [goalSet, setGoalSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState("start");
  const [showBlockOption, setShowBlockOption] = useState(false);
  const [gameType, setGameType] = useState(null);

  const animateAgent = useAnimateAgent(300);

  const generateNewMaze = () => {
    let newMaze = generateMaze(29, 29);
    while (!hasPath(newMaze)) {
      newMaze = generateMaze(29, 29);
    }
    return newMaze;
  };

  const moveAgent = (dx, dy) => {
    const newRow = position.y + dy;
    const newCol = position.x + dx;
    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] === 1
    ) {
      setPosition({ x: newCol, y: newRow });
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        moveAgent(0, -1);
        break;
      case "ArrowDown":
        moveAgent(0, 1);
        break;
      case "ArrowLeft":
        moveAgent(-1, 0);
        setDirection("left");
        break;
      case "ArrowRight":
        moveAgent(1, 0);
        setDirection("right");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maze, position]);

  const handleCanvasClick = (event) => {
    if (setupPhase) {
      const rect = event.target.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / 20);
      const y = Math.floor((event.clientY - rect.top) / 20);

      if (x >= 0 && x < maze[0].length && y >= 0 && y < maze.length) {
        if (selectedOption === "start" && maze[y][x] === 1) {
          setPosition({ x, y });
          setStartSet(true);
          setSelectedOption("goal"); // Move to next phase
        } else if (selectedOption === "goal" && maze[y][x] === 1) {
          setGoal({ x, y });
          setGoalSet(true);
          if (startSet && goalSet && selectedOption !== "block") {
            setShowModal(true); // Show modal if first button was used
          }
        } else if (selectedOption === "block") {
          setMaze((prevMaze) => {
            const newMaze = prevMaze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (rowIndex === y && colIndex === x) {
                  return cell === 1 ? 2 : 1; // Toggle between walkable and impassable
                }
                return cell;
              }),
            );
            return newMaze;
          });
        }
      }
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setSetupPhase(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleRandomStartAndGoal = () => {
    const newMaze = generateNewMaze();
    const start = getRandomPosition(newMaze);
    let goal = getRandomPosition(newMaze);
    while (start.x === goal.x && start.y === goal.y) {
      goal = getRandomPosition(newMaze);
    }
    setMaze(newMaze);
    setGoal(goal);
    setPosition(start); // Set position to start
    setSetupPhase(false); // Start game immediately with random positions
  };

  const handleSetupComplete = () => {
    if (startSet && goalSet && selectedOption === "block") {
      setShowModal(true); // Show modal if last button was used and blocks are placed
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setShowBlockOption(value === "block");
  };

  const handleGameTypeChange = (type) => {
    setGameType(type);
    if (type === ALL_RANDOM) {
      handleRandomStartAndGoal();
    } else if (type === RANDOM_MAZE_AND_SET_START_GOAL) {
      const newMaze = generateNewMaze();
      setMaze(newMaze);
      setStartSet(false);
      setGoalSet(false);
      setSelectedOption("start");
      setShowBlockOption(false); // Hide block option for this type
    } else {
      const newMaze = generateNewMaze();
      setMaze(newMaze);
      setStartSet(false);
      setGoalSet(false);
      setSelectedOption("start");
      setShowBlockOption(true); // Show block option for this type
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-900">
      <SetupOptions
        gameType={gameType}
        setupPhase={setupPhase}
        selectedOption={selectedOption}
        showBlockOption={showBlockOption}
        handleGameTypeChange={handleGameTypeChange}
        handleOptionChange={handleOptionChange}
        handleSetupComplete={handleSetupComplete}
      />
      {gameType && (
        <div className="box-border" onClick={handleCanvasClick}>
          <MazeCanvas
            maze={maze}
            position={position}
            animateAgent={animateAgent}
            direction={direction}
            goal={goal}
          />
        </div>
      )}
      {showModal && (
        <ConfirmModal
          showBlockOption={showBlockOption}
          onModalConfirm={handleModalConfirm}
          onModalCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default Game;
