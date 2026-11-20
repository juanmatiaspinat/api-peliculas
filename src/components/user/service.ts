import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userDAO from "./dao";

export const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    const existingUser = await userDAO.findByEmail(data.email);
    if (existingUser) {
        throw new Error("El correo ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await userDAO.createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    });

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    };
};

export const login = async (email: string, password: string) => {
    const user = await userDAO.findByEmailWithPassword(email);
    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Credenciales inválidas");
    }

    const secret = process.env.JWT_SECRET || "clave_secreta_peliculas_2026";
    const token = jwt.sign(
        { id: user._id, role: user.role },
        secret,
        { expiresIn: "2h" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
