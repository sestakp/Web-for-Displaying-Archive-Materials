/*
Based on: https://github.com/strateos/react-map-interaction/blob/master/src/geometry.js
Licence: MIT
*/

/**
 * Clamps a value between a minimum and maximum value.
 *
 * @param {number} min - The minimum value.
 * @param {number} value - The value to clamp.
 * @param {number} max - The maximum value.
 * @return {number} The clamped value.
 */
function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Calculates the Euclidean distance between two points in a 2D plane.
 *
 * @param {Object} p1 - The first point with properties `x` and `y`.
 * @param {number} p1.x - The x-coordinate of the first point.
 * @param {number} p1.y - The y-coordinate of the first point.
 * @param {Object} p2 - The second point with properties `x` and `y`.
 * @param {number} p2.x - The x-coordinate of the second point.
 * @param {number} p2.y - The y-coordinate of the second point.
 * @return {number} The Euclidean distance between the two points.
 */
function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

/**
 * Calculates the midpoint between two points in a 2D plane.
 *
 * @param {Object} p1 - The first point with properties `x` and `y`.
 * @param {number} p1.x - The x-coordinate of the first point.
 * @param {number} p1.y - The y-coordinate of the first point.
 * @param {Object} p2 - The second point with properties `x` and `y`.
 * @param {number} p2.x - The x-coordinate of the second point.
 * @param {number} p2.y - The y-coordinate of the second point.
 * @return {Object} An object representing the midpoint with properties `x` and `y`.
 */
function midpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * Converts a Touch object's client coordinates into a point with x and y properties.
 *
 * @param {Touch} touch - The Touch object representing a touch event.
 * @return {Object} An object representing a point with properties `x` and `y`.
 */
function touchPt(touch) {
  return { x: touch.clientX, y: touch.clientY };
}

/**
 * Calculates the distance between two touch points.
 *
 * @param {Touch} t0 - The first Touch object representing a touch event.
 * @param {Touch} t1 - The second Touch object representing a touch event.
 * @return {number} The distance between the two touch points.
 */
function touchDistance(t0, t1) {
  const p0 = touchPt(t0);
  const p1 = touchPt(t1);
  return distance(p0, p1);
}

export {
  clamp,
  distance,
  midpoint,
  touchPt,
  touchDistance,
};
