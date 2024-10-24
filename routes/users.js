import { Router } from "express";
import { testUser, register, login, profile, listUsers, updateUser } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars',
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif'], 
        public_id: (req, file) => 'avatar-' + Date.now()
    }
});

const uploads = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 } 
});

const router = Router();

router.get('/test-user', testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers)
router.put('/update', ensureAuth, updateUser)





export default router;