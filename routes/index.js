import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';


const router = Router();

// Define the routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the route for creating a new user
router.post('/users', UsersController.postNew);
// Add the new authentication endpoints
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
// Add the route for getting user details based on the token
router.get('/users/me', UsersController.getMe);

export default router;
