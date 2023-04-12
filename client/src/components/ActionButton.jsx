import React from 'react';

import styles from '../styles';

const ActionButton = ({ imgUrl, handleClick, restStyles }) => (
  // holder for the action buttons
  <div
    className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles} `}
    onClick={handleClick}
  >
    {/* button images */}
    <img src={imgUrl} alt="action_img" className={styles.gameMoveIcon} />
  </div>
);

export default ActionButton;