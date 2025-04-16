import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';


interface Events {
  event_id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  category: string;
}

const formatNumber = (val: number | string): string => typeof val === 'string' ? parseFloat(val).toFixed(2) : val.toFixed(2);


interface Goal {
  goal_id: number;
  goal_name: string;
  target_amount: number;
  savings_basis: string;
  savings_amount: number;
  progress?: number; // Optional property for progress
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<any>({
    goal_name: '',
    target_amount: 0,
    savings_basis: 'monthly',
    savings_amount: 0,
  });
  const [newSavingsAmount, setNewSavingsAmount] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<string>('Start saving toward your goal!');
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Fetching goals with token', token);
      const res = await fetch('http://localhost:3000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched goals data:', data);
      
      // Ensure data is an array
      const goalsArray = Array.isArray(data) ? data : [];
      
      const goalsWithProgress = goalsArray.map((g: Goal) => ({
        ...g,
        progress: (g.savings_amount / g.target_amount) * 100,
      }));
      
      setGoals(goalsWithProgress);
    } catch (error: any) {
      console.error('Failed to fetch goals:', error);
      setError(error.message || 'Failed to fetch goals');
      setSnackbarMessage('Failed to load goals. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };


 const handleOpenDialog = (mode: 'add' | 'edit', goal?: Goal) => {
    setDialogMode(mode);
    if (mode === 'edit' && goal) {
      setFormData({
        goal_id: goal.goal_id,
        goal_name: goal.goal_name,
        target_amount: goal.target_amount,
        savings_basis: goal.savings_basis,
        savings_amount: goal.savings_amount
      });
    } else {
      setFormData({ 
        goal_name: '', 
        target_amount: 0, 
        savings_basis: 'monthly', 
        savings_amount: 0 
      });
    }
    setOpenDialog(true);
  };

   const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!token) {
      setSnackbarMessage('Authentication required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    const url = dialogMode === 'add'
      ? 'http://localhost:3000/api/goals'
      : `http://localhost:3000/api/goals/${formData.goal_id}`;

    const method = dialogMode === 'add' ? 'POST' : 'PUT';

    try {
      console.log('Submitting goal data:', formData);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          goal_name: formData.goal_name,
          savings_basis: formData.savings_basis,
          target_amount: Number(formData.target_amount),
          savings_amount: Number(formData.savings_amount)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setSnackbarMessage(dialogMode === 'add' ? 'Goal added!' : 'Goal updated!');
      setSnackbarSeverity('success');
      await fetchGoals();
    } catch (err: any) {
      console.error('Failed to submit goal:', err);
      setSnackbarMessage('Something went wrong.');
      setSnackbarSeverity('error');
    } finally {
      handleCloseDialog();
      setOpenSnackbar(true);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!token) {
      setSnackbarMessage('Authentication required');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setSnackbarMessage('Goal deleted!');
      setSnackbarSeverity('success');
      
      // If deleted goal was selected, clear selection
      if (selectedGoal?.goal_id === goalId) {
        setSelectedGoal(null);
        setNewSavingsAmount(0);
      }
      
      await fetchGoals();
    } catch (err: any) {
      console.error('Delete error:', err);
      setSnackbarMessage('Failed to delete goal.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleSelectGoal = (goal: Goal) => {
    if (selectedGoal?.goal_id === goal.goal_id) {
      setSelectedGoal(null);
      setNewSavingsAmount(0);
      setSuggestion('Select a goal to track progress!');
    } else {
      setSelectedGoal(goal);
      setNewSavingsAmount(0);
      setSuggestion(goal.progress === 100 
        ? "You've reached your goal!" 
        : `Keep going! Save ${calculateSuggestion(goal)} to reach your goal.`);
    }
  };

  const calculateSuggestion = (goal: Goal): string => {
    const remaining = goal.target_amount - goal.savings_amount;
    if (remaining <= 0) return "nothing more - you've reached your goal!";
    
    const periodsMap: { [key: string]: number } = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      yearly: 1
    };
    
    const periods = periodsMap[goal.savings_basis] || 12; // Default to monthly
    return `$${(remaining / periods).toFixed(2)} per ${goal.savings_basis} period`;
  };

  const handleNewSavingsAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSavingsAmount(Number(e.target.value));
  };

   const handleUpdateSavings = async () => {
    if (!selectedGoal || !token) return;
    
    const updated = selectedGoal.savings_amount + newSavingsAmount;
    try {
      const response = await fetch(`http://localhost:3000/api/goals/${selectedGoal.goal_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          goal_name: selectedGoal.goal_name,
          savings_basis: selectedGoal.savings_basis,
          target_amount: selectedGoal.target_amount,
          savings_amount: updated
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const isGoalReached = updated >= selectedGoal.target_amount;
      setSnackbarMessage(isGoalReached 
        ? 'Congratulations! You achieved your goal!' 
        : 'Savings updated!');
      setSnackbarSeverity('success');
      setNewSavingsAmount(0);
      await fetchGoals();
    } catch (err: any) {
      console.error('Failed to update savings:', err);
      setSnackbarMessage('Failed to update savings.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

     

  return (
    <div className="goals-container">
      <Container maxWidth="lg" sx={{ position: 'relative', right: '10px', paddingTop: '24px' }}>
        <Box className="header-container">
          <Typography variant="h4" component="h1" className="page-title">
            Future Goals
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            className="add-goal-btn"
          >
            Add Goal
          </Button>
        </Box>

        {/* Selected Goal Card */}
        {selectedGoal && (
          <Card className="selected-goal-card" sx={{ mb: 4, p: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" component="h2" sx={{ color: '#000' }}>
                    {selectedGoal.goal_name}
                  </Typography>
                  <Typography sx={{ color: '#000' }} gutterBottom>
                    Savings basis: {selectedGoal.savings_basis}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                    <Typography variant="body1" sx={{ mr: 2, color: '#000' }}>
                      Progress:
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedGoal.progress || 0} 
                        color={selectedGoal.progress === 100 ? "success" : "primary"}
                        sx={{ height: 10, borderRadius: 2 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2, color: '#000' }}>
                      {Math.round(Math.min(100, selectedGoal.progress || 0))}%
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{color: '#000' }}>
                    Target: ${formatNumber(selectedGoal.target_amount)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    Current savings: ${formatNumber(selectedGoal.savings_amount)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    Remaining: ${formatNumber(
                      Math.max(0, selectedGoal.target_amount - selectedGoal.savings_amount)
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
                      Add Savings
                    </Typography>
                    <TextField
                      label="Add Amount"
                      type="number"
                      value={newSavingsAmount}
                      onChange={handleNewSavingsAmountChange}
                      sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#000',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: '#000',
                          }
                        }}
                      InputProps={{
                        startAdornment: <span style={{ color: '#000' }}>$</span>,
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleUpdateSavings}
                      disabled={newSavingsAmount <= 0}
                      sx={{
                          backgroundColor: '#1976d2', // Force a visible background color
                          color: '#fff', // Force white text for contrast
                          '&:hover': {
                            backgroundColor: '#1565c0', // Slightly darker on hover
                          },
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                          }
                        }}
                    >
                      Add to Savings
                    </Button>
                    
                    <Alert severity={
                      selectedGoal.progress === 100 ? "success" : "info"
                    } sx={{ mt: 2 }}>
                      {suggestion}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper elevation={3} className="error-paper" sx={{ p: 3, bgcolor: '#ffebee' }}>
            <Typography variant="h6" align="center" color="error">
              Error: {error}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={fetchGoals}
              >
                Retry
              </Button>
            </Box>
          </Paper>
        ) : goals.length === 0 ? (
          <Paper elevation={3} className="no-goals-paper">
            <Typography variant="h6" align="center" color='black'>
              No goals found. Start by adding a new goal!
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} className="goals-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Goal Name</TableCell>
                  <TableCell align="right">Target Amount ($)</TableCell>
                  <TableCell align="right">Savings Basis</TableCell>
                  <TableCell align="right">Savings Amount ($)</TableCell>
                  <TableCell align="right">Progress</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.goal_id} 
                    sx={{ 
                      backgroundColor: selectedGoal?.goal_id === goal.goal_id ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedGoal?.goal_id === goal.goal_id}
                        onChange={() => handleSelectGoal(goal)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">{goal.goal_name}</TableCell>
                    <TableCell align="right">${formatNumber(goal.target_amount)}</TableCell>
                    <TableCell align="right">{goal.savings_basis.charAt(0).toUpperCase() + goal.savings_basis.slice(1)}</TableCell>
                    <TableCell align="right">${formatNumber(goal.savings_amount)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, goal.progress || 0)} 
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${Math.round(Math.min(100, goal.progress || 0))}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog('edit', goal)}
                        className="action-btn"
                      >
                        Edit
                      </Button>
                      <Button 
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteGoal(goal.goal_id)}
                        className="action-btn"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <EditGoalDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleInputChange}
          dialogMode={dialogMode}
        />

        {/* Snackbar for notifications */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Goals;
