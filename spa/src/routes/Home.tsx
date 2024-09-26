import axios from 'axios';
import TaskList from '../components/TaskList';
import { API_URI } from '../utils/constants';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { Outlet, useNavigate } from 'react-router-dom';

function Home() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URI}/auth/logout`, {
        withCredentials: true
      });

      if (response.status === 200) {
        logout();
        navigate('/login');
      } else {
        console.error('Logout failed:', response);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <nav className="level">
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
      <Outlet />
    </div>
  );
}

export default Home;