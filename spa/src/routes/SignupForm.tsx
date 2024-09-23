import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URI } from '../utils/constants';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
    userEmail: string
    password: string
}

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='block'>
                <h4 className='title is-4'>Signup</h4>
                <div className='field'>
                    <label htmlFor="email" className='label'>Email:</label>
                    <div className="control">
                        <input
                            {...register("userEmail", { required: true })}
                            type="email"
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
                            {...register("password", { required: true, minLength: 8 })}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errors.password && <span className='help is-danger'>This field is required</span>}
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

export default SignupForm;