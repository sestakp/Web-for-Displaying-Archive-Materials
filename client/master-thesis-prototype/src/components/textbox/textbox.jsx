import React, { useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { Rnd } from 'react-rnd';
import { InputTextarea } from 'primereact/inputtextarea';
import logger from '../../utils/loggerUtil';
import PropTypes from 'prop-types';

/**
 * Textbox component for displaying and editing text.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.textbox - The textbox data.
 * @param {number} props.index - The index of the textbox.
 * @param {function} props.setTextboxes - Callback function to update the list of textboxes.
 *
 * @return {JSX.Element} React JSX element representing the Textbox component.
 */
const Textbox = ({ textbox, index, setTextboxes }) => {
  const textboxRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const cm = useRef(null);
  const items = [
    { label: 'Delete', icon: 'pi pi-fw pi-trash', command: (event) => handleContextMenuClick(event, 'Delete') },
  ];

  /**
   * Handles a context menu click event, performing the specified operation.
   *
   * @param {Event} event - The context menu click event.
   * @param {string} operation - The operation to perform (e.g., 'Delete').
   */
  function handleContextMenuClick(event, operation) {
    if (operation == 'Delete') {
      logger.debug('index: ', index);
      setTextboxes((oldTextboxes) => {
        logger.debug('oldTextboxers: ', oldTextboxes);
        const updatedTextboxes = oldTextboxes.filter((_, i) => i !== index);
        logger.debug('updated textboxes: ', updatedTextboxes);
        return updatedTextboxes;
      });
    }
  }

  /**
   * Handles a text change event and updates the textboxes state.
   *
   * @param {Event} event - The text change event.
   */
  function handleTextChange(event) {
    setTextboxes((oldTextboxes) => {
      oldTextboxes[index].text = event.target.value;
      return [...oldTextboxes];
    });
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
  };

  /**
   * Handles a click event outside of the Textbox when in edit mode and exits edit mode if necessary.
   *
   * @param {MouseEvent} e - The click event.
   */
  function handleClick(e) {
    if (editing && textboxRef.current) {
      // Check if the click target is not the Textbox or its children
      if (!textboxRef.current.resizableElement.current.contains(e.target)) {
        // Click occurred outside the Textbox, so exit edit mode

        setEditing(false);
      }
    }
  };

  useEffect(() => {
    // Add the click event listener when the component mounts
    document.addEventListener('click', handleClick);
    return () => {
      // Remove the click event listener when the component unmounts
      document.removeEventListener('click', handleClick);
    };
  }, [editing, textboxRef, handleClick]);

  return (
    <Rnd
      style={{
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '10px',
      }}
      default={{
        x: textbox.x,
        y: textbox.y,
        width: textbox.width,
        height: textbox.height,
      }}
      onDrag={(e, d) => e.stopPropagation()}
      onResize={(e, d) => {
        logger.debug('on resize'); e.stopPropagation(); e.preventDefault();
      }}
      onDoubleClick={(e) => setEditing(true)}
      onContextMenu={(e) => cm.current.show(e)}
      ref={textboxRef}
    >
      <ContextMenu model={items} ref={cm} breakpoint='767px' />
      {editing &&
        <InputTextarea
          style={{ border: '1px solid white', width: '100%', height: '100%' }}
          value={textbox.text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key == 'Escape') {
              setEditing((oldEditing) => !oldEditing);
            }
          }}
          onBlur={() => {
            logger.debug('on blur textbox');
            // setEditing((oldEditing) => !oldEditing)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          autoFocus
        />
      }
      {!editing &&
        <p style={{ margin: 0 }} >{textbox.text} ({index})</p>
      }
    </Rnd>
  );
};

Textbox.propTypes = {
  textbox: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setTextboxes: PropTypes.func.isRequired,
};

export default Textbox;
