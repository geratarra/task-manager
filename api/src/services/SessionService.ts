import { JWT_KEY } from "../utils/constants";

const jwt = require('jsonwebtoken');

export class SessionService {
    private sessions: string[] = [];

    public addSession(email: string): string {
        const token = jwt.sign({ email: email }, JWT_KEY, { expiresIn: '30m' });
        this.sessions.push(token);
        return token;
    }

    public removeSession(token: string): void {
        this.sessions = this.sessions.filter((session) => session !== token);
    }

    public hasSession(token: string): boolean {
        return this.sessions.includes(token);
    }
}
