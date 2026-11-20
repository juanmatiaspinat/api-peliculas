import { User } from "./model";

export const findByEmailWithPassword = (email: string) => {
    return User.findOne({ email }).select("+password");
};

export const findByEmail = (email: string) => {
    return User.findOne({ email });
};

export const createUser = (data: { name: string; email: string; password: string; role?: string }) => {
    return User.create(data);
};

export const findById = (id: string) => {
    return User.findById(id);
};
