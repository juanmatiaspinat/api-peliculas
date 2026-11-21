import * as movieDAO from "./dao";

export const getAllMovies = async (query: {
    genre?: string;
    watched?: string;
}) => {
    const filters: Record<string, any> = {};

    if (query.genre) {
        filters.genre = query.genre;
    }

    if (query.watched !== undefined) {
        filters.watched = query.watched === "true";
    }

    return movieDAO.findAll(filters);
};

export const getMovieById = async (id: string) => {
    const movie = await movieDAO.findById(id);
    if (!movie) {
        throw new Error("NOT_FOUND");
    }
    return movie;
};

export const createMovie = async (data: {
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    rating: number;
    watched?: boolean;
    userId: string;
}) => {
    const currentYear = new Date().getFullYear();

    if (data.rating < 1 || data.rating > 10) {
        throw new Error("El puntaje debe estar entre 1 y 10");
    }

    if (data.releaseYear < 1888 || data.releaseYear > currentYear) {
        throw new Error(`El año de estreno debe estar entre 1888 y ${currentYear}`);
    }

    const duplicate = await movieDAO.findByTitleAndDirector(
        data.title,
        data.director,
    );
    if (duplicate) {
        throw new Error("Esa película del mismo director ya está en el catálogo");
    }

    return movieDAO.create(data);
};

export const updateMovie = async (
    id: string,
    data: Record<string, any>,
    user: { id: string; role: string },
) => {
    const movie = await movieDAO.findById(id);
    if (!movie) {
        throw new Error("NOT_FOUND");
    }

    const ownerId = (movie.userId as any)._id
        ? (movie.userId as any)._id.toString()
        : movie.userId.toString();

    if (ownerId !== user.id && user.role !== "admin") {
        throw new Error("FORBIDDEN");
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 10)) {
        throw new Error("El puntaje debe estar entre 1 y 10");
    }

    const currentYear = new Date().getFullYear();
    if (
        data.releaseYear !== undefined &&
        (data.releaseYear < 1888 || data.releaseYear > currentYear)
    ) {
        throw new Error(`El año de estreno debe estar entre 1888 y ${currentYear}`);
    }

    return movieDAO.update(id, data);
};

export const deleteMovie = async (
    id: string,
    user: { id: string; role: string },
) => {
    const movie = await movieDAO.findById(id);
    if (!movie) {
        throw new Error("NOT_FOUND");
    }

    const ownerId = (movie.userId as any)._id
        ? (movie.userId as any)._id.toString()
        : movie.userId.toString();

    if (ownerId !== user.id && user.role !== "admin") {
        throw new Error("FORBIDDEN");
    }

    return movieDAO.remove(id);
};
