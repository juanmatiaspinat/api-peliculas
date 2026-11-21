import { Movie } from "./model";

export const findAll = (filters: Record<string, any> = {}) => {
    return Movie.find(filters).populate("userId", "name email");
};

export const findById = (id: string) => {
    return Movie.findById(id).populate("userId", "name email");
};

export const findByTitleAndDirector = (title: string, director: string) => {
    return Movie.findOne({ title, director });
};

export const create = (data: {
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    rating: number;
    watched?: boolean;
    userId: string;
}) => {
    return Movie.create(data);
};

export const update = (id: string, data: Record<string, any>) => {
    return Movie.findByIdAndUpdate(id, data, { new: true });
};

export const remove = (id: string) => {
    return Movie.findByIdAndDelete(id);
};
