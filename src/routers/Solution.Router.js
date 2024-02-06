import { Router } from "express";
import { authenticationToken } from "../Middleware/Authentication.middleware.js";
import { alterLikesToSolution, getDetailsOfSolution, getSolutions, uploadSolution } from "../controllers/Solution.controller.js";

const router = Router();

router.post('/upload-solution',authenticationToken, uploadSolution);
router.get('/get-solutions', authenticationToken, getSolutions);
router.put('/alter-likes-to-solution', authenticationToken, alterLikesToSolution);
router.get('/get-details-of-solution',authenticationToken,getDetailsOfSolution);
export default router;