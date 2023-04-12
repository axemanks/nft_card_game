import React from 'react';

import { PageHOC } from '../components';

const CreateBattle = () => {
  return (
    <div>
      <h1 className="text-white">Hello from create battle</h1>
    </div>
  )
};

export default PageHOC(
  CreateBattle,
  <>
   Create <br /> a new battle
  </>,
  <>
    Create your own battle and wait for other players to join you.
    Game
  </>,
);