import {
  ALL_RANDOM,
  RANDOM_MAZE_AND_SET_START_GOAL,
  SET_START_GOAL_BLOCKS,
} from "../constants/gameTypes";
import Button from "./Button";

const SetupOptions = ({
  gameType,
  setupPhase,
  selectedOption,
  showBlockOption,
  handleGameTypeChange,
  handleOptionChange,
  handleSetupComplete,
}) => {
  return (
    <div className="button-container mb-4 flex flex-col items-center gap-5 max-w-lg text-center">
      {!gameType && setupPhase && (
        <>
          <div className="relative group max-w-lg w-full mb-32 ">
            <span className="text-slate-200 py-2 px-4 rounded bg-orange-900">
              Readme 💡
            </span>
            <div className="tooltip absolute z-10 p-2 text-sm rounded opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-opacity duration-500 bg-stone-800 text-slate-200 mt-4">
              This application visualizes a reinforcement learning algorithm
              where an agent learns to navigate a maze and find the goal point.
            </div>
          </div>
          <p className="text-slate-200 text-4xl mb-4">
            Choose maze creation type
          </p>
          <Button
            title="All random"
            onClick={() => handleGameTypeChange(ALL_RANDOM)}
          />
          <Button
            title="Random maze, select start and goal"
            onClick={() => handleGameTypeChange(RANDOM_MAZE_AND_SET_START_GOAL)}
          />
          <Button
            title="Select all"
            onClick={() => handleGameTypeChange(SET_START_GOAL_BLOCKS)}
          />
        </>
      )}
      {(gameType === RANDOM_MAZE_AND_SET_START_GOAL ||
        gameType === SET_START_GOAL_BLOCKS) &&
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
  );
};

export default SetupOptions;
