import ImageStateTypes from './imageStateTypes';


const stepSize = 10;
const scaleSize = 0.1;

const ImageStateActions = {

  rotateLeft: () => ({
    type: ImageStateTypes.ROTATE,
    payload: '-',
  }),

  rotateRight: () => ({
    type: ImageStateTypes.ROTATE,
    payload: '+',
  }),

  toggleLock: () => ({
    type: ImageStateTypes.TOGGLE_LOCK,
  }),

  reset: () => ({
    type: ImageStateTypes.RESET,
  }),

  moveLeft: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '+',
      var: 'x',
      stepSize,
    },
  }),

  moveRight: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '-',
      var: 'x',
      stepSize,
    },
  }),

  moveUp: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '+',
      var: 'y',
      stepSize,
    },
  }),

  moveDown: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '-',
      var: 'y',
      stepSize,
    },
  }),

  increaseScale: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '*',
      var: 'z',
      stepSize: 1 + scaleSize,
    },
  }),

  decreaseScale: () => ({
    type: ImageStateTypes.MOVE,
    payload: {
      operation: '*',
      var: 'z',
      stepSize: 1 - scaleSize,
    },
  }),

  updatePosition: (diff) => ({
    type: ImageStateTypes.UPDATE_POSITION,
    payload: diff,
  }),
};

export default ImageStateActions;
