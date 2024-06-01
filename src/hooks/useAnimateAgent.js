import { useState, useEffect } from "react";

const useAnimateAgent = (intervalTime) => {
  const [animateAgent, setAnimateAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateAgent((prevFrame) => (prevFrame + 1) % 2);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);

  return animateAgent;
};

export default useAnimateAgent;
