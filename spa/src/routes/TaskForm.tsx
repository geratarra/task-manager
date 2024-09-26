import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { API_URI } from "../utils/constants";
import axios from "axios";
import { AuthContext } from "../utils/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

type Inputs = {
    title: string
    description: string
    dueDate: string
    status: string
}

function TaskForm() {
    let { state } = useLocation();
    const [title, setTitle] = useState(state?.title ? state.title : '');
    const [description, setDescription] = useState(state?.description ? state.description : '');
    const [dueDate, setDueDate] = useState(state?.dueDate ? new Date(state.dueDate).toISOString().split('T')[0] : '');
    const [error, setError] = useState<string | null>(null);
    const status: { value: string, label: string }[] = [
        { value: 'pending', label: 'Pending' },
        { value: 'in progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    
    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        try {
            const createTaskUrl = `${API_URI}/task/${state ? state._id : ''}`;
            const method = state ? 'put' : 'post';
            const response = await axios[method](createTaskUrl, {...formData, dueDate: Date.parse(dueDate)}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                navigate('/');
            } else {
                setError('Failed to create task. Please try again.');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'An error occurred while creating the task.');
            if (error.status === 403) navigate('/login');
        }
    }

    return (
        <div className="container">
            <h2 className='title is-2'>{ state ? 'Edit' : 'Add'} Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='block'>
                <div className='field'>
                    <label htmlFor="title" className='label'>Title:</label>
                    <div className="control">
                        <input
                            {...register("title", { required: true })}
                            type="text"
                            id="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    {errors.title && <span className='help is-danger'>This field is required</span>}
                </div>

                <div className='field'>
                    <label htmlFor="description" className='label'>Description:</label>
                    <div className="control">
                        <textarea className="textarea" placeholder="Description"
                            {...register("description", { required: true })}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    {errors.description && <span className='help is-danger'>This field is required</span>}
                </div>

                <div className='field'>
                    <label htmlFor="dueDate" className='label'>Due Date:</label>
                    <div className="control">
                        <input
                            {...register("dueDate", { required: true })}
                            type="date"
                            id="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    {errors.dueDate && <span className='help is-danger'>This field is required</span>}
                </div>

                <div className='field'>
                    <label htmlFor="status" className='label'>Status:</label>
                    <div className="control">
                        <div className="select">
                            <select
                                defaultValue={state?.status ? state.status : 'pending'}
                                {...register("status", { required: true })}
                                id="status">
                                {status.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='field'>
                    <div className='control'>
                        <button className='button is-link' type="submit">Submit</button>
                    </div>
                </div>
            </form>
            <div className='block'>
                {error && <div className='block notification is-danger'>{error}</div>}
            </div>
        </div>
    );
}

export default TaskForm;