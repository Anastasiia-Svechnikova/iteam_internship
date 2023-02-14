/** 
 * accepts a time value in Ms as a number and
 * returns the time value as a string in format HH : MM : SS
 */
export const transformTime = (totalTime: number): string => {
    // extract the separate time values for hours, min, sec
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime - hours * 3600) / 60);
  const seconds = totalTime - hours * 3600 - minutes * 60;

  //transfrom number values to string with 0 at the beginning if needed
  const padStart = (num: number) => String(num).padStart(2, '0');

  return `${padStart(hours)} : ${padStart(minutes)} : ${padStart(seconds)}`;
};
