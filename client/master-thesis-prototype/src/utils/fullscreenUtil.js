

const FullscreenUtil = {

  isFullScreen: () => {
    const element = document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement ||
                    document.msFullscreenElement;

    if (element != null) {
      return true;
    }

    return false;
  },

  enterFullScreen: () => {
    const element = document.documentElement; // Get the root HTML element
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  },

  exitFullScreen: () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

};


FullscreenUtil.toggleFullscreen = () => {
  if (FullscreenUtil.isFullScreen()) {
    FullscreenUtil.exitFullScreen();
  } else {
    FullscreenUtil.enterFullScreen();
  }
};

export default FullscreenUtil;
