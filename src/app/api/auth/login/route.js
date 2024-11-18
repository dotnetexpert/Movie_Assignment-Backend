import { sql, connectDB } from '@/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@/model/user';
const SECRET_KEY = process.env.SECRET_KEY;
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
        // const result = await sql.query`SELECT * FROM Users WHERE email = ${email}`; 
        // const user = result.recordset[0];

        const user = await User.findByEmail(email );

        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid email' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

       
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { // Use email in token payload
            expiresIn: '1h',
        });

        return new Response(JSON.stringify({ message: 'Login successful', token }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Login failed:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
