import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/navbar';
import { AuthContext } from '../context/Authentication';
import {Box,Button,Chip,CircularProgress,FormControlLabel,FormGroup,Grid,InputAdornment,Paper,TextField,Typography,Checkbox,Alert,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Fade,Snackbar} from '@mui/material';
import { Search, Event, LocationOn, Category, AddCircleOutline } from '@mui/icons-material';
import { format } from 'date-fns';
import EventDetailsCard from '../components/eventDetails';
import   '../styles/Dashboard.css';


interface CategoryData {
  category_id: number;
  name: string;
}

interface EventData {event_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category_id: number;
  category_name: string;
}

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventsResponse = await fetch('http://localhost:3001/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();

        const categoriesResponse = await fetch('http://localhost:3001/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();

        // Fetch user registrations
        const registrationsResponse = await fetch('http://localhost:3001/api/registrations/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (registrationsResponse.ok) {
          const registrationsData = await registrationsResponse.json();
          // Map to extract event_id (or whatever field represents the event ID in your API response)
          setRegisteredEventIds(registrationsData.map((reg: any) => reg.event_id));
        }

        const eventsWithCategories = eventsData.map((event: EventData) => {
          const category = categoriesData.find((cat: CategoryData) => cat.category_id === event.category_id);
          return {
            ...event,
            category_name: category ? category.name : 'Uncategorized',
          };
        });

        setEvents(eventsWithCategories);
        setFilteredEvents(eventsWithCategories);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    let result = events;

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      result = result.filter(
        event =>
          regex.test(event.title) ||
          regex.test(event.location) ||
          regex.test(event.category_name)
      );
    }

    if (selectedCategoryIds.length > 0) {
      result = result.filter(event =>
        selectedCategoryIds.includes(event.category_id)
      );
    }

    setFilteredEvents(result);
    setPage(0);
  }, [searchTerm, selectedCategoryIds, events]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategoryIds([]);
  };
    
  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    // Scroll to top of page to see details card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEventRegistered = (eventId: number) => {
    return registeredEventIds.includes(eventId);
  };
  
  const handleRegister = async (eventId: number) => {
    try {
      // Note: Changed from event_id to eventId to match backend expectations
      const response = await fetch("http://localhost:3001/api/registrations/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: eventId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      setRegisteredEventIds(prev => [...prev, eventId]);
      setSuccessMessage("Successfully registered for event!");
    } catch (err: any) {
      setError(err.message || "Error registering for event. Please try again.");
    }
  };

  const handleCancel = async (eventId: number) => {
    try {
      // Note: Changed from event_id to eventId to match backend expectations
      const response = await fetch("http://localhost:3001/api/registrations/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: eventId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cancellation failed");
      }
      
      setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
      setSuccessMessage("Successfully cancelled registration!");
    } catch (err: any) {
      setError(err.message || "Error cancelling registration. Please try again.");
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#9400D3' }}>
          Available Events
        </Typography>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
              
        {selectedEvent && (
          <Fade in={!!selectedEvent}>
            <Box mb={3}>
              <EventDetailsCard
                event={selectedEvent}
                isRegistered={isEventRegistered(selectedEvent.event_id)}
                onRegister={() => handleRegister(selectedEvent.event_id)}
                onCancel={() => handleCancel(selectedEvent.event_id)}
              />
              <Button
                variant="outlined"
                onClick={() => setSelectedEvent(null)}
                sx={{ mt: 1 }}
              >
                Close Details
              </Button>
            </Box>
          </Fade>
        )}

        {/* Search and Filter Card */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
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
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
               <br /> <b>Filter by category:</b>
              </Typography>
              <FormGroup row>
                {categories.map(category => (
                  <FormControlLabel
                    key={category.category_id}
                    control={
                      <Checkbox
                        checked={selectedCategoryIds.includes(category.category_id)}
                        onChange={() => handleCategoryChange(category.category_id)}
                        color="primary"
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
                color="secondary"
                onClick={handleClearFilters}
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>

            {selectedCategoryIds.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Filtering by:
                </Typography>
                {selectedCategoryIds.map(id => {
                  const category = categories.find(cat => cat.category_id === id);
                  return (
                    <Chip
                      key={id}
                      label={category?.name}
                      onDelete={() => handleCategoryChange(id)}
                      sx={{ mr: 1, mb: 1 }}
                      color="primary"
                    />
                  );
                })}
              </Grid>
            )}
          </Grid>
        </Paper>

       
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : filteredEvents.length > 0 ? (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#6A5ACD' }}>
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
                    {filteredEvents
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
                              sx={{ fontWeight: 500, color: '#800080' }}
                              onClick={() => handleSelectEvent(event)}
                            >
                              {event.title}
                            </TableCell>
                            <TableCell onClick={() => handleSelectEvent(event)}>
                              {formatDate(event.date)}
                            </TableCell>
                            <TableCell onClick={() => handleSelectEvent(event)}>
                              {event.time}
                            </TableCell>
                            <TableCell onClick={() => handleSelectEvent(event)}>
                              {event.location}
                            </TableCell>
                            <TableCell onClick={() => handleSelectEvent(event)}>
                              <Chip
                                label={event.category_name}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {!isRegistered ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRegister(event.event_id);
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
                                      handleCancel(event.event_id);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              )}
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
                count={filteredEvents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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

        {/* Create Event Card */}
        <Paper sx={{ mt: 3, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: '#9370db' }}>
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
              Create New Event
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Dashboard;

