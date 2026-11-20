import { Request, Response } from "express";
import * as userService from "./service";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nombre, email y contraseña son obligatorio" });
        }

        const user = await userService.register({ name, email, password, role });
        return res.status(201).json(user);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorio" });
        }

        const result = await userService.login(email, password);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
};
