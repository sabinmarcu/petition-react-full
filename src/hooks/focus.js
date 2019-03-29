import { useState } from 'react';

export default () => {
  const [focusState, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);
  return { focusState, onFocus, onBlur };
};
