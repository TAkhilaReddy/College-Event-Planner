import { 
  Grid, 
  Paper, 
  TextField, 
  InputAdornment, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Chip 
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { CategoryData } from './types_interfaces';

interface SearchAndFilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: CategoryData[];
  selectedCategoryIds: number[];
  handleCategoryChange: (categoryId: number) => void;
  clearFilters: () => void;
}

const SearchAndFilterPanel = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategoryIds,
  handleCategoryChange,
  clearFilters
}: SearchAndFilterPanelProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3, bgcolor: '#f3e5f5' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#7b1fa2' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#7b1fa2',
                },
                '&:hover fieldset': {
                  borderColor: '#4a148c',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4a148c',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4a148c' }}>
            Filter by category:
          </Typography>
          <FormGroup row>
            {categories.map(category => (
              <FormControlLabel
                key={category.category_id}
                control={
                  <Checkbox
                    checked={selectedCategoryIds.includes(category.category_id)}
                    onChange={() => handleCategoryChange(category.category_id)}
                    sx={{
                      color: '#7b1fa2',
                      '&.Mui-checked': {
                        color: '#4a148c',
                      },
                    }}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            sx={{
              color: '#7b1fa2',
              borderColor: '#7b1fa2',
              '&:hover': {
                borderColor: '#4a148c',
                backgroundColor: '#f3e5f5',
              },
            }}
            onClick={clearFilters}
            size="small"
          >
            Clear Filters
          </Button>
        </Grid>

        {selectedCategoryIds.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 1, color: '#4a148c' }}>
              Filtering by:
            </Typography>
            {selectedCategoryIds.map(id => {
              const category = categories.find(cat => cat.category_id === id);
              return (
                <Chip
                  key={id}
                  label={category?.name}
                  onDelete={() => handleCategoryChange(id)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    bgcolor: '#7b1fa2',
                    color: '#fff',
                    '& .MuiChip-deleteIcon': {
                      color: '#f3e5f5',
                    },
                    '&:hover': {
                      bgcolor: '#4a148c',
                    },
                  }}
                />
              );
            })}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default SearchAndFilterPanel;