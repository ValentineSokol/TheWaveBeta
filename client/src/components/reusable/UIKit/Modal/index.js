import React from 'react';
import './Modal.scss';
import Card from "../Cards/Card/Card";
import {CSSTransition} from "react-transition-group";
import setBodyScroll from "../../../../utils/setBodyScroll";
import Button from "../Forms/Button";
import Heading from "../Headings/Heading/Heading";
import classNames from "classnames";

class Modal extends React.Component {
    componentDidMount() {
        setBodyScroll(false);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isOpen !== this.props.isOpen) {
            setBodyScroll(!this.props.isOpen);
        }
    }

    render() {
        const { isOpen, children, blockInteraction, onClose, heading, classes } = this.props;
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
              <Card classes={classNames('ModalContainer', { [classes]: classes } )}>
                  <Button transparent className='CloseIcon' clickHandler={onClose}>✖</Button>
                  {heading && <Heading size={3}>{heading}</Heading>}
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
