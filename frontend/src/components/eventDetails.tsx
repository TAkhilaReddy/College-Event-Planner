// EventDetailsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

interface EventDetailsCardProps {
  event: any;
  isRegistered: boolean;
  onRegister: () => void;
  onCancel: () => void;
}

const EventDetailsCard: React.FC<EventDetailsCardProps> = ({ event, isRegistered, onRegister, onCancel }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1">Date: {event.date}</Typography>
        <Typography variant="body1">Time: {event.time}</Typography>
        <Typography variant="body1">Location: {event.location}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Category: <Chip label={event.category_name} color="primary" size="small" />
        </Typography>

        {!isRegistered ? (
          <Button variant="contained" color="primary" onClick={onRegister}>
            Register
          </Button>
        ) : (
          <Box>
            <Button variant="contained" color="success" sx={{ mr: 2 }} disabled>
              Registered
            </Button>
            <Button variant="outlined" color="error" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EventDetailsCard;
