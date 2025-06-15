import express from "express";
import { generateAccessToken, generateRefreshToken } from "../utility/common";
import { prismaClient } from "@repo/db-common/client";
import bcrypt from "bcrypt";

export const signup = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any> | any> => {
  try {
    console.log("hitting singup", req.body);
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete credentials" });
    }
    const hashedpass = await bcrypt.hash(password, 10);
    const response = await prismaClient.user.create({
      data: {
        email: email,
        password: hashedpass,
        name: name,
        photo: "",
      },
    });

    return res.status(200).json({ success: true, data: response.id });
  } catch (error) {
    console.log("signup error", error);
    return res
      .status(500)
      .json({ success: false, message: "User already exists" });
  }
};

export const signin = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any> | any> => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete credentials" });
    }
 
    const user = await prismaClient.user.findFirst({ where: { email: email } });
    
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User doesnt exists" });
    }

    const checkPass = await bcrypt.compare(password, user.password);
  
    if (!checkPass) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }

    const refreshToken = generateRefreshToken(user.id);
    await prismaClient.user.update({
      where: { id: user.id },
      data: { refreshtoken: refreshToken },
    });

    const accessToken = generateAccessToken(user.email, user.name);
    const cookieOptions = {
      httpOnly: true, 
      secure: true
    };
    return res
      .cookie("accesstoken", accessToken,cookieOptions)
      .cookie("refreshtoken", refreshToken,cookieOptions)
      .status(200)
      .json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    console.log("signin error",error)
    return res.status(500).json({ success: false, message: error });
  }
};
