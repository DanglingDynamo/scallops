import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { createUser, getUserByEmail } from "../services/user.service";

export async function signUp(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: "fail", message: "Email and Password are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters",
        });
    }

    try {
        // Create User
        const passwordHash = bcrypt.hashSync(password, 10);

        await createUser({ firstName, lastName, email, passwordHash });
        return res.status(201).json({ status: "success", message: "User Created" });
    } catch (error) {
        console.log(`error: ${error}`);
        return res
            .status(400)
            .json({ status: "fail", message: "Failed To Create User" });
    }
}

export async function signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: "fail", message: "Email and Password are required" });
    }

    try {
        // Create User
        const user = await getUserByEmail(email);
        if (!user) {
            return res
                .status(404)
                .json({ status: "fail", message: "User Not Found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ status: "fail", message: "Invalid Password" });
        }

        const jwtPayload = {
            userId: user.id,
        };

        if (!JWT_SECRET) {
            return res
                .status(500)
                .json({ status: "fail", message: "Internal Server Error" });
        }

        const token = jsonwebtoken.sign(jwtPayload, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.status(201).json({
            status: "success",
            message: "User Signed In",
            data: { token: token },
        });
    } catch (error) {
        console.log(`error: ${error}`);
        return res
            .status(400)
            .json({ status: "fail", message: "Failed To Create User" });
    }
}
