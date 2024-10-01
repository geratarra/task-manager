import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../utils/AuthProvider';
import { API_URI } from '../utils/constants';
import { ITask } from '../models/Task';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TaskFilter } from '../utils/types';

function TaskList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ status: string }>();

  const fetchTasks = async (status?: string) => {
    try {
      const tasksUrl = API_URI + '/task';
      const params: { status?: string } = {};

      if (status) {
        params.status = status;
      }

      const response = await axios.get(tasksUrl, {
        withCredentials: true,
        params,
      });

      setTasks(response.data);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      if (error.status === 401) navigate('/login');
      setError(error.response?.data?.message || 'Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    if (token) {
      setError(null);
      fetchTasks();
    }
  }, [token]);

  const deleteTask = (task: ITask): React.MouseEventHandler<HTMLButtonElement> => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission behavior if needed

    if (!window.confirm("Are you sure you want to delete this task?")) return;

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

  const handleFilterSubmit: SubmitHandler<TaskFilter> = async (data) => {
    fetchTasks(data.status);
    setIsModalOpen(false);
    reset();
  }

  return (
    <div className='container'>
      <div className={isModalOpen ? 'modal is-active' : 'modal'}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <form onSubmit={handleSubmit(handleFilterSubmit)}>
            <div className="field">
              <label className="label">Status</label>
              <div className="control">
                <label className="radio">
                  <input type="radio" value="pending" {...register('status')} className='mr-2' />
                  Pending
                </label>
                <label className="radio">
                  <input type="radio" value="in progress" {...register('status')} className='mx-2' />
                  In Progress
                </label>
                <label className="radio">
                  <input type="radio" value="completed" {...register('status')} className='mx-2' />
                  Completed
                </label>
              </div>
            </div>
            <div className='field is-grouped'>
              <div className='control'>
                <button className='button is-primary' type="submit">Apply</button>
              </div>
              <div className='control'>
                <button className='button is-danger' onClick={() => fetchTasks}>Reset Filters</button>
              </div>
            </div>
          </form>
        </div>
        <button onClick={() => setIsModalOpen(false)} className="modal-close is-large" aria-label="close"></button>
      </div>

      <h2 className='title is-2'>Task List</h2>
      <div className='block level'>
        <Link to={'/task/add'} className='button is-link level-item'>Add Task</Link>
        <button onClick={() => setIsModalOpen(!isModalOpen)} className='button level-item'>Filters</button>
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