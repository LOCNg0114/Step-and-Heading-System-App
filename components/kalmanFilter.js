export default function kalmanFilter(data, R, Q) {
  let predicted = [data[0]];
  let p = [1];
  let i = 0;
  let p_temp = 0;
  let Kg = 0;
  while (i < data.length - 1) {
    p_temp = p[i] + Q;
    Kg = p_temp / (p_temp + R);

    predicted[i + 1] = predicted[i] + Kg * (data[i] - predicted[i]);
    p[i + 1] = (1 - Kg) * p[i];
    i++;
  }
  return predicted;
}
