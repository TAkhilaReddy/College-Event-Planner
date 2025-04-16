import { 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TablePagination, 
  Box, 
  Chip, 
  Button, 
  Typography 
} from '@mui/material';
import { Event, LocationOn, Category } from '@mui/icons-material';
import { format } from 'date-fns';
import { EventData } from './types_interfaces';

interface EventsTableProps {
  events: EventData[];
  page: number;
  rowsPerPage: number;
  isEventRegistered: (eventId: number) => boolean;
  onSelectEvent: (event: EventData) => void;
  onRegister: (eventId: number) => void;
  onCancel: (eventId: number) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventsTable = ({
  events,
  page,
  rowsPerPage,
  isEventRegistered,
  onSelectEvent,
  onRegister,
  onCancel,
  onPageChange,
  onRowsPerPageChange
}: EventsTableProps) => {
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
      {events.length > 0 ? (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Event sx={{ mr: 1, fontSize: 20 }} />
                      Date
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                      Location
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Category sx={{ mr: 1, fontSize: 20 }} />
                      Category
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => {
                    const isRegistered = isEventRegistered(event.event_id);
                    return (
                      <TableRow 
                        hover 
                        key={event.event_id}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { 
                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                          },
                          backgroundColor: isRegistered ? 'rgba(76, 175, 80, 0.08)' : 'inherit'
                        }}
                      >
                        <TableCell 
                          sx={{ fontWeight: 500, color: '#1976d2' }}
                          onClick={() => onSelectEvent(event)}
                        >
                          {event.title}
                        </TableCell>
                        <TableCell onClick={() => onSelectEvent(event)}>
                          {formatDate(event.date)}
                        </TableCell>
                        <TableCell onClick={() => onSelectEvent(event)}>
                          {event.time}
                        </TableCell>
                        <TableCell onClick={() => onSelectEvent(event)}>
                          {event.location}
                        </TableCell>
                        <TableCell onClick={() => onSelectEvent(event)}>
                          <Chip
                            label={event.category_name}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {isRegistered ? (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => onCancel(event.event_id)}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onRegister(event.event_id)}
                              >
                                Register
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={events.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No events found. Try adjusting your search or filter criteria.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EventsTable;