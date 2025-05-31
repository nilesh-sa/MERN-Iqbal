  import { NextFunction, Request, Response } from 'express';
  import prisma from '../lib/prisma';
import { hashPassword } from '../utils/auth.utils';
  const registerUser = async (req: Request, res: Response,next:NextFunction):Promise<any> => {
    try {
      const { firstName, lastName, username, email, password, dob } = req.body;
      const profilePicture = req.file?.filename as any ;
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username },
          ],
        },
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username already exists.' });
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
          profilePicture ,
        },
      });
      res.status(201).send({ 
         message:"User registered successfully",

      });
    } catch (error) {
      console.error('Create User Error:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  };

  export {
    registerUser
  }