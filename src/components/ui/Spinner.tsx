import React from 'react';
import '../../styles/Spinner.styles.scss';

const Spinner = (props: { showBackDrop?: boolean }) => {
  return (
    <div className={props.showBackDrop ? 'loaderWithBackDrop' : 'loader'}>
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    </div>
  );
};
export default Spinner;
