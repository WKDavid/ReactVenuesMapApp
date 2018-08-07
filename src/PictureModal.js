import React, { Component } from 'react'
import FocusTrap from 'react-focus-trap'

class PictureModal extends Component {

  render() {
    const { onPictureModalState, onClosePictureModal, onKeyPressValidate } = this.props

    return (
      <FocusTrap active={ onPictureModalState.modalVisibility }>
        <div className="modalContainer" aria-modal="true" role="dialog" aria-label="modal with larger picture">
          <span className="closeModalButton" tabIndex="0" role="button" aria-label="close" onClick={() => {onClosePictureModal()}}
                onKeyPress={(event) => { if (onKeyPressValidate(event)) {onClosePictureModal();} }}>&times;</span>
          <img className="modalPicture" src={onPictureModalState.currentURL} alt={"place zoomed"} onClick={() => {onClosePictureModal()}}
               tabIndex="0" onKeyPress={(event) => { if (onKeyPressValidate(event)) {onClosePictureModal();} }}/>
        </div>
      </FocusTrap>
    )
  }
}

export default PictureModal;
