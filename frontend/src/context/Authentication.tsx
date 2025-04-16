import { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: any) => {

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token); // login stores token in localstorage
    setToken(token); // login stores token in state
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    setToken(null); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};
