import { Box, Typography } from '@mui/material';
import React from 'react';

type Props = {
  creatorName: string;
  time: string;
  text: string;
};

function MessageFromOther({ creatorName, time, text }: Props) {
  return (
    <Box
      sx={{
        mb: 1,
        mr: { xs: 1, sm: 3, lg: 5 },
        display: 'flex',
        justifyContent: 'start',
      }}
    >
      <Box
        sx={{
          textAlign: 'start',
          px: 1,
          border: 1,
          borderRadius: '16px',
          borderColor: '#9ebbe7',
          backgroundColor: '#b0c5fc',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            fontSize: 18,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
            {creatorName}
          </Typography>

          <Typography variant="body1">{time}</Typography>
        </Box>

        <Typography component="pre">{text}</Typography>
      </Box>
    </Box>
  );
}

export default React.memo(MessageFromOther);
