import {Router} from 'express';
import {body, param} from 'express-validator';
import {createAccount, login, getUser, createTask, getTasks, updateTasks, deleteTask} from './handler/UserHandler'
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
    .isLength({min: 8, max: 32})
    .withMessage("La contraseña debe contener entre 8 y 32 caracteres"),
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
router.post('/tasks',
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

router.delete('/tasks/:id',
    authenticate,
    param('id')
        .isMongoId()
        .withMessage("Id de tarea invalido"),
    handleInputErrors,
    deleteTask
)

export default router;