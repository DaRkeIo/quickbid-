import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDir, 'server.log'), { flags: 'a' });

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const headers = JSON.stringify(req.headers);
    
    // Log request details
    const logMessage = `${timestamp} ${method} ${url} Headers: ${headers}\n`;
    console.log(logMessage);
    logStream.write(logMessage);
    
    next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    
    // Log error details
    const logMessage = `${timestamp} ERROR ${method} ${url}\n` +
                      `Error: ${error.message}\n` +
                      `Stack: ${error.stack}\n`;
    console.error(logMessage);
    logStream.write(logMessage);
    
    next(error);
};
