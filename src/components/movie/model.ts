import { Schema, model, Types } from "mongoose";

const movieSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        director: { type: String, required: true, trim: true },
        releaseYear: { type: Number, required: true },
        genre: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 10 },
        watched: { type: Boolean, default: false },
        userId: { type: Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Movie = model("Movie", movieSchema);
