import ImageStateTypes from './imageStateTypes';

const INITIAL_STATE = {

  rotation: 0,
  isLocked: false,
  position: {
    x: 0, // x coord
    y: 0, // y coord
    z: 1, // scale factor
  },
};


const ImageStateReducer = (state = INITIAL_STATE, action, actions) => {
  switch (action.type) {
    case ImageStateTypes.ROTATE:
      return ({
        ...state,
        rotation: eval(`(state.rotation ${action.payload} 90) % 360`),
      });

    case ImageStateTypes.TOGGLE_LOCK:
      return ({
        ...state,
        isLocked: !state.isLocked,
      });

    case ImageStateTypes.RESET:
      return INITIAL_STATE;

    case ImageStateTypes.MOVE:
      return ({
        ...state,
        position: {
          ...state.position,
          [action.payload.var]:
            eval(`(state.position.${action.payload.var} 
                ${action.payload.operation} 
                ${action.payload.stepSize})`),
        },
      });

    case ImageStateTypes.UPDATE_POSITION:
      return ({
        ...state,
        position: {
          ...state.position,
          ...action.payload,
        },
      });

    default:
      return state;
  }

};


export default ImageStateReducer;
