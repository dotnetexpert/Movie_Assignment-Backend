// src/app/api/movies/getById/route.js
import { connectDB } from '@/db';
import { Movie } from '@/model/movie';
import { authorize } from '@/middleware/auth';

export async function GET(request) {
    await connectDB();

    try {
        authorize(request);

        // Extract ID from the URL's search parameters
        const id = new URL(request.url).searchParams.get('id');
        
  
        if (!id) {
            return new Response(JSON.stringify({ error: "Movie ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

      
        const movie = await Movie.getById(id);

        // If no movie found, return a 404 response
        if (!movie) {
            return new Response(JSON.stringify({ error: "Movie not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Return the movie data if found
        return new Response(JSON.stringify(movie), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Failed to retrieve movie by ID:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
