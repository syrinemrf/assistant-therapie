import { Router, Response } from "express";
import { register, login, logout } from "../controllers/authController";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;