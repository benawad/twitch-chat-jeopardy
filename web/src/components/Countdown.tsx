import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/core";

interface CountdownProps {
  countdown: number;
}

export const Countdown: React.FC<CountdownProps> = ({ countdown }) => {
  const [time, setTime] = useState(countdown / 1000);
  useEffect(() => {
    if (countdown === -1) {
      return;
    }
    setTime(countdown / 1000);
    let id: NodeJS.Timeout | null = null;
    const fn = () => {
      id = setTimeout(() => {
        setTime((t) => (t > 0 ? t - 1 : t));
        fn();
      }, 995);
    };
    fn();
    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [countdown]);

  if (countdown === -1) {
    return null;
  }

  return (
    <Box position="fixed" p={4} fontSize={40} bottom={0} right={0}>
      {time}
    </Box>
  );
};
