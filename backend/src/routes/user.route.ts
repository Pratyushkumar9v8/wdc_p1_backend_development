import { Router } from "express";
import { updateUser, deleteUser, login, register, getProfile} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router= Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/profile").get(isAuthenticated, getProfile)
router.route("/deleteUser/:id").post(isAuthenticated,deleteUser);
router.route("/updateUser/:id").post(isAuthenticated,updateUser);

export default router;