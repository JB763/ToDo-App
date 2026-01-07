import {Request, Response} from 'express';
import User from '../model/User';
import {checkPassword, hashpassword} from '../utils/auth'
import {generateJWT} from '../utils/jwt'
import Task from "../model/Task";

export const createAccount = async(req: Request, res: Response) => {
    //verificar si no existe el usuario
    const {email, password} = req.body;
    const UserExists = await User.findOne({email: email});
    if(UserExists){
        const error = new Error("El usuario ya existe");
        return res.status(400).json({error: error.message});
    }
    try{
        const user = new User(req.body);
        user.password = await hashpassword(password)
        await user.save();
        res.status(201).send("Usuario creado exitosamente");
    }
    catch(e){
        const error = new Error("Error al crear cuenta");
        return res.status(500).json({error: error.message})
    }
}

export const login = async(req: Request, res: Response) => {
    //busca el usuario
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        const error = new Error("El usuario no se ha encontrado o no existe");
        return res.status(404).json({error: error.message});
    }
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect){
        const error = new Error("Contraseña incorrecta, intente de nuevo");
        return res.status(401).json({error: error.message});
    }
    //generar el token
    const token = generateJWT({id: user._id.toString()})
    res.send(token);
}

//obtiene el usuario autenticado atraves del middleware
export const getUser = async(req: Request, res: Response) => {
    //usuario esta en req gracias al middleware
    res.json(req.user);
}

//crea una tarea asociada al usuario autenticado
export const createTask = async(req: Request, res: Response) => {
    try {
        //spread operator unifica el body con el id del usuario
       const task = new Task({
        ...req.body,
         user: req.user!._id
    });
       await task.save();
       res.status(201).send("Task creada exitosamente");
    }catch(e){
        const error = new Error("Error al crear la tarea");
        return res.status(500).json({error: error.message})
    }
}
//obtiene las tareas del usuario autenticado
export const getTasks = async(req: Request, res: Response) => {
    try {
    const tasks = await Task.find({
        user: req.user!._id
    });
    res.json(tasks);
  } catch (e) {
    const error = new Error("Error al obtener las tareas");
    return res.status(500).json({ error: error.message });
  }
}

