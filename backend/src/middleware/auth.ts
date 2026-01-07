import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User';
import { IUser } from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}


export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    // Leer el token del encabezado Authorization
    const bearer = req.headers.authorization;

    if(!bearer){
        const error = new Error("No autorizado");
        return res.status(401).json({error: error.message})
    }

    // Extraer el token del formato "Bearer <token>"
    const [, token] = bearer.split(' ');

    if(!token){
        const error = new Error("No autorizado");
        return res.status(401).json({error: error.message})
    }

    try {
        // Verificar y decodificar el token JWT
        const result = jwt.verify(token, process.env.JWT_SECRET as string);
        //token debe ser un objeto con la propiedad id
        if(typeof result === 'object' && result.id){
            // Buscar el usuario en la base de datos por su ID y excluir la contraseña del resultado
            const user = await User.findById(result.id).select('-password');
            if(!user){
                const error = new Error("Usuario no existe");
                return res.status(401).json({error: error.message})
            }
            // Adjuntar el usuario autenticado al objeto req para su uso en rutas protegidas
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(500).json({error: 'Token no valido'})
    }
}
