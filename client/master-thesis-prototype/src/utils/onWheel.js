// https://github.com/strateos/react-map-interaction/blob/master/src/MapInteraction.jsx

import { clamp } from './mathLib';


const minScale = 0.1;
const maxScale = 50;


/**
 * Calculate the change in a coordinate after scaling.
 * The amount that a value of a dimension will change given a new scale
 *
 * @param {number} coordinate - The original coordinate value.
 * @param {number} scaleRatio - The ratio by which the coordinate is scaled.
 * @return {number} The changed coordinate value after scaling.
 */
const coordChange = (coordinate, scaleRatio) => {
  return (scaleRatio * coordinate) - coordinate;
};


/**
 * Clamp a desired translation within specified bounds.
 *
 * @param {Object} desiredTranslation - The desired translation object with x and y coordinates.
 * @param {number} desiredTranslation.x - The desired X coordinate of the translation.
 * @param {number} desiredTranslation.y - The desired Y coordinate of the translation.
 * @param {Object} translationBounds - Optional bounds for the translation.
 * @param {number} translationBounds.xMin - The minimum allowed X coordinate.
 * @param {number} translationBounds.xMax - The maximum allowed X coordinate.
 * @param {number} translationBounds.yMin - The minimum allowed Y coordinate.
 * @param {number} translationBounds.yMax - The maximum allowed Y coordinate.
 * @return {Object} A clamped translation object with x and y coordinates.
 */
function clampTranslation(desiredTranslation,
  translationBounds = { xMin: undefined,
    xMax: undefined,
    yMin: undefined,
    yMax: undefined }) {
  const { x, y } = desiredTranslation;
  let { xMax, xMin, yMax, yMin } = translationBounds;
  xMin = xMin !== undefined ? xMin : -Infinity;
  yMin = yMin !== undefined ? yMin : -Infinity;
  xMax = xMax !== undefined ? xMax : Infinity;
  yMax = yMax !== undefined ? yMax : Infinity;

  return {
    x: clamp(xMin, x, xMax),
    y: clamp(yMin, y, yMax),
  };
}

/**
 * Calculate the translated origin point based on the current position and container reference.
 *
 * @param {Object} position - The current position state.
 * @param {number} position.x - The current X coordinate.
 * @param {number} position.y - The current Y coordinate.
 * @param {React.RefObject} containerRef - A React ref to the container element.
 * @return {Object} An object representing the translated origin point with x and y coordinates.
 */
function translatedOrigin(position, containerRef) {
  const clientOffset = containerRef.current.getBoundingClientRect();
  return {
    x: clientOffset.left + position.x,
    y: clientOffset.top + position.y,
  };
}


/**
 * Converts client coordinates to translated coordinates based on
 * the given position and container reference.
 * From a given screen point return it as a point in the coordinate
 * system of the given translation
 *
 * @param {Object} clientPos - The client coordinates object.
 * @param {number} clientPos.x - The X coordinate in client space.
 * @param {number} clientPos.y - The Y coordinate in client space.
 * @param {Object} position - The current position state.
 * @param {number} position.x - The current X coordinate.
 * @param {number} position.y - The current Y coordinate.
 * @param {React.RefObject} containerRef - A React ref to the container element.
 * @return {Object} An object with translated coordinates (x and y).
 */
function clientPosToTranslatedPos({ x, y }, position, containerRef) {
  const origin = translatedOrigin(position, containerRef);
  return {
    x: x - origin.x,
    y: y - origin.y,
  };
}

/**
 * Handle the wheel event to zoom in or out of a container.
 *
 * @param {WheelEvent} e - The wheel event object.
 * @param {Object} position - The current position state.
 * @param {number} position.z - The current scale value.
 * @param {React.RefObject} containerRef - A React ref to the container element.
 * @param {function} setPosition - A function to update the position state.
 */
export function onWheel(e, position, containerRef, setPosition) {
  e.preventDefault();
  e.stopPropagation();

  const scaleChange = 2 ** (e.deltaY * 0.002);

  const newScale = clamp(
    minScale,
    position.z + (1 - scaleChange),
    maxScale,
  );

  const mousePos = clientPosToTranslatedPos( { x: e.clientX, y: e.clientY },
    position,
    containerRef);

  scaleFromPoint(newScale, mousePos, position, setPosition);
}

/**
 * Scale an element from a specific focal point while maintaining its position.
 *
 * @param {number} newScale - The new scale value.
 * @param {Object} focalPt - The focal point coordinates.
 * @param {number} focalPt.x - The X coordinate of the focal point.
 * @param {number} focalPt.y - The Y coordinate of the focal point.
 * @param {Object} position - The current position state.
 * @param {number} position.x - The current X coordinate.
 * @param {number} position.y - The current Y coordinate.
 * @param {number} position.z - The current scale value.
 * @param {function} setPosition - A function to update the position state.
 */
function scaleFromPoint(newScale, focalPt, position, setPosition) {
  const { x, y, z } = position;
  const scaleRatio = newScale / (z != 0 ? z : 1);

  const focalPtDelta = {
    x: coordChange(focalPt.x, scaleRatio),
    y: coordChange(focalPt.y, scaleRatio),
  };

  const newTranslation = {
    x: x - focalPtDelta.x,
    y: y - focalPtDelta.y,
  };

  const clampedTranslation = clampTranslation(newTranslation);
  setPosition({
    z: newScale,
    x: clampedTranslation.x,
    y: clampedTranslation.y,
  });
}
