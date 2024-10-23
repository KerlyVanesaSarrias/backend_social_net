import { Router } from "express";
import { testUser, register, login, profile, listUsers } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";


const router = Router();

router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id',ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers)





export default router;