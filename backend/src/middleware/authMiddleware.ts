import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserDocument } from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: UserDocument;
    userId?: string;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Handle both 'Bearer token' and plain token formats
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
            if (!decoded.userId) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return;
            }

            // Set user information on request
            req.user = user;
            req.userId = user._id.toString();
            
            next();
        } catch (error) {
            console.error('JWT verification error:', error);
            if (error instanceof Error && error.message.includes('invalid token')) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
