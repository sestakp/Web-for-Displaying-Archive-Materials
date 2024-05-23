import ImageFilterTypes from './ImageFilterTypes';

const INITIAL_STATE = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotation: 0,
  grayScale: 0,
  invert: 0,
  sepia: 0,
};

const ImageFilterReducer = (state = INITIAL_STATE, action, actions) => {
  switch (action.type) {
  case ImageFilterTypes.RESET:
    return INITIAL_STATE;

  case ImageFilterTypes.SET_FILTER:
    console.log("setting filter: ", action.payload)
    return {
      ...state,
      [action.payload.field]: action.payload.value,
    };

  default:
    return state;
  }
};


export default ImageFilterReducer;
