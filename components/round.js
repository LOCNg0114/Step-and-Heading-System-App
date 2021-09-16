export default function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 10000) / 10000;
}
