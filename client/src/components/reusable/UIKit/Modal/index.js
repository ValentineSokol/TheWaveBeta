import React from 'react';
import './Modal.scss';
import Card from "../Cards/Card/Card";
import {CSSTransition} from "react-transition-group";
import toggleBodyScroll from "../../../../utils/toggleBodyScroll";

class Modal extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isOpen !== this.props.isOpen) {
            toggleBodyScroll();
        }
    }

    render() {
        const { isOpen, children, blockInteraction, onClose } = this.props;
        return (
            <>
                {
                   isOpen && blockInteraction &&
                        <span className='BlockInteraction' />
                }
                <CSSTransition
                    in={isOpen}
                    unmountOnExit
                    appear={true}
                    timeout={800}
                    classNames='scale-fade'
                >
              <Card classNames='ModalContainer'>
                      <div className='ModalHeader'>
                          <span className='CloseIcon' onClick={onClose}>✖</span>
                      </div>
                  <div className='ModalBody'>
                      {children}
                  </div>
              </Card>
               </CSSTransition>
            </>
        );

    }
}

export default Modal;
