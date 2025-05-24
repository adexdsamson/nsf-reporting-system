export const stringToColour = (str: string) => {
  let hueValue = 0;

  for (let i = 0; i < str.length; i++) {
    hueValue += str.charCodeAt(i);
  }

  return `hsl(${hueValue % 360}, 60%, 50%)`
}