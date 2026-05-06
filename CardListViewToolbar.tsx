import { Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';

export interface CardListViewToolbarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

/**
 * Three-slot toolbar: left | center | right.
 * Each slot is optional. Empty slots collapse cleanly without reserving space.
 *
 * The shell wires this up as: tab bar (left), searchInput (center), filters (right).
 */
export function CardListViewToolbar({
  left,
  center,
  right,
}: CardListViewToolbarProps) {
  // If everything is empty, render nothing so the toolbar doesn't take up space.
  if (left === undefined && center === undefined && right === undefined) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: '100%', mb: 2 }}
      data-testid="cardlistview-toolbar"
    >
      {left !== undefined && (
        <Box sx={{ flexShrink: 0 }} data-testid="cardlistview-toolbar-left">
          {left}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }} data-testid="cardlistview-toolbar-center">
        {center}
      </Box>
      {right !== undefined && (
        <Box sx={{ flexShrink: 0 }} data-testid="cardlistview-toolbar-right">
          {right}
        </Box>
      )}
    </Stack>
  );
}
