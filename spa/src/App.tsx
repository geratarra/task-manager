import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import LoginForm from './routes/LoginForm';
import SignupForm from './routes/SignupForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './utils/AuthProvider';
import TaskForm from './routes/TaskForm';
import TaskList from './components/TaskList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
    children: [
      {
        path:"list",
        element: <TaskList />,
      },
      {
        path: "task/add",
        element: <ProtectedRoute><TaskForm /></ProtectedRoute>,
      },
      {
        path: "task/update",
        element: <ProtectedRoute><TaskForm /></ProtectedRoute>,
      }
    ]
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
