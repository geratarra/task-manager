import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../utils/AuthProvider';
import { API_URI } from '../utils/constants';
import { ITask } from '../models/Task';
import { Link, useNavigate } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksUrl = API_URI + '/task';
        const response = await axios.get(tasksUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(response.data);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        if (error.status === 401) navigate('/login');
        setError(error.response?.data?.message || 'Failed to fetch tasks.');
      }
    };

    if (token) {
      setError(null);
      fetchTasks();
    }
  }, [token]);

  const deleteTask = (task: ITask): React.MouseEventHandler<HTMLButtonElement> => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission behavior if needed

    try {
      const response = await axios.delete(`${API_URI}/task/${task._id}`, { withCredentials: true });
      setError(null);

      if (response.status === 204) {
        setTasks(tasks.filter(t => t._id !== task._id));
      } else {
        setError('Failed to delete task.');
        console.error('Error deleting task:', response);
      }
    } catch (error: any) {
      console.error('Error deleting task:', error);
      if (error.status === 401) navigate('/login');
      setError(error.response?.data?.message || 'Failed to delete task.');
    }
  }

  return (
    <div className='container'>
      <h2 className='title is-2'>Task List</h2>
      <div className='block'>
        <Link to={'/task/add'} className='button is-link'>Add Task</Link>
      </div>

      <div className='block'>
        {error && <div className='block notification is-danger'>{error}</div>}
      </div>

      {tasks && tasks.length === 0 && <p>No tasks found.</p>}

      {tasks && tasks.length !== 0 &&
        <table className='table container'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{new Date(task.dueDate).toISOString().split('T')[0]}</td>
                <td style={{ textTransform: 'capitalize' }}>{task.status}</td>
                <td className='level'>
                  <Link to={'/task/update'} state={task} className='level-item button is-primary is-small'>Update</Link>
                  <button onClick={deleteTask(task)} className='level-item button is-danger is-small'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default TaskList;