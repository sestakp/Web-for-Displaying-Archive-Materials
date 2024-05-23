import ImageFilterTypes from './ImageFilterTypes';


const ImageFilterActions = {


  reset: () => ({
    type: ImageFilterTypes.RESET,
  }),

  setBrightness: (value) => {
    console.log("setBrightness action: ", value)
    return {
      type: ImageFilterTypes.SET_FILTER,
      payload: {
        field: 'brightness',
        value,
      },
    }
  },

  setContrast: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'contrast',
      value,
    },
  }),

  setSaturation: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'saturation',
      value,
    },
  }),

  sethueRotation: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'hueRotation',
      value,
    },
  }),

  setGrayScale: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'grayScale',
      value,
    },
  }),

  setInvert: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'invert',
      value,
    },
  }),

  setSepia: (value) => ({
    type: ImageFilterTypes.SET_FILTER,
    payload: {
      field: 'sepia',
      value,
    },
  }),


};

export default ImageFilterActions;
