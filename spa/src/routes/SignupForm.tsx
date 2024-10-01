import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URI, PASSWORD_REGEX } from '../utils/constants';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthInputs } from '../utils/types';


function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthInputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<AuthInputs> = async (formData) => {
        setError(null);

        try {
            const signupUrl = API_URI + '/auth/signup';
            const response = await axios.post(signupUrl, {
                email,
                password,
            });

            if (response.status === 201) {
                setError(null);
                navigate('/login');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'An error occurred during signup.');
        }
    };

    return (
        <div className='container py-5 is-flex is-flex-direction-column is-align-items-center'>
            <h2 className='title is-2'>Signup</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='block column is-half'>
                <div className='field'>
                    <label htmlFor="email" className='label'>Email:</label>
                    <div className="control">
                        <input
                            {...register("userEmail", { required: true })}
                            type="email"
                            className='input'
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.userEmail && <span className='help is-danger'>This field is required</span>}
                </div>
                <div className='field'>
                    <label htmlFor="password" className='label'>Password:</label>
                    <div className="control">
                        <input
                            {...register("password", {
                                required: true,
                                minLength: 8,
                                pattern: PASSWORD_REGEX
                            })}
                            type="password"
                            className='input'
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errors.password?.type === 'required' && <span className='help is-danger'>This field is required</span>}
                    {errors.password?.type === 'minLength' && <span className='help is-danger'>Password must be at least 8 characters long</span>}
                    {errors.password?.type === 'pattern' && <span className='help is-danger'>Password must contain at least one uppercase letter, one number, and one special character</span>}
                </div>
                <div className='field'>
                    <div className='control is-flex is-flex-direction-column is-align-items-center'>
                        <button className='button is-primary' type="submit">Submit</button>
                    </div>
                </div>
            </form>
            <div className='block'>
                {error && <div className='block notification is-danger'>{error}</div>}
            </div>
        </div>
    );
}

export default SignupForm;