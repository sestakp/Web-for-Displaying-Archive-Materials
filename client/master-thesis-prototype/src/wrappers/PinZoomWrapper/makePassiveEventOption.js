// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;
try {
  const options = {
    get passive() {
      passiveSupported = true;
    },
  };
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch {
  passiveSupported = false;
}

/**
 * Creates an options object for a passive event listener based on browser support.
 *
 * @param {boolean} passive - A boolean value indicating whether the event listener should be passive.
 * @return {Object} An options object for the event listener.
 */
function makePassiveEventOption(passive) {
  return passiveSupported ? { passive } : passive;
}

export default makePassiveEventOption;
