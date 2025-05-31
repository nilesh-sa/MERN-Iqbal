
import { Response, NextFunction } from "express";
import { AuthReq } from "../../controller/auth.controller";
import { verifyJWT } from "../../utils/auth.utils";

const authenticate = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        message: "Authorization token was not provided or was not valid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded =  verifyJWT(token);

    if (!decoded) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = decoded as any; // Adjust type if needed
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({
      message: "Authorization token was not provided or was not valid",
    });
  }
};

export default authenticate;
