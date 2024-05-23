import NoteTypes from './noteTypes';

const INITIAL_STATE = {

  isNoteLayerVisible: true,
};

const NoteReducer = (state = INITIAL_STATE, action, actions) => {
  switch (action.type) {
  case NoteTypes.TOGGLE_NOTE_VISIBILITY:
    return ({
      ...state,
      isNoteLayerVisible: ! state.isNoteLayerVisible,
    });


    default:
      return state;
  }

};


export default NoteReducer;
