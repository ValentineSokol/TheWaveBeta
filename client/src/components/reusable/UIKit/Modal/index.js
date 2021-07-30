import React from 'react';
import './Modal.scss';
import Card from "../Cards/Card/Card";
class Modal extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        const { isOpen, children, blockInteraction, onClose } = this.props;
        if (!isOpen) return null;
        return (
            <>
                {
                    blockInteraction &&
                        <span className='BlockInteraction' />
                }
              <Card classNames='ModalContainer'>
                      <div className='ModalHeader'>
                          <span className='CloseIcon' onClick={onClose}>✖</span>
                      </div>
                  <div className='ModalBody'>
                      {children}
                  </div>
              </Card>
            </>
        );

    }
}

export default Modal;
