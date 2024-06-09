import { getDarkerColor } from "../../utils/getDarkerColor";
import { getRandomColor } from "../../utils/getRandomColor";

export const MAIN_COLOR = getRandomColor();
export const DARKER_COLOR = getDarkerColor(MAIN_COLOR);
export const DARKEST_COLOR = getDarkerColor(DARKER_COLOR, 0.3);
