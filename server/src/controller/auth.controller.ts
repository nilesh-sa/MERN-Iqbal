import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { comparePassword, generateJWT, hashPassword, verifyJWT } from "../utils/auth.utils";
interface AuthUser {
 id: string;
  role: string;
}
interface AuthReq extends Request {
 user?:{
  id: string;
  role: string;
 }
}

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { firstName, lastName, username, email, password, dob } = req.body;
    const profilePicture = req.file?.filename as any;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already exists." });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        dob: new Date(dob),
        profilePicture,
      },
    });
    res.status(201).send({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const MAX_FAILED_ATTEMPTS = 3;
const BLOCK_DURATION_MINUTES = 30;

const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid email or username." });
    }

    // Check if user is blocked
    const now = new Date();
    if ((user.blockUntil && now < new Date(user.blockUntil)) && !user.isActive) {
      const remaining = Math.ceil(
        (new Date(user.blockUntil).getTime() - now.getTime()) / 60000
      );
      return res.status(400).json({
        error: `Account is temporarily blocked due to multiple failed login attempts. Try again in ${remaining} minute(s).`,
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User account is not verified. Please check your email and verify" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const updatedFailedAttempts = user.failledLoginAttempts + 1;

      const updates: any = {
        failledLoginAttempts: updatedFailedAttempts,
        failedLoginAt: new Date(),
        isActive:true
      };

      // If failed attempts exceed limit, block user
      if (updatedFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + BLOCK_DURATION_MINUTES);
        updates.blockUntil = blockUntil;
        updates.isActive= false; 
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      return res.status(400).json({ error: "Invalid password." });
    }

    // If login successful, reset failed attempt tracking
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failledLoginAttempts: 0,
        failedLoginAt: null,
        blockUntil: null,
      },
    });
    const token = generateJWT({id:user.id,role:user.userType},"1h")
    // Send response or JWT token
    return res.status(200).json({ message: "Login successful", token ,
      user:{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      }

    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const VerifyUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required.' });
    }

    // Decode the token
    const decoded: any = await verifyJWT(token);
    if (!decoded?.id) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified.' });
    }

    // Optional: check if token matches and not expired
    const now = new Date();
    if (
      user.emailVerificationToken !== token ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < now
    ) {
      return res.status(400).json({ error: 'Token is invalid or expired.' });
    }

    // Update verification status and clear token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        isActive: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return res.status(200).json({ message: 'User account verified successfully' });
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

const changedPassword = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req?.user as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isOldPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: 'Old password is incorrect.' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}


export { registerUser, userLogin , VerifyUserAccount ,changedPassword , AuthReq,AuthUser};
