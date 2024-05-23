import React from 'react';
import { connect } from 'react-redux';
import ImageViewerHelpConnectors from './imageViewerHelpConnectors';
import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';

/**
 * NavigationNotch component renders a dialog for displaying help content.
 *
 * @param {object} props - The props object containing the component's properties.
 * @param {boolean} props.isHelpModalOpen - Indicates whether the help modal is open.
 * @param {function} props.toggleHelpModalOpen - Callback function to toggle the help modal.
 *
 * @return {JSX.Element} React JSX element representing the NavigationNotch component.
 */
function NavigationNotch(props) {
  return (
    <Dialog header='Nápověda' visible={props.isHelpModalOpen} style={{ width: '50vw' }} onHide={() => props.toggleHelpModalOpen()} maximizable >
      <p className='m-0'>
        Aplikace slouží pro zobrazování digitalizovaných folií.
        Aplikaci lze ovládat pomocí ovládacího panelu v horní části obrazovky
        nebo pomocí klávesových zkratek. Tlačítka jsou popsána pomocí nápovědy,
        která se zobrazí při najetí kurzoru myši na danou ikonu.
      </p>
      <img src='/assets/help-keyboard.svg' alt="keyboard shortcuts visualization" style={{ width: '80%', margin: 'auto', display: 'block' }} />


    </Dialog>
  );
}

NavigationNotch.propTypes = {
  isHelpModalOpen: PropTypes.bool.isRequired,
  toggleHelpModalOpen: PropTypes.func.isRequired,
};

// Connect the component using connect
export default connect(
  ImageViewerHelpConnectors.mapStateToProps,
  ImageViewerHelpConnectors.mapDispatchToProps,
)(NavigationNotch);
