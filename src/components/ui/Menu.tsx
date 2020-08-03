import * as React from 'react';
import styles from '../../styles/Menu.module.scss';
import { useClickOutside } from '../../utils/hooks';

export const Menu = (props: { children?: any; clickOutsideCallback: Function }) => {
  const menuRef = React.useRef<any>(null);

  useClickOutside(menuRef, () => {
    props.clickOutsideCallback();
  });

  return (
    <div ref={menuRef} className={styles.menu}>
      {props.children}
    </div>
  );
};

export interface IMenuItemProps {
  text: string;
  icon: any;
  clickHandler?: Function;
}

export const MenuItem: React.FC<IMenuItemProps> = (props) => {
  const itemClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.clickHandler) {
      props.clickHandler(e);
    }
  };
  return (
    <a href="/" className={styles.item} onClick={itemClick}>
      <props.icon />
      {props.text}
    </a>
  );
};
