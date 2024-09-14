import { SessionService } from './SessionService';
import { JWT_KEY } from '../utils/constants';
import { beforeEach, describe, expect, it } from '@jest/globals';

const jwt = require('jsonwebtoken');

describe('SessionService', () => {
    let sessionService: SessionService;

    beforeEach(() => {
        sessionService = new SessionService();
    });

    it('should add a new session and return a token', () => {
        const email = 'test@example.com';
        const token = sessionService.addSession(email);

        expect(token).toBeDefined();
        expect(sessionService.hasSession(token)).toBe(true);
    });

    it('should remove a session', () => {
        const email = 'test@example.com';
        const token = sessionService.addSession(email);

        sessionService.removeSession(token);

        expect(sessionService.hasSession(token)).toBe(false);
    });

    it('should check if a session exists', () => {
        const email = 'test@example.com';
        const token = sessionService.addSession(email);

        expect(sessionService.hasSession(token)).toBe(true);
        expect(sessionService.hasSession('invalid-token')).toBe(false);
    });

    it('should generate a valid JWT token', () => {
        const email = 'test@example.com';
        const token = sessionService.addSession(email);

        const decodedToken = jwt.verify(token, JWT_KEY);
        expect(decodedToken.email).toBe(email);
    });
});
