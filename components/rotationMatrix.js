import math, { multiply, matrix, cos, sin } from "mathjs";

export default function rotationMatrix(data, pitch, roll) {
  pitch = -pitch;
  roll = -roll;

  let R_pitch = matrix([
    [1, 0, 0],
    [0, cos(pitch), sin(pitch)],
    [0, -sin(pitch), cos(pitch)],
  ]);

  let R_roll = matrix([
    [cos(roll), 0, -sin(roll)],
    [0, 1, 0],
    [sin(roll), 0, cos(roll)],
  ]);

  let R = multiply(R_roll, R_pitch);

  return multiply(R, data);
}
