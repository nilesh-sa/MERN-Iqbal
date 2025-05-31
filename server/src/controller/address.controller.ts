import { NextFunction, Response } from "express";

import { AuthReq, AuthUser } from "./auth.controller";
import prisma from "../lib/prisma";

const registerAddress = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const {
    title,
    houseNumber,
    buildingName,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    isDefault = false,
  } = req.body;

  try {
    const {id} = req?.user as AuthUser; // Ensure user ID is a string

    // If new address is marked default, update existing default to false
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        title,
        houseNumber,
        buildingName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        isDefault,
        userId:id,
      },
    });

    return res.status(201).json({
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Create Address Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { registerAddress };
