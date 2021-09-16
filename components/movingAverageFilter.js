import round from "./round";

export default function movingAverageFilter(arr, range) {
  let filteredArr = [];
  let lr = Math.floor(range / 2);
  for (let i = 0; i < arr.length; i++) {
    if (i < lr) {
      filteredArr.push(round(sum(arr.slice(0, lr + i + 1)) / (lr + i + 1)));
    } else if (i < arr.length - lr) {
      filteredArr.push(round(sum(arr.slice(i - lr, i + lr + 1)) / range));
    } else {
      filteredArr.push(
        round(sum(arr.slice(i - lr, arr.length)) / (lr + arr.length - i))
      );
    }
  }
  return filteredArr;
}

function sum(arr) {
  let sumTemp = 0;
  for (const value of arr) {
    sumTemp += value;
  }
  return sumTemp;
}
