import { Request, Response } from "express";
import * as movieService from "./service";

export const getAll = async (req: Request, res: Response) => {
    try {
        const { genre, watched } = req.query;
        const movies = await movieService.getAllMovies({
            genre: genre as string | undefined,
            watched: watched as string | undefined,
        });
        return res.status(200).json(movies);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        return res.status(200).json(movie);
    } catch (error: any) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        return res.status(400).json({ error: "ID de película inválido" });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { title, director, releaseYear, genre, rating, watched } = req.body;
        const userId = (req as any).user.id;

        if (!title || !director || !releaseYear || !genre || rating === undefined) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const movie = await movieService.createMovie({
            title,
            director,
            releaseYear,
            genre,
            rating,
            watched,
            userId,
        });

        return res.status(201).json(movie);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const updated = await movieService.updateMovie(req.params.id, req.body, user);
        return res.status(200).json(updated);
    } catch (error: any) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ error: "No tenés permiso para editar esta película" });
        }
        return res.status(400).json({ error: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        await movieService.deleteMovie(req.params.id, user);
        return res.status(200).json({ message: "Película eliminada correctamente" });
    } catch (error: any) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ error: "No tenés permiso para eliminar esta película" });
        }
        return res.status(400).json({ error: error.message });
    }
};
