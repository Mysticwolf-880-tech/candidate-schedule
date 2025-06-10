import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Status from '../settings/Status/Status';
import ShowCandidate from '../candidate/ShowCandidate';
import Home from '../components/home/Home';

const Interviewers = lazy(() => import('../settings/Interviewer/Interviewers'));
const JobPosition = lazy(() => import('../settings/jobPosition/JobPosition'));
const AddCandidateForm = lazy(() => import('../candidate/AddCandidateForm'));
const Dashboard = lazy(() => import('../components/dashbord/Dashboard'));
const Login = lazy(() => import('../components/auth/login/Login'));

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <Login />,
  },

  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'candidate',
            element: <ShowCandidate />,
          },
          {
            path: 'add-candidate',
            element: <AddCandidateForm />,
          },
          {
            path: '/update-candidate/:id',
            element: <AddCandidateForm />,
          },
          {
            path: 'interviewers',
            element: <Interviewers />,
          },
          {
            path: 'jobposition',
            element: <JobPosition />,
          },
           {
            path: 'status',
            element: <Status />,
          },
        ],
      },
    ],
  },
]);

export default router;
