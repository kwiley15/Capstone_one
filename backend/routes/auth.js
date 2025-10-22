import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';



const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


router.post('/signup', async (req, res) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { email, password: hashedPassword } });
        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });

    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'user not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });


        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });

    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });

    }
});


router.post('/logout', (req, res) => {
    // Since JWTs are stateless, logout can be handled on the client side by simply deleting the token.
    res.json({ message: 'Logout successful' });
});

router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return res.status(401).json({ message: 'Admin not found' });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ message: 'Admin login successful', token });

    } catch (err) {
        res.status(500).json({ message: 'Admin login failed', error: err.message });
    }
});

export default router;



