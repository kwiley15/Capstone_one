import expres from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {requireAuth} from '../middleware/auth.js';


const router = expres.Router();

const uploadBase = 'uploads/';

// Ensure upload directory exists
if (!fs.existsSync(uploadBase)){fs.mkdirSync(uploadBase);}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user?.userId || "plubic";
        const dir = path.join(uploadBase, `user_${userId}`);
        if (!fs.existsSync(dir)){ fs.mkdirSync(dir, { recursive: true }); }
        cb(null, dir);

    },
    filename: function (req, file, cb) { cb(null, Date.now() + "-" + file.originalname);
    }
});;



router.post('/', requireAuth, uploadBase.single("map"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const {mapName} = req.body;
        const fileUrl = `/uploads/user_${req.user.userId}/${req.file.filename}`;

        res.status(201).json({ message: 'File uploaded successfully', fileUrl});
    } catch (error) {
        res.status(500).json({ error: 'Upload failed, please try again ' });
    }
});

