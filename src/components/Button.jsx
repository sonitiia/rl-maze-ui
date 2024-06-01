const Button = ({ onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange-600 hover:bg-orange-500 text-gray-900 py-2 px-4 rounded w-full max-w-xs"
    >
      {title}
    </button>
  );
};

export default Button;
