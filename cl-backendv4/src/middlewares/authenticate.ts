import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isAuthenicate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract credentials from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    jwt.verify(token, "rubnawaz", async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await prisma.users.findUnique({
        where: {
          email: decoded.index,
        },
      });

      if (!user) {
        return res.status(401).send({ error: "Not Authorized" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default isAuthenicate;
