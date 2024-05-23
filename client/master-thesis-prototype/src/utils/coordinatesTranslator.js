/**
 * Calculates the translated origin point based on the provided coordinates and container bounding rectangle.
 *
 * @param {number} [x=props.position.x] - The x-coordinate of the origin point (default: props.position.x).
 * @param {number} [y=props.position.y] - The y-coordinate of the origin point (default: props.position.y).
 * @param {function} getContainerBoundingClientRect - A function to get the bounding rectangle of the container.
 * @return {Object} An object representing the translated origin point with 'x' and 'y' properties.
 */
function translatedOrigin(x, y, getContainerBoundingClientRect) {
  const clientOffset = getContainerBoundingClientRect();
  return {
    x: clientOffset.left + x,
    y: clientOffset.top + y,
  };
}


/**
 * Converts a screen point to a point in the coordinate system of a given translation.
 *
 * @param {number} x - The x-coordinate of the screen point.
 * @param {number} y - The y-coordinate of the screen point.
 * @param {number} translateX - The translation in the x-axis.
 * @param {number} translateY - The translation in the y-axis.
 * @param {function} getCtnrBoundingClientRect - A function to get the bounding rectangle of the container.
 * @return {Object} An object representing the point in the translated coordinate system with 'x' and 'y' properties.
 */
export function clientPosToTranslatedPos(x, y, translateX, translateY, getCtnrBoundingClientRect) {
  const origin = translatedOrigin(translateX, translateY, getCtnrBoundingClientRect);
  return {
    x: x - origin.x,
    y: y - origin.y,
  };
}
