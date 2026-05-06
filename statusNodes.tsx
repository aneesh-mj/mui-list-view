import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';

export function DefaultLoading() {
  return (
    <Stack spacing={2} data-testid="story-loading">
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={120} />
      <Skeleton variant="rounded" height={120} />
    </Stack>
  );
}

export function DefaultEmpty({ message = 'No items found' }: { message?: string }) {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: 'center',
        color: 'text.secondary',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
      }}
      data-testid="story-empty"
    >
      <Typography variant="body1" fontWeight={500}>
        {message}
      </Typography>
      <Typography variant="body2" mt={0.5}>
        Try adjusting your search or filters.
      </Typography>
    </Box>
  );
}

export function DefaultError({ message = 'Something went wrong.' }: { message?: string }) {
  return (
    <Alert severity="error" data-testid="story-error">
      {message}
    </Alert>
  );
}
