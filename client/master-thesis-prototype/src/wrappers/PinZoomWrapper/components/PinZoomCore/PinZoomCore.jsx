/*
Based on: https://github.com/strateos/react-map-interaction/blob/master/src/MapInteraction.jsx
Licence: MIT
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Controls from '../Controls/Controls';

import { clamp, midpoint, touchPt, touchDistance } from '@utils/mathLib';
import makePassiveEventOption from '../../makePassiveEventOption';
import { clientPosToTranslatedPos } from '@utils/coordinatesTranslator';
import logger from '@utils/loggerUtil';

// The amount that a value of a dimension will change given a new scale
const coordChange = (coordinate, scaleRatio) => {
  return (scaleRatio * coordinate) - coordinate;
};

const translationShape = PropTypes.shape({ x: PropTypes.number, y: PropTypes.number });

/*
  This contains logic for providing a map-like interaction to any DOM node.
  It allows a user to pinch, zoom, translate, etc, as they would an interactive map.
  It renders its children with the current state of the translation and does not do any scaling
  or translating on its own. This works on both desktop, and mobile.
*/
export class PinZoomCore extends Component {
  static get propTypes() {
    return {
      // The content that will be transformed
      children: PropTypes.func,

      // This is a controlled component
      position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        z: PropTypes.number.isRequired,
      }).isRequired,
      setPosition: PropTypes.func.isRequired,

      disableZoom: PropTypes.bool,
      disablePan: PropTypes.bool,
      translationBounds: PropTypes.shape({
        xMin: PropTypes.number, xMax: PropTypes.number, yMin: PropTypes.number, yMax: PropTypes.number
      }),
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      showControls: PropTypes.bool,
      plusBtnContents: PropTypes.node,
      minusBtnContents: PropTypes.node,
      btnClass: PropTypes.string,
      plusBtnClass: PropTypes.string,
      minusBtnClass: PropTypes.string,
      controlsClass: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      minScale: 0.05,
      maxScale: 3,
      showControls: false,
      translationBounds: {},
      disableZoom: false,
      disablePan: false
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      shouldPreventTouchEndDefault: false
    };

    this.startPointerInfo = undefined;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.onWheel = this.onWheel.bind(this);
    
    this.getContainerBoundingClientRect = this.getContainerBoundingClientRect.bind(this)
  }

  componentDidMount() {
    const passiveOption = makePassiveEventOption(false);

    this.getContainerNode().addEventListener('wheel', this.onWheel, passiveOption);

    /*
      Setup events for the gesture lifecycle: start, move, end touch
    */

    // start gesture
    this.getContainerNode().addEventListener('touchstart', this.onTouchStart, passiveOption);
    this.getContainerNode().addEventListener('mousedown', this.onMouseDown, passiveOption);

    // move gesture
    window.addEventListener('touchmove', this.onTouchMove, passiveOption);
    window.addEventListener('mousemove', this.onMouseMove, passiveOption);

    // end gesture
    const touchAndMouseEndOptions = { capture: true, ...passiveOption };
    window.addEventListener('touchend', this.onTouchEnd, touchAndMouseEndOptions);
    window.addEventListener('mouseup', this.onMouseUp, touchAndMouseEndOptions);

  }

  componentWillUnmount() {
    this.getContainerNode().removeEventListener('wheel', this.onWheel);

    // Remove touch events
    this.getContainerNode().removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Remove mouse events
    this.getContainerNode().removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  /*
    Event handlers

    All touch/mouse handlers preventDefault because we add
    both touch and mouse handlers in the same session to support devicse
    with both touch screen and mouse inputs. The browser may fire both
    a touch and mouse event for a *single* user action, so we have to ensure
    that only one handler is used by canceling the event in the first handler.

    https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
  */

  onMouseDown(e) {
    e.preventDefault();
    this.setPointerState([e]);
  }

  onTouchStart(e) {
    e.preventDefault();
    this.setPointerState(e.touches);
  }

  onMouseUp(e) {
    this.setPointerState();
  }

  onTouchEnd(e) {
    this.setPointerState(e.touches);
  }

  onMouseMove(e) {
    if (!this.startPointerInfo || this.props.disablePan) {
      return;
    }
    e.preventDefault();
    this.onDrag(e);
  }

  onTouchMove(e) {
    if (!this.startPointerInfo) {
      return;
    }

    e.preventDefault();

    const { disablePan, disableZoom } = this.props;

    const isPinchAction = e.touches.length == 2 && this.startPointerInfo.pointers.length > 1;
    if (isPinchAction && !disableZoom) {
      this.scaleFromMultiTouch(e);
    } else if ((e.touches.length === 1) && this.startPointerInfo && !disablePan) {
      this.onDrag(e.touches[0]);
    }
  }

  // handles both touch and mouse drags
  onDrag(pointer) {
    const { x,y, pointers } = this.startPointerInfo;
    const startPointer = pointers[0];
    const dragX = pointer.clientX - startPointer.clientX;
    const dragY = pointer.clientY - startPointer.clientY;
    const newTranslation = {
      x: x + dragX,
      y: y + dragY
    };

    const shouldPreventTouchEndDefault = Math.abs(dragX) > 1 || Math.abs(dragY) > 1;

    const coords = this.clampTranslation(newTranslation.x, newTranslation.y)
    
    this.setState({
      shouldPreventTouchEndDefault
    }, () => {
      this.props.setPosition({
        z: this.props.position.z,
        x: coords.x,
        y: coords.y
      });
    });
  }

  onWheel(e) {
    if (this.props.disableZoom) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const scaleChange = 2 ** (e.deltaY * 0.002);

    const newScale = clamp(
      this.props.minScale,
      this.props.position.z + (1 - scaleChange),
      this.props.maxScale
    );

    const mousePos = clientPosToTranslatedPos(e.clientX,e.clientY, this.props.position.x, this.props.position.y,this.getContainerBoundingClientRect );

    this.scaleFromPoint(newScale, mousePos);
  }

  setPointerState(pointers) {
    if (!pointers || pointers.length === 0) {
      this.startPointerInfo = undefined;
      return;
    }

    this.startPointerInfo = {
      pointers,
      z: this.props.position.z,
      x: this.props.position.x,
      y: this.props.position.y,
    }
  }

  clampTranslation(x,y, props = this.props) {
    let { xMax, xMin, yMax, yMin } = props.translationBounds;
    xMin = xMin != undefined ? xMin : -Infinity;
    yMin = yMin != undefined ? yMin : -Infinity;
    xMax = xMax != undefined ? xMax : Infinity;
    yMax = yMax != undefined ? yMax : Infinity;

    return {
      x: clamp(xMin, x, xMax),
      y: clamp(yMin, y, yMax)
    };
  }



 

  scaleFromPoint(newScale, focalPt) {
    const { x,y,z } = this.props.position;
    const scaleRatio = newScale / (z != 0 ? z : 1);

    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    const newTranslation = {
      x: x - focalPtDelta.x,
      y: y - focalPtDelta.y
    };

    const clampTranslation = this.clampTranslation(newTranslation.x, newTranslation.y)
    this.props.setPosition({
      z: newScale,
      x: clampTranslation.x,
      y: clampTranslation.y
    })
  }

  // Given the start touches and new e.touches, scale and translate
  // such that the initial midpoint remains as the new midpoint. This is
  // to achieve the effect of keeping the content that was directly
  // in the middle of the two fingers as the focal point throughout the zoom.
  scaleFromMultiTouch(e) {
    const startTouches = this.startPointerInfo.pointers;
    const newTouches   = e.touches;

    // calculate new scale
    const dist0       = touchDistance(startTouches[0], startTouches[1]);
    const dist1       = touchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;

    const startScale  = this.startPointerInfo.z;
    const targetScale = startScale + ((scaleChange - 1) * startScale);
    const newScale    = clamp(this.props.minScale, targetScale, this.props.maxScale);

    // calculate mid points
    const startMidpoint = midpoint(touchPt(startTouches[0]), touchPt(startTouches[1]))
    const newMidPoint   = midpoint(touchPt(newTouches[0]), touchPt(newTouches[1]));

    // The amount we need to translate by in order for
    // the mid point to stay in the middle (before thinking about scaling factor)
    const dragDelta = {
      x: newMidPoint.x - startMidpoint.x,
      y: newMidPoint.y - startMidpoint.y
    };

    const scaleRatio = newScale / startScale;

    // The point originally in the middle of the fingers on the initial zoom start
    const focalPt = clientPosToTranslatedPos(startMidpoint.x, startMidpoint.y, this.startPointerInfo.x, this.startPointerInfo.y,this.getContainerBoundingClientRect);

    // The amount that the middle point has changed from this scaling
    const focalPtDelta = {
      x: coordChange(focalPt.x, scaleRatio),
      y: coordChange(focalPt.y, scaleRatio)
    };

    // Translation is the original translation, plus the amount we dragged,
    // minus what the scaling will do to the focal point. Subtracting the
    // scaling factor keeps the midpoint in the middle of the touch points.
    const newTranslation = {
      x: this.startPointerInfo.x - focalPtDelta.x + dragDelta.x,
      y: this.startPointerInfo.y - focalPtDelta.y + dragDelta.y
    };

    const clampedTranslation = this.clampTranslation(newTranslation.x, newTranslation.y)
    this.props.setPosition({
      z: newScale,
      x: clampedTranslation.x,
      y: clampedTranslation.y
    });
  }

  discreteScaleStepSize() {
    const { minScale, maxScale } = this.props;
    const delta = Math.abs(maxScale - minScale);
    return delta / 10;
  }

  // Scale using the center of the content as a focal point
  changeScale(delta) {
    const targetScale = this.props.position.z + delta;
    const { minScale, maxScale } = this.props;
    const scale = clamp(minScale, targetScale, maxScale);

    const rect = this.getContainerBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const focalPoint = clientPosToTranslatedPos( x, y, this.props.position.x, this.props.position.y, this.getContainerBoundingClientRect);
    this.scaleFromPoint(scale, focalPoint);
  }

  // Done like this so it is mockable
  getContainerNode() { return this.containerNode }
  getContainerBoundingClientRect() {
    console.log("this.getContainerNode(): ",this.getContainerNode().getBoundingClientRect())
    //return this.containerNode
    return this.getContainerNode().getBoundingClientRect();
  }

  renderControls() {
    const step = this.discreteScaleStepSize();
    return (
      <Controls
        onClickPlus={() => this.changeScale(step)}
        onClickMinus={() => this.changeScale(-step)}
        plusBtnContents={this.props.plusBtnContents}
        minusBtnContents={this.props.minusBtnContents}
        btnClass={this.props.btnClass}
        plusBtnClass={this.props.plusBtnClass}
        minusBtnClass={this.props.minusBtnClass}
        controlsClass={this.props.controlsClass}
        scale={this.props.position.z}
        minScale={this.props.minScale}
        maxScale={this.props.maxScale}
        disableZoom={this.props.disableZoom}
      />
    );
  }

  render() {
    const { showControls, children } = this.props;
    const z = this.props.position.z;
    // Defensively clamp the translation. This should not be necessary if we properly set state elsewhere.
    const {x,y} = this.clampTranslation(this.props.position.x, this.props.position.y);

    /*
      This is a little trick to allow the following ux: We want the parent of this
      component to decide if elements inside the map are clickable. Normally, you wouldn't
      want to trigger a click event when the user *drags* on an element (only if they click
      and then release w/o dragging at all). However we don't want to assume this
      behavior here, so we call `preventDefault` and then let the parent check
      `e.defaultPrevented`. That value being true means that we are signalling that
      a drag event ended, not a click.
    */
    const handleEventCapture = (e) => {
        logger.debug("handleEventCapture")
      if (this.state.shouldPreventTouchEndDefault) {
        e.preventDefault();
        this.setState({ shouldPreventTouchEndDefault: false });
      }
    }

    return (
      <div
        ref={(node) => {
          this.containerNode = node;
        }}
        style={{
          height: '100%',
          width: '100%',
          position: 'relative', // for absolutely positioned children
          touchAction: 'none'
        }}
        onClickCapture={handleEventCapture}
        onTouchEndCapture={handleEventCapture}
      >
        {(children || undefined) && children({ x,y, z })}
        {(showControls || undefined) && this.renderControls()}
      </div>
    );
  }
}

/*
  Main entry point component.
  Determines if it's parent is controlling (eg it manages state) or leaving us uncontrolled
  (eg we manage our own internal state)
*/
class MapInteractionController extends Component {
  static get propTypes() {
    return {
      children: PropTypes.func,
      position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        z: PropTypes.number.isRequired,
      }),
      defaultValue: PropTypes.shape({
        scale: PropTypes.number.isRequired,
        translation: translationShape.isRequired,
      }),
      disableZoom: PropTypes.bool,
      disablePan: PropTypes.bool,
      setPosition: PropTypes.func,
      translationBounds: PropTypes.shape({
        xMin: PropTypes.number, xMax: PropTypes.number, yMin: PropTypes.number, yMax: PropTypes.number
      }),
      minScale: PropTypes.number,
      maxScale: PropTypes.number,
      showControls: PropTypes.bool,
      plusBtnContents: PropTypes.node,
      minusBtnContents: PropTypes.node,
      btnClass: PropTypes.string,
      plusBtnClass: PropTypes.string,
      minusBtnClass: PropTypes.string,
      controlsClass: PropTypes.string
    };
  }

  constructor(props) {
    super(props);

    const controlled = MapInteractionController.isControlled(props);
    if (controlled) {
      this.state = {
        lastKnownValueFromProps: props.position
      };
    } else {
      // Set the necessary state for controlling map interaction ourselves
      this.state = {
        position: props.defaultValue || {
          scale: 1,
          translation: { x: 0, y: 0 }
        },
        lastKnownValueFromProps: undefined
      };
    }
  }

  /*
    Handle the parent switchg form controlled to uncontrolled or vice versa.
    This is at most a best-effort attempt. It is not gauranteed by our API
    but it will do its best to maintain the state such that if the parent
    accidentally switches between controlled/uncontrolled there won't be
    any jankiness or jumpiness.

    This tries to mimick how the React <input /> component behaves.
  */
  static getDerivedStateFromProps(props, state) {
    const nowControlled = MapInteractionController.isControlled(props);
    const wasControlled = state.lastKnownValueFromProps && MapInteractionController.isControlled({ position: state.lastKnownValueFromProps })

    /*
      State transitions:
        uncontrolled --> controlled   (unset internal state, set last props from parent)
        controlled   --> uncontrolled (set internal state to last props from parent)
        controlled   --> controlled   (update last props from parent)
        uncontrolled --> uncontrolled (do nothing)

      Note that the second two (no change in control) will also happen on the
      initial render because we set lastKnownValueFromProps in the constructor.
    */
    if (!wasControlled && nowControlled) {
      return {
        position: undefined,
        lastKnownValueFromProps: props.position
      };
    } else if (wasControlled && !nowControlled) {
      return {
        position: state.lastKnownValueFromProps,
        lastKnownValueFromProps: undefined
      };
    } else if (wasControlled && nowControlled) {
      return { lastKnownValueFromProps: props.position };
    } else if (!wasControlled && !nowControlled) {
      return null;
    }
  }

  static isControlled(props) {
    // Similar to React's <input /> API, setting a value declares
    // that you want to control this component.
    return props.position != undefined;
  }

  // The subset of this component's props that need to be passed
  // down to the core RMI component
  innerProps() {
    const { position, defaultValue, setPosition, ...innerProps } = this.props;
    return innerProps;
  }

  getValue() {
    const controlled = MapInteractionController.isControlled(this.props);
    return controlled ? this.props.position : this.state.position;
  }

  render() {
    const { setPosition, children } = this.props;
    const controlled = MapInteractionController.isControlled(this.props);
    const position = controlled ? this.props.position : this.state.position;
    return (
      <PinZoomCore
        setPosition={(position) => {
          controlled ? setPosition(position) : this.setState({ position });
        }}
        position={position}
        {...this.innerProps()}
      >
       {children}
      </PinZoomCore>
    );
  }
}

export default PinZoomCore;