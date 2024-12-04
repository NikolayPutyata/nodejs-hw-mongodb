import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createUserValidation,
  loginUserValidation,
} from '../validation/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutUserController,
  refreshController,
  registerController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(createUserValidation),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(loginUserValidation),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
