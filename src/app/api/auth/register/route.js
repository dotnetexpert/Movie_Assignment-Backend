// src/app/api/auth/register/route.js
import { connectDB } from '@/db';
import { User } from '@/model/user';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request) {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || email.trim() === '') {
        return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400, // Bad Request
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate if the email has the proper format
    if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: 'Invalid email format' }), {
            status: 400, // Bad Request
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate if password is provided and not empty
    if (!password || password.trim() === '') {
        return new Response(JSON.stringify({ error: 'Password is required' }), {
            status: 400, // Bad Request
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {

        const existingUser = await User.findByEmail(email );
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email Already Exist' }), {
                status: 400, 
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else
        {
            await User.create(email, password);
        
            return new Response(JSON.stringify({ message: 'User registered successfully' }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        }

       
    } catch (error) {
        console.error('Registration failed:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
