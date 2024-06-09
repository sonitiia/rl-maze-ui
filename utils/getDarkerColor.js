export const getDarkerColor = (color, factor = 0.7) => {
  let r = Math.round(parseInt(color.slice(1, 3), 16) * factor);
  let g = Math.round(parseInt(color.slice(3, 5), 16) * factor);
  let b = Math.round(parseInt(color.slice(5, 7), 16) * factor);
  r = r.toString(16).padStart(2, "0");
  g = g.toString(16).padStart(2, "0");
  b = b.toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
};
