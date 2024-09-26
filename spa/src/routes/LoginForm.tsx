import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider';
import axios from 'axios';
import { API_URI } from '../utils/constants';

function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            const loginUrl = API_URI + '/auth/login';
            const response = await axios.post(loginUrl, {
                email,
                password,
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
        <div className='container'>
            <h2 className='title is-2'>Login</h2>
            <form onSubmit={handleSubmit} className='block'>
                <div className='field'>
                    <label htmlFor="email">Email:</label>
                    <div className='control'>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className='field'>
                    <label htmlFor="password">Password:</label>
                    <div className='control'>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className='field'>
                    <div className='control'>
                        <button className='button is-primary' type="submit">Login</button>
                    </div>
                </div>
            </form>
            <div className='block'>
                {error && <div className='block notification is-danger'>{error}</div>}
            </div>
        </div>
    );
}

export default LoginForm;