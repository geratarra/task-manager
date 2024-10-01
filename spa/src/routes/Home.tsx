import axios from 'axios';
import TaskList from '../components/TaskList';
import { API_URI } from '../utils/constants';
import { useContext, useState } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { Outlet, useNavigate } from 'react-router-dom';

function Home() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState<string>();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URI}/auth/logout`, {}, {
        withCredentials: true
      });

      if (response.status === 200 || response.status === 204) {
        logout();
        navigate('/login');
      } else {
        console.error('Logout failed:', response);
        setError('Failed to logout. Please try again.');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.response?.data?.message || 'Failed to logout. Please try again.');
    }
  };

  return (
    <div>
      <nav className="level p-5">
        <div className="level-left">
          <div className="level-item">
            <h2 className='title is-2'>Task Manager</h2>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <button className="button is-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className='block container'>
          {error && <div className='block notification is-danger'>{error}</div>}
      </div>
      <Outlet />
    </div>
  );
}

export default Home;