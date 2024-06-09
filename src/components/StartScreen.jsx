const StartScreen = ({ onStartClick }) => {
  return (
    <div className="button-container mb-4 flex flex-col items-center gap-5 max-w-xs w-full text-center">
      <div className="relative group max-w-lg w-full mb-32">
        <span className="text-slate-200 py-2 px-4 rounded bg-orange-900">
          Про програму 💡
        </span>
        <div
          className="tooltip absolute z-10 p-2 text-sm rounded opacity-0 group-hover:opacity-100 
              group-hover:scale-100 transition-opacity duration-500 bg-stone-800 text-slate-200 mt-4 w-full"
        >
          Програма, що візуалізує алгоритм Q-навчання, в якому агент навчається
          орієнтуватися в лабіринті та знаходити мету шляхом максимізації
          винагороди.
        </div>
      </div>
      <button
        onClick={onStartClick}
        className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-gray-900 py-2 px-4 rounded w-full"
      >
        Почати
      </button>
    </div>
  );
};

export default StartScreen;
