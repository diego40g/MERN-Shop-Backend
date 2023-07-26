import { Request, Response, NextFunction  } from 'express';

export const errorhandle=(err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next()
}