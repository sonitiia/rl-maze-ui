import { useRef, useState, useEffect } from "react";
import CharacterImage1 from "../assets/skeleton-09_attack_00.png";
import CharacterImage2 from "../assets/skeleton-09_attack_02.png";
import { generateMaze } from "../../utils/generateMaze";
import { getRandomPosition } from "../../utils/getRandomPosition";
import { hasPath } from "../../utils/hasPath";
import Button from "./Button";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [direction, setDirection] = useState("right");
  const [frame, setFrame] = useState(0);
  const [maze, setMaze] = useState(null);
  const [goal, setGoal] = useState(null);
  const [setupPhase, setSetupPhase] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startSet, setStartSet] = useState(false);
  const [goalSet, setGoalSet] = useState(false);
  const [, setBlocksPlaced] = useState(false);
  const [selectedOption, setSelectedOption] = useState("start");
  const [showBlockOption, setShowBlockOption] = useState(false);
  const [gameType, setGameType] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % 2);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (maze) {
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
          context.fillStyle =
            cell === 1 ? "#ddd" : cell === 2 ? "#333" : "#333";
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

      if (position) drawAgent(context, cellSize);
      if (goal) drawGoal(context, cellSize);
    }
  }, [maze, frame, direction, position, goal]);

  const drawAgent = (context, cellSize) => {
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
  };

  const drawGoal = (context, cellSize) => {
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
  };

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
      const rect = canvasRef.current.getBoundingClientRect();
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
    setStartSet(false);
    setGoalSet(false);
    setBlocksPlaced(false);
    setSelectedOption("start");
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
    if (type === "Random Start and Goal") {
      handleRandomStartAndGoal();
    } else {
      const newMaze = generateNewMaze();
      setMaze(newMaze);
      setStartSet(false);
      setGoalSet(false);
      setBlocksPlaced(false); // Reset block placement flag
      setSelectedOption("start");
      setShowBlockOption(type === "Place Start, Goal, and Blocks"); // Show block option only for specific type
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-900">
      <div className="button-container mb-4 flex flex-col items-center gap-5 max-w-lg text-center">
        {!gameType && setupPhase && (
          <>
            <div className="relative group max-w-lg w-full mb-32 ">
              <span className="text-slate-200 py-2 px-4 rounded bg-orange-900">
                Readme 💡
              </span>
              <div className="tooltip absolute z-10 p-2 text-sm rounded opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-opacity duration-500 bg-stone-800 text-slate-200 mt-4">
                This application visualizes a reinforcement learning algorithm
                where an agent learns to navigate a maze and find the goal
                point.
              </div>
            </div>
            <p className="text-slate-200 text-4xl mb-4">
              Choose maze creation type
            </p>
            <Button
              title="All random"
              onClick={() => handleGameTypeChange("Random Start and Goal")}
            />
            <Button
              title="Random maze, select start and goal"
              onClick={() => handleGameTypeChange("Select Start and Goal")}
            />
            <Button
              title="Select all"
              onClick={() =>
                handleGameTypeChange("Place Start, Goal, and Blocks")
              }
            />
          </>
        )}
        {(gameType === "Select Start and Goal" ||
          gameType === "Place Start, Goal, and Blocks") &&
          setupPhase && (
            <>
              <p className="text-slate-200 text-2xl">
                Agent learns to find goal in maze
              </p>
              <select
                value={selectedOption}
                onChange={(e) => handleOptionChange(e.target.value)}
                className="bg-orange-600 hover:bg-orange-500 text-gray-900 py-2 px-4 rounded outline-none"
              >
                <option value="start">Start Point</option>
                <option value="goal">Goal Point</option>
                {showBlockOption && <option value="block">Place Blocks</option>}
              </select>
              {showBlockOption && selectedOption === "block" && (
                <button
                  onClick={handleSetupComplete}
                  className="bg-orange-500 hover:bg-orange-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Confirm Selection
                </button>
              )}
            </>
          )}
      </div>
      {gameType && (
        <>
          {gameType === "Random Start and Goal" && (
            <p className="text-slate-200 text-2xl">
              Agent learns to find goal in maze
            </p>
          )}
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="box-border"
            onClick={handleCanvasClick}
          />
        </>
      )}
      {showModal && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-stone-900 p-4 rounded px-12 py-8 flex flex-col gap-8">
            <p className="text-slate-200">
              {showBlockOption
                ? "Have you chosen the start and goal points and placed blocks?"
                : "Have you chosen the start and goal points?"}
              ?
            </p>
            <div className="flex justify-end gap-1">
              <button
                onClick={handleModalConfirm}
                className="bg-lime-700 hover:bg-lime-600 text-white py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleModalCancel}
                className="bg-rose-700 hover:bg-rose-600 text-white py-2 px-4 rounded ml-2"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
