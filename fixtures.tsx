import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

export interface Game {
  id: string;
  name: string;
  vendor: string;
  gameId: string;
  type: 'Slot' | 'Table' | 'Live';
  provider: string;
  platform: string;
  regulation: string;
  status: 'Active' | 'Inactive' | 'Pending';
  imageUrl: string;
}

export interface GameFilters {
  provider?: string;
  status?: string;
  platform?: string;
  regulation?: string;
}

const GRADIENTS = [
  'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
  'linear-gradient(135deg, #4ECDC4 0%, #556270 100%)',
  'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
  'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
  'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
  'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
  'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
  'linear-gradient(135deg, #F09819 0%, #FF512F 100%)',
];

function makeImage(seed: number): string {
  const grad = GRADIENTS[seed % GRADIENTS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${grad}"></div></foreignObject></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PROVIDERS = [
  'Quantum Quest Interactive',
  'iGames Software',
  'Enigma Pixelworks',
  'Pixel Arcadia Games',
  'Nebula Studios',
];
const PLATFORMS = ['Web', 'Mobile', 'Web+Mobile'];
const REGULATIONS = ['MGA', 'UKGC', 'Curacao', 'Gibraltar'];
const STATUSES: Game['status'][] = ['Active', 'Inactive', 'Pending'];

const NAMES = [
  'Hainan Ice', 'Wild Lava Set 1', 'Egyptian Emeralds Set 1', 'Fishin Frenzy Even Bigger 2',
  'Bee Frenzy', 'Dragon Champions', 'Kingdoms Rise - Forbidden Forest', 'Goddess of Wisdom',
  'Crystal Cavern', 'Mystic Forest', 'Ocean Treasures', 'Volcano Riches',
  'Aztec Gold', 'Lucky Sevens', 'Phoenix Rising', 'Starlight Symphony',
  'Diamond Dynasty', 'Jungle Safari', 'Polar Bonanza', "Wizard's Wand",
  'Sky Pirates', 'Neon Nights', 'Royal Rush', 'Treasure Vault',
];

export const ALL_GAMES: Game[] = NAMES.map((name, i) => ({
  id: `game-${i}`,
  name,
  vendor: PROVIDERS[i % PROVIDERS.length],
  gameId: name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
  type: 'Slot',
  provider: PROVIDERS[i % PROVIDERS.length],
  platform: PLATFORMS[i % PLATFORMS.length],
  regulation: REGULATIONS[i % REGULATIONS.length],
  status: STATUSES[i % STATUSES.length],
  imageUrl: makeImage(i),
}));

export const REGULATION_ITEMS: Game[] = ALL_GAMES.slice(0, 8).map((g, i) => ({
  ...g,
  id: `reg-${g.id}`,
  name: `${REGULATIONS[i % REGULATIONS.length]} Rule — ${g.name}`,
}));

// -----------------------------------------------------------------------------
// GameCard — single card matching the Game Deploy screenshot
// -----------------------------------------------------------------------------

export function GameCard({ item }: { item: Game }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 120ms ease',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={item.imageUrl}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={0.5}
        >
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {item.name}
          </Typography>
          <Chip label={item.type} size="small" variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block">
          Vendor: {item.vendor}
        </Typography>
        <Box mt={1.5}>
          <Typography variant="caption" color="text.secondary" display="block">
            Game ID:
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            {item.gameId}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// GameGrid — consumer-side responsive grid that wraps cards
// (lives in the consumer's code, not in CardListView itself)
// -----------------------------------------------------------------------------

export interface GameGridProps {
  items: Game[];
  columns?: number;
}

export function GameGrid({ items, columns = 4 }: GameGridProps) {
  const lg = Math.max(1, Math.floor(12 / columns));
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={lg} key={item.id}>
          <GameCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}

// -----------------------------------------------------------------------------
// Helpers used by stories to filter/paginate locally
// -----------------------------------------------------------------------------

export function filterGames(
  source: Game[],
  query: string,
  filters: GameFilters,
): Game[] {
  const q = query.toLowerCase();
  return source.filter((g) => {
    if (q && !g.name.toLowerCase().includes(q) && !g.vendor.toLowerCase().includes(q)) {
      return false;
    }
    if (filters.provider && g.provider !== filters.provider) return false;
    if (filters.status && g.status !== filters.status) return false;
    if (filters.platform && g.platform !== filters.platform) return false;
    if (filters.regulation && g.regulation !== filters.regulation) return false;
    return true;
  });
}

export function paginate<T>(arr: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

export const PROVIDER_OPTIONS = PROVIDERS;
export const PLATFORM_OPTIONS = PLATFORMS;
export const REGULATION_OPTIONS = REGULATIONS;
export const STATUS_OPTIONS = STATUSES;
