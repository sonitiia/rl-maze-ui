// Функція для генерації лабіринту за допомогою алгоритму "Recursive Backtracker"
export const generateMaze = (width, height) => {
  // Створюємо пустий лабіринт
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1),
  );

  // Вибираємо випадкову стартову та кінцеву точку
  const startRow = Math.floor(Math.random() * height);
  const startCol = Math.floor(Math.random() * width);
  const endRow = Math.floor(Math.random() * height);
  const endCol = Math.floor(Math.random() * width);

  // Встановлюємо непрохідні клітини по краях
  for (let i = 0; i < height; i++) {
    maze[i][0] = 0; // ліва стіна
    maze[i][width - 1] = 0; // права стіна
  }
  for (let j = 0; j < width; j++) {
    maze[0][j] = 0; // верхня стіна
    maze[height - 1][j] = 0; // нижня стіна
  }

  // Встановлюємо стартову та кінцеву точки
  maze[startRow][startCol] = 1;
  maze[endRow][endCol] = 1;

  // Викликаємо рекурсивну функцію для створення лабіринту
  recursiveBacktracker(maze, startRow, startCol);

  return maze;
};

// Рекурсивна функція для генерації лабіринту
const recursiveBacktracker = (maze, row, col) => {
  // Визначаємо можливі напрямки руху
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  // Випадково перемішуємо напрямки руху
  directions.sort(() => Math.random() - 0.5);

  // Проходимося по кожному напрямку
  for (const [dx, dy] of directions) {
    const newRow = row + dy * 2;
    const newCol = col + dx * 2;

    // Перевіряємо чи нова клітина знаходиться в межах лабіринту і чи вона є стіною
    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] === 1
    ) {
      // Видаляємо стіну між поточною клітиною і новою клітиною
      maze[row + dy][col + dx] = 0;
      maze[newRow][newCol] = 0;

      // Викликаємо рекурсивну функцію для нової клітини
      recursiveBacktracker(maze, newRow, newCol);
    }
  }
};
