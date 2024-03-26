import { Box, Typography } from '@mui/material';
import React from 'react';

type Props = {
  creatorName: string;
  time: string;
  text: string;
};

function MassageFromUser({ creatorName, time, text }: Props) {
  return (
    <Box
      sx={{
        mb: 1,
        ml: { xs: 1, sm: 3, lg: 5 },
        display: 'flex',
        justifyContent: 'end',
      }}
    >
      <Box
        sx={{
          textAlign: 'end',
          px: 1,
          border: 1,
          borderRadius: '16px',
          borderColor: '#cfdaf3',
          backgroundColor: '#e4e8f1',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
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

export default React.memo(MassageFromUser);
