import { useEffect } from 'react';

export const useMountEffect = (callback: Function) =>
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

export const useClickOutside = (element: any, callback: Function) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (element.current && !element.current.contains(event.target as any)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};

export const useWindowResizeEvent = (callback: Function) => {
  useEffect(() => {
    const handleWindowResize = () => {
      callback();
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });
};
