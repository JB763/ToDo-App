import {Router} from 'express';
import {body, param} from 'express-validator';
import {createAccount, login, getUser, createTask, getTasks, updateTasks} from './handler/UserHandler'
import {handleInputErrors} from './middleware/validation';
import {authenticate} from './middleware/auth';


const router = Router();

router.post('/register', 
    body('name')
    .notEmpty()
    .withMessage("El nombre es requerido"),
    body('email')
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail(),
    body('password')
    .isLength({min: 8, max: 8})
    .withMessage("La contraseña debe contener 8 caracteres"),
    body('age')
    .notEmpty()
    .withMessage("La edad es necesaria"),
    handleInputErrors,
    createAccount
);
router.post('/login', 
    body('email')
    .notEmpty()
    .withMessage("El Email es requerido"),
    body("password")
    .notEmpty(),
    handleInputErrors,
    login
);
router.get('/user', authenticate, getUser);

//Rutas de Task, deben estar autenticadas
router.post('/createTask',
    authenticate,
    body('title')
        .notEmpty(),
    body('description')
        .optional()
        .isString(),
    body('completed')
        .optional()
        .isBoolean(),
    handleInputErrors,
    createTask
)

// Obtener todas las tareas del usuario autenticado
router.get('/tasks', authenticate, getTasks);

router.patch('/tasks/:id',
    authenticate,
    param('id')
        .isMongoId()
        .withMessage('ID de tarea inválido'),
    body('completed')
        .isBoolean()
        .withMessage('completed debe ser booleano'),
    handleInputErrors,
    updateTasks
);

export default router;