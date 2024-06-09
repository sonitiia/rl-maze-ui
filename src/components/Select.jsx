const Select = ({ selectedOption, handleOptionChange }) => {
  return (
    <select
      value={selectedOption}
      onChange={(e) => handleOptionChange(e.target.value)}
      className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-gray-900 py-2 px-4 rounded outline-none"
    >
      <option value="start">Обрати початкову точку</option>
      <option value="goal">Обрати кінцеву точку</option>
      <option value="block">Редагувати лабіринт</option>
    </select>
  );
};

export default Select;
