import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';

interface IModalProps {
  show: boolean;
  closeHandler: Function;
}

const Modal: React.FC<IModalProps> = (props) => {
  const ref = useRef<any>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (props.show) {
      setShow(true);
    } else {
      setTimeout(() => {
        setShow(false);
      }, 200);
    }
  }, [props.show]);

  return (
    <div ref={ref} className={styles.backdrop} style={{ display: show ? 'flex' : 'none' }}>
      <CSSTransition in={props.show} unmountOnExit timeout={300} classNames={'modal'}>
        <div className={styles.modal}>
          <a
            className={styles.closeBtn}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              props.closeHandler();
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </a>
          {props.children}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Modal;
