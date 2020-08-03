import * as React from 'react';
import styles from '../../styles/Avatar.module.scss';
import { joinClasses } from '../../utils/helpers';

export interface IAppProps {
  size: 'small' | 'normal' | 'large' | 'xlarge';
  name?: string;
  imageUrl?: string;
  style?: React.CSSProperties;
}

export default function Avatar(props: IAppProps) {
  const sizeClass = () => {
    if (props.size === 'normal') {
      return styles.normal;
    } else if (props.size === 'large') {
      return styles.large;
    } else if (props.size === 'xlarge') {
      return styles.xlarge;
    } else {
      return styles.small;
    }
  };
  return (
    <div className={joinClasses(styles.avatar, sizeClass())} style={{ ...props.style }}>
      {props.imageUrl && <img src={props.imageUrl} alt="" />}
      {props.name && !props.imageUrl && (
        <svg className={styles.placeholder} xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
          <g transform="translate(-197 -310)">
            <circle className={styles.a} cx="21" cy="21" r="21" transform="translate(197 310)" />
            <text className={styles.b} transform="translate(212 340)">
              <tspan x="-1" y="0">
                {props.name?.split('')[0].toUpperCase()}
              </tspan>
            </text>
          </g>
        </svg>
      )}
    </div>
  );
}
