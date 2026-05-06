import SearchIcon from '@mui/icons-material/Search';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import {
  PLATFORM_OPTIONS,
  PROVIDER_OPTIONS,
  REGULATION_OPTIONS,
  STATUS_OPTIONS,
  type GameFilters,
} from './fixtures';

// -----------------------------------------------------------------------------
// SearchBar — consumer's search input
// -----------------------------------------------------------------------------

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}

// -----------------------------------------------------------------------------
// GameFiltersBar — inline filter dropdowns (matches Game Deploy screenshot)
// -----------------------------------------------------------------------------

export interface GameFiltersBarProps {
  value: GameFilters;
  onChange: (next: GameFilters) => void;
}

export function GameFiltersBar({ value, onChange }: GameFiltersBarProps) {
  const set =
    (key: keyof GameFilters) => (e: SelectChangeEvent<string>) => {
      const next = e.target.value;
      onChange({ ...value, [key]: next || undefined });
    };

  return (
    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Provider</InputLabel>
        <Select label="Provider" value={value.provider ?? ''} onChange={set('provider')}>
          <MenuItem value="">All</MenuItem>
          {PROVIDER_OPTIONS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" value={value.status ?? ''} onChange={set('status')}>
          <MenuItem value="">All</MenuItem>
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Platform</InputLabel>
        <Select label="Platform" value={value.platform ?? ''} onChange={set('platform')}>
          <MenuItem value="">All</MenuItem>
          {PLATFORM_OPTIONS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Regulation</InputLabel>
        <Select label="Regulation" value={value.regulation ?? ''} onChange={set('regulation')}>
          <MenuItem value="">All</MenuItem>
          {REGULATION_OPTIONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

// -----------------------------------------------------------------------------
// PaginationBar — consumer's pagination
// -----------------------------------------------------------------------------

export interface PaginationBarProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export function PaginationBar({ page, count, onChange }: PaginationBarProps) {
  return (
    <Stack direction="row" justifyContent="center">
      <Pagination
        page={page}
        count={count}
        onChange={(_, value) => onChange(value)}
        showFirstButton
        showLastButton
        color="primary"
      />
    </Stack>
  );
}
