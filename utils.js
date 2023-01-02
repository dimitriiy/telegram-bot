export const splitToPairs = (arr) => {
  return arr.reduce((acc, c, i, arr) => {
    if (i % 2) return acc;

    acc.push(arr.slice(i, i + 2));
    return acc;
  }, []);
};
