import React, { useState } from 'react';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle signup logic here (e.g., send data to backend)
        console.log('Signup submitted:', email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            {/* ... password input ... */}
            <button type="submit">Signup</button>
        </form>
    );
}

export default SignupForm;