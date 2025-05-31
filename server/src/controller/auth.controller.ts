import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { comparePassword, generateJWT, hashPassword } from "../utils/auth.utils";
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
      };

      // If failed attempts exceed limit, block user
      if (updatedFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + BLOCK_DURATION_MINUTES);
        updates.blockUntil = blockUntil;
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
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export { registerUser, userLogin };
