import { Box, Chip } from '@mui/material';
import React from 'react';

type Props = {
  text: string,
};

function NotificationChip({ text }: Props) {
  return (
    <Box
      sx={{
        mb: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Chip label={text} sx={{ height: 18 }} />
    </Box>
  );
}

export default React.memo(NotificationChip);
