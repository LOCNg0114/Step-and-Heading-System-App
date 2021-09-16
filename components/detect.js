import { findVariance, findMean } from "./findStandardDeviation";
import round from "./round";

export default function detect(data, K, yawData, k) {
  const DYNAMIC_THRESHOLDING = 0.05;
  const MAGNITUDE_THRESHOLD = 0.075;
  const VARIANCE_STEP = 0.01;
  const WINDOW = 25;
  const a = (f) => 0.0000545 * f * f - 0.00501 * f + 0.15495; // f tang a giam
  const b = (f) => -0.0000461 * f * f + 0.00404 * f - 0.13; // f tang b tang
  const c = (f) => 0.0000102 * f * f - 0.000913 * f + 0.0336; // f tang c giam

  var peak = [];

  for (let i = K; i < data.length - K; i++) {
    if (
      data[i] > Math.max(...data.slice(i - K, i)) &&
      data[i] > Math.max(...data.slice(i + 1, i + K + 1))
    ) {
      let window = Math.floor((i - K) / WINDOW);
      let minPeak = Math.min(
        ...data.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );
      let maxPeak = Math.max(
        ...data.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );
      let dynamicThresholding = (minPeak + maxPeak) / 2;

      let variance = findVariance(
        data.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );

      peak.push({
        mag: data[i],
        heading: yawData[i],
        // time: (loop - 1) * (data.length - 2 * K) + i,
        // minPeak: minPeak,
        // maxPeak: maxPeak,
        variance: variance,
        // index: i,
        // window: (loop * (data.length - 2 * K)) / WINDOW + window,
        dynamicThresholding: dynamicThresholding,
      });
    }
  }

  // peak = peak.filter((item) => item.variance >= VARIANCE_STEP);

  peak = peak.filter((item) => item.mag >= MAGNITUDE_THRESHOLD);

  peak = peak.filter(
    (item) => item.mag - item.dynamicThresholding >= DYNAMIC_THRESHOLDING
  );

  const stepF = peak.length * 60;
  for (let i = 0; i < peak.length; i++) {
    if (stepF > 0) {
      peak[i].sl = round(
        (k *
          (-b(stepF) +
            Math.sqrt(
              b(stepF) * b(stepF) - 4 * a(stepF) * (c(stepF) - peak[i].variance)
            ))) /
          (2 * a(stepF))
      );
    }
  }

  return peak;
}
