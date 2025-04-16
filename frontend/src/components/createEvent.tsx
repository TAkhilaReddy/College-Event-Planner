import { Paper, Box, Typography, Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

const CreateEventCard = () => {
  return (
    <Paper sx={{ mt: 3, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: '#f9f9ff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ready to plan a new event?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          size="large"
          sx={{ 
            borderRadius: 2,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Create Event
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateEventCard;