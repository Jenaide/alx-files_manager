import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';


const router = Router();

// Define the routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Add the route for creating a new user
router.post('/users', UsersController.postNew);

export default router;
