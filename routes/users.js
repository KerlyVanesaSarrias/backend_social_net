import { Router } from "express";
import { testUser, register, login, profile } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', profile);





export default router;