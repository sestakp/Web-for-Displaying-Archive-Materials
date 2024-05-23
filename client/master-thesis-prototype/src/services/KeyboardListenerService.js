import ImageStateActions from '../redux/ImageState/imageStateActions';

import FullscreenUtil from '@utils/fullscreenUtil';
import GalleryActions from '../redux/gallery/galleryActions';
import logger from '../utils/loggerUtil';

/**
 * KeyboardService handles keyboard events, captures pressed keys, and triggers actions based on key combinations.
 * It provides methods to start and stop listening for keydown and keyup events on the window.
 *
 * @class
 */
class KeyboardService {
  /**
   * Creates an instance of KeyboardService.
   *
   * @constructor
   * @param {function} dispatch - The dispatch function from a Redux store to trigger actions.
   */
  constructor(dispatch) {
    this.pressedKeys = new Set();
    this.dispatch = dispatch;


    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * Handles keydown events to capture pressed keys and handle key combinations.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  handleKeyDown = (e) => {
    if (e.target.tagName !== 'TEXTAREA') {
      if ( ! this.pressedKeys.has(e.key)) {
        this.pressedKeys.add(e.key);
      }

      // Handle key combinations here
      this.handlePressedKeys();
    }
  };

  /**
   * Handles keyup events to release pressed keys and handle key combinations.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  handleKeyUp = (e) => {
    if (e.target.tagName !== 'TEXTAREA') {
      if (this.pressedKeys.has(e.key)) {
        this.pressedKeys.delete(e.key);
      }

      // Handle key combinations here
      this.handlePressedKeys();
    }
  };

  /**
   * Handles pressed keys and triggers corresponding actions based on key combinations.
   */
  handlePressedKeys() {
    logger.debug('pressed keys: ', this.pressedKeys);
    if (this.pressedKeys.has('ArrowLeft')) {
      this.dispatch(GalleryActions.moveLeft());
    } else if (this.pressedKeys.has('ArrowRight')) {
      this.dispatch(GalleryActions.moveRight());
    } else if (this.pressedKeys.has('r')) {
      this.dispatch(ImageStateActions.rotateRight());
    } else if (this.pressedKeys.has('f')) {
      FullscreenUtil.toggleFullscreen();
    }
    if (this.pressedKeys.has('w')) {
      this.dispatch(ImageStateActions.moveUp());
    }
    if (this.pressedKeys.has('a')) {
      this.dispatch(ImageStateActions.moveLeft());
    }
    if (this.pressedKeys.has('s')) {
      this.dispatch(ImageStateActions.moveDown());
    }
    if (this.pressedKeys.has('d')) {
      this.dispatch(ImageStateActions.moveRight());
    }
    if (this.pressedKeys.has('Shift')) {
      this.dispatch(ImageStateActions.increaseScale());
    } else if (this.pressedKeys.has('Control')) {
      this.dispatch(ImageStateActions.decreaseScale());
    }
  }

  /**
   * Starts listening for keydown and keyup events on the window and attaches event handlers.
   */
  startListening() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Stops listening for keydown and keyup events on the window and removes event handlers.
   */
  stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}

export default KeyboardService;
