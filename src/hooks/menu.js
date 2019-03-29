import { useState } from 'react';

export default () => {
  const [menuState, setMenuState] = useState(false);
  const openMenu = () => setMenuState(true);
  const closeMenu = () => setMenuState(false);
  return { menuState, openMenu, closeMenu };
};
