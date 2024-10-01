import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider';
import axios from 'axios';
import { API_URI, PASSWORD_REGEX } from '../utils/constants';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthInputs } from '../utils/types';


function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthInputs>({ mode: 'onBlur' });

    const loginSubmit: SubmitHandler<AuthInputs> = async (formData) => {
        setError(null);

        try {
            const loginUrl = API_URI + '/auth/login';
            const response = await axios.post(loginUrl, {
                email,
                password,
            }, {
                withCredentials: true
            });

            const token = response.data.token;

            if (token) {
                login(token);
                navigate('/list');
            } else {
                setError('Invalid credentials');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'An error occurred during login.');
        }
    };

    return (
        <div className='container py-5 is-flex is-flex-direction-column is-align-items-center'>
            <h2 className='title is-2'>Login</h2>
            <form onSubmit={handleSubmit(loginSubmit)} className='block column is-half'>
                <div className='field'>
                    <label className='label' htmlFor="email">Email:</label>
                    <div className='control'>
                        <input
                            className="input"
                            type="email"
                            id="email"
                            value={email}
                            {...register("userEmail", { required: true })}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    </div>
                    {errors.userEmail && <span className='help is-danger'>This field is required</span>}
                </div>
                <div className='field'>
                    <label className='label' htmlFor="password">Password:</label>
                    <div className='control'>
                        <input
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                pattern: PASSWORD_REGEX
                            })}
                            className="input"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {errors.password?.type === 'required' && <span className='help is-danger'>This field is required</span>}
                    {errors.password?.type === 'minLength' && <span className='help is-danger'>Password must be at least 8 characters long</span>}
                    {errors.password?.type === 'pattern' && <span className='help is-danger'>Password must contain at least one uppercase letter, one number, and one special character</span>}
                </div>
                <div className='field'>
                    <div className='control is-flex is-flex-direction-column is-align-items-center'>
                        <button className='button is-primary' type="submit">Login</button>
                    </div>
                </div>
            </form>
            <div className='block'>
                <p>Don't have an account? <a href="/signup">Signup</a></p>
            </div>
            <div className='block'>
                {error && <div className='block notification is-danger'>{error}</div>}
            </div>
        </div>
    );
}

export default LoginForm;