import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState('--:--:-- UTC');

  useEffect(() => {
    function tick() {
      const n = new Date();
      const p = x => String(x).padStart(2, '0');
      setTime(`${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
