import { useRef, useEffect } from 'react';

const useIsUnmounted = () => {
  const ref = useRef(false);

  useEffect(() => {
    return () => {
      ref.current = true;
    };
  }, []);

  return ref;
};

export default useIsUnmounted;
