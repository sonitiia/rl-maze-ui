import { useState, useEffect } from "react";
import { generateMaze } from "../../utils/generateMaze";
import { getRandomPosition } from "../../utils/getRandomPosition";
import { hasPath } from "../../utils/hasPath";
import MazeCanvas from "./MazeCanvas";
import StartScreen from "./StartScreen";
import ConfirmModal from "./ConfirmModal";
import useAnimateAgent from "../hooks/useAnimateAgent";
import webSocketService from "../services/WebSocketService";
import StatisticsChart from "./StatisticsChart";
import Select from "./Select";

const QLearningVisualization = () => {
  const [agentPositions, setAgentPositions] = useState([]);
  const [agentCount, setAgentCount] = useState(1);
  const [maze, setMaze] = useState(null);
  const [start, setStart] = useState([]);
  const [direction] = useState("right");
  const [goal, setGoal] = useState(null);
  const [startLearning, setStartLearning] = useState(false);
  const [setupPhase, setSetupPhase] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isStartSet, setIsStartSet] = useState(false);
  const [isGoalSet, setIsGoalSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState("start");
  const [learningPaused, setLearningPaused] = useState(false);
  const [delay, setDelay] = useState(100);
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [dynamicObstacles, setDynamicObstacles] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);

  const cellSize = 28;

  const animateAgent = useAnimateAgent(300);

  useEffect(() => {
    let obstacleInterval;

    if (startLearning) {
      obstacleInterval = setInterval(() => {
        const validPositions = [];

        maze.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (
              cell === 1 &&
              !(goal && goal.x === colIndex && goal.y === rowIndex)
            ) {
              validPositions.push({ x: colIndex, y: rowIndex });
            }
          });
        });

        const randomIndex = Math.floor(Math.random() * validPositions.length);
        const randomPosition = validPositions[randomIndex];

        if (randomPosition) {
          setDynamicObstacles([randomPosition]);

          setMaze((prevMaze) => {
            const newMaze = prevMaze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (
                  dynamicObstacles.length > 0 &&
                  dynamicObstacles[0].y === rowIndex &&
                  dynamicObstacles[0].x === colIndex
                ) {
                  return 1;
                }

                if (
                  rowIndex === randomPosition.y &&
                  colIndex === randomPosition.x
                ) {
                  return 0;
                }
                return cell;
              }),
            );
            return newMaze;
          });

          webSocketService.sendMessage(
            "/app/maze-websocket.setObstacle",
            {},
            JSON.stringify(randomPosition),
          );
        }

        console.log(dynamicObstacles);

        return () => clearInterval(obstacleInterval);
      }, 5000);
    }

    return () => clearInterval(obstacleInterval);
  }, [startLearning, maze, dynamicObstacles, goal]);

  const generateNewMaze = () => {
    let newMaze = generateMaze(15, 15);

    const start = getRandomPosition(newMaze);
    let goal = getRandomPosition(newMaze);
    while (start.x === goal.x && start.y === goal.y) {
      goal = getRandomPosition(newMaze);
    }

    while (!hasPath(newMaze, start, goal)) {
      newMaze = generateMaze(15, 15);
    }

    return { newMaze, start, goal };
  };

  const handleCanvasClick = (event) => {
    if (setupPhase) {
      const rect = event.target.getBoundingClientRect();

      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);

      if (x >= 0 && x < maze[0].length && y >= 0 && y < maze.length) {
        if (selectedOption === "start" && maze[y][x] === 1) {
          setStart({ x, y });
          setAgentPositions([{ x, y }]);
          setIsStartSet(true);
          setSelectedOption("goal");
        } else if (selectedOption === "goal" && maze[y][x] === 1) {
          setGoal({ x, y });
          setIsGoalSet(true);
        } else if (selectedOption === "block") {
          setMaze((prevMaze) => {
            const newMaze = prevMaze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (rowIndex === y && colIndex === x) {
                  return cell === 0 ? 1 : 0;
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
    setStartLearning(true);
    sendMazeDataToBackend(maze, start, goal);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleGenerateMaze = () => {
    const { newMaze } = generateNewMaze();
    setMaze(newMaze);
    setSetupPhase(true);
  };

  const handleSetupComplete = () => {
    if (isStartSet && isGoalSet) {
      setShowModal(true);
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const sendMazeDataToBackend = (newMaze, start, goal) => {
    const mazeData = {
      agentsCount: +agentCount,
      start: start,
      goal: goal,
      maze: newMaze,
    };

    webSocketService.sendMessage(
      "/app/maze-websocket.start",
      {},
      JSON.stringify(mazeData),
    );
  };

  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await webSocketService.connectWebSocket();
        webSocketService.subscribeToTopic("/topic/maze", (message) => {
          const receivedData = JSON.parse(message.body);
          const agentsData = receivedData.agents;

          setAgentPositions(agentsData.map((agent) => agent.position));
        });

        webSocketService.subscribeToTopic("/topic/statistics", (message) => {
          const statistics = JSON.parse(message.body);
          console.log(statistics);
          setStatisticsData(statistics);
        });
      } catch (error) {
        console.error("Error initializing WebSocket:", error);
      }
    };

    initializeWebSocket();

    return () => {
      webSocketService.disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (!isSliderDragging) {
      webSocketService.sendMessage(
        "/app/maze-websocket.setDelay",
        {},
        JSON.stringify({ delay: delay }),
      );
    }
  }, [delay, isSliderDragging]);

  const handlePauseLearning = () => {
    webSocketService.sendMessage("/app/maze-websocket.stop", {}, "");
    setLearningPaused(true);
  };

  const handleResumeLearning = () => {
    webSocketService.sendMessage("/app/maze-websocket.resume", {}, "");
    setLearningPaused(false);
  };

  const handleBreakLearning = () => {
    webSocketService.sendMessage("/app/maze-websocket.brake", {}, "");
    setStartLearning(false);
    setLearningPaused(true);
  };

  const handleSliderMouseDown = () => {
    setIsSliderDragging(true);
  };

  const handleSliderMouseUp = () => {
    setIsSliderDragging(false);
  };

  const handleDelayChange = (event) => {
    const newDelay = 1000 - parseInt(event.target.value) * 10;
    setDelay(newDelay);
  };

  const handleAgentCountChange = (event) => {
    setAgentCount(event.target.value);
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen bg-stone-900">
      {!maze && <StartScreen onStartClick={handleGenerateMaze} />}
      {maze && (
        <div className="flex flex-row items-center justify-between gap-12">
          <div className="flex flex-col self-start gap-2">
            {!startLearning && (
              <>
                <Select
                  selectedOption={selectedOption}
                  handleOptionChange={handleOptionChange}
                />
                <div className="flex flex-col">
                  <label className="text-slate-200 mb-2 text-left">
                    Кількість агентів
                  </label>
                  <input
                    type="text"
                    value={+agentCount}
                    onChange={handleAgentCountChange}
                    disabled={startLearning}
                    className="bg-inherit text-white py-2 px-4 rounded outline-none border-2 border-orange-600 "
                  />
                </div>
              </>
            )}
            {setupPhase && isStartSet && isGoalSet && !startLearning && (
              <button
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black mt-4 py-2 px-4 rounded"
                onClick={handleSetupComplete}
              >
                Почати
              </button>
            )}
            {startLearning && (
              <>
                <div className="flex flex-col">
                  <label className="text-slate-200 mb-2">Швидкість</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={100 - delay / 10 + 10}
                    onChange={handleDelayChange}
                    onMouseDown={handleSliderMouseDown}
                    onMouseUp={handleSliderMouseUp}
                    className="accent-orange-600 py-0 px-4 mb-4 rounded outline-none"
                  />
                </div>

                {!learningPaused ? (
                  <button
                    style={{ backgroundColor: "#8c1c6e" }}
                    className="text-white py-2 px-4 rounded"
                    onClick={handlePauseLearning}
                  >
                    Призупинити навчання
                  </button>
                ) : (
                  <button
                    className="bg-lime-600 text-white py-2 px-4 rounded"
                    onClick={handleResumeLearning}
                  >
                    Продовжити навчання
                  </button>
                )}
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded"
                  onClick={handleBreakLearning}
                >
                  Перервати навчання
                </button>
              </>
            )}
          </div>
          <div className="flex flex-row justify-between gap-8 flex">
            <MazeCanvas
              maze={maze}
              cellSize={cellSize}
              agentPositions={agentPositions}
              animateAgent={animateAgent}
              direction={direction}
              start={start}
              goal={goal}
              dynamicObstacles={dynamicObstacles}
              onCanvasClick={handleCanvasClick}
            />
            <StatisticsChart statisticsData={statisticsData} />
          </div>
        </div>
      )}
      {showModal && (
        <ConfirmModal
          onModalConfirm={handleModalConfirm}
          onModalCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default QLearningVisualization;
