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
                navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'An error occurred during login.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;