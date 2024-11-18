// src/app/api/movies/delete/route.js
import { connectDB } from "@/db";
import { Movie } from "@/model/movie";
import { authorize } from "@/middleware/auth";

export async function DELETE(request) {
  await connectDB();

  try {
    authorize(request);

    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Movie ID is required" }), {
        status: 400, // Bad Request
        headers: { "Content-Type": "application/json" },
      });
    }

    await Movie.delete(id);

    return new Response(
      JSON.stringify({ message: "Movie deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to delete movie:", error);
    return new Response(JSON.stringify({ error: "Failed to delete movie" }), {
      status: 500, // Internal Server Error
      headers: { "Content-Type": "application/json" },
    });
  }
}
