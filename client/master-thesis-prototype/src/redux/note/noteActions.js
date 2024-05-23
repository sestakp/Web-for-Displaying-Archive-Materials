import NoteTypes from './noteTypes';


const NoteActions = {

  toggleNoteLayerVisibility: () => ({
    type: NoteTypes.TOGGLE_NOTE_VISIBILITY,
  }),
};

export default NoteActions;
