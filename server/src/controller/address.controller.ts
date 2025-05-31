import { NextFunction, Response } from "express";

import { AuthReq, AuthUser } from "./auth.controller";
import prisma from "../lib/prisma";

 const getAllAddresses = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req?.user as AuthUser;

  try {
    const { title, city, state } = req.query;

    // Build dynamic filter
    const where: any = {
      userId: id,
    };

    if (title) {
      where.title = String(title);
    }
    if (city) {
      where.city = String(city);
    }
    if (state) {
      where.state = String(state);
    }

    const addresses = await prisma.address.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Addresses retrieved successfully",
      addresses,
    });
  } catch (error) {
    console.error("Get Addresses Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const getAddressesByTitle = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.user as AuthUser;
  const { title } = req.params;

  if (!title) {
    return res.status(400).json({
      message: "Title is required to search address",
    });
  }

  try {
    const [addresses, count] = await Promise.all([
      prisma.address.findMany({
        where: {
          userId: id,
          title: String(title),
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.address.count({
        where: {
          userId: id,
          title: String(title),
        },
      }),
    ]);

    return res.status(200).json({
      message: `Found ${count} address(es) with title "${title}"`,
      count,
      addresses,
    });
  } catch (error) {
    console.error("Get Addresses By Title Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
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

const updateAddress = async (req: AuthReq, res: Response,next:NextFunction):Promise<any> => {
 
  const { addressId } = req.params;
  const {id}= req.user as AuthUser; // Ensure user ID is a string

  try {
    const existingAddress = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: id, 
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }

    const updateData: any = {};

    // Dynamically set only provided fields
    const fields = [
      'title',
      'houseNumber',
      'buildingName',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'zipCode',
      'isDefault',
    ];

    fields.forEach((field) => {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    });

    // Handle isDefault logic
    if (req.body.isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId:id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: updateData,
    });

    res.json({
      message: 'Address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    console.error('Update Address Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteAddress = async (req: AuthReq, res: Response,next:NextFunction):Promise<any> => {
    const { addressId } = req.params;
    const {id} = req.user as AuthUser; // Ensure user ID is a string
    
    try {
        const existingAddress = await prisma.address.findUnique({
        where: {
            id: addressId,
            userId: id, 
        },
        });
    
        if (!existingAddress) {
        return res.status(404).json({ message: 'Address not found or not authorized' });
        }
    
        await prisma.address.delete({
        where: {
            id: addressId,
        },
        });
    
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete Address Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
    }

export { registerAddress,updateAddress,deleteAddress,getAllAddresses ,getAddressesByTitle };
