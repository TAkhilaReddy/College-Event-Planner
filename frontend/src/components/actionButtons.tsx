import { Button, Box } from '@mui/material';

interface ActionButtonsProps {
  eventId: number;
  isRegistered: boolean;
  onRegister: (eventId: number) => void;
  onCancel: (eventId: number) => void;
}

const ActionButtons = ({ eventId, isRegistered, onRegister, onCancel }: ActionButtonsProps) => {
  return (
    <>
      {!isRegistered ? (
        <Button 
          variant="contained" 
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRegister(eventId);
          }}
        >
          Register
        </Button>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="success"
            size="small"
            disabled
          >
            Registered
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(eventId);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </>
  );
};

export default ActionButtons;