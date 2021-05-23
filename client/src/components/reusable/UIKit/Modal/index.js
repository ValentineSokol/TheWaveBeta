import React from 'react';
import Heading from "../Headings/Heading/Heading";
import './Modal.scss';
import Card from "../Cards/Card/Card";
class Modal extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'scroll';
        }
    }

    render() {
        const { isOpen, children, blockInteraction, headingText, headingSize, message, onClose } = this.props;
        if (!isOpen) return null;
        return (
            <>
                {
                    blockInteraction &&
                        <span className='BlockInteraction' />
                }
              <Card classNames='ModalContainer'>
                  { this.props.header &&
                      <div className='ModalHeader'>
                          <span className='CloseIcon' onClick={onClose}>X</span>
                      </div>
                  }
                  <div className='ModalBody'>
                      {children}
                  </div>
              </Card>
            </>
        );

    }
}

export default Modal;
