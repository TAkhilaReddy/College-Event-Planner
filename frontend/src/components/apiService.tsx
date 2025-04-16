export const fetchEvents = async (token: string) => {
  const response = await fetch('http://localhost:3001/api/events', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch events');
  return await response.json();
};

export const fetchCategories = async (token: string) => {
  const response = await fetch('http://localhost:3001/api/categories', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
};

export const fetchRegistrations = async (token: string) => {
  const response = await fetch('http://localhost:3001/api/registrations/my-events', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch registrations');
  return await response.json();
};