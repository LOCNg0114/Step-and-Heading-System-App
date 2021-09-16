export function findStandardDeviation(values) {
  var stdDev = Math.sqrt(findVariance(values));
  return stdDev;
}

export function findVariance(values) {
  var avg = findMean(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = findMean(squareDiffs);

  return avgSquareDiff;
}

export function findMean(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
