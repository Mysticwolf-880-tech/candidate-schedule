import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; 

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Redirect user to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
