import {CorsOptions} from "cors";

/**
 * Configuracion de CORS para la API.
 *
 * - Permite solicitudes desde la URL configurada en FRONTEND_URL.
 * - Si el servidor se arranca con la bandera `--api`, tambien acepta
 *   solicitudes sin encabezado Origin (ej. llamadas desde curl o tests).
 * - Rechaza cualquier origen que no este en la lista blanca devolviendo
 *   un error de CORS.
 */
export const corsConfig : CorsOptions = {
    origin: function(origin, callback){
        const whiteList = [process.env.FRONTEND_URL];

        // Permite llamadas sin Origin cuando se ejecuta con la opcion --api
        if(process.argv[2] === '--api'){
            whiteList.push(undefined);
        }

        if(whiteList.includes(origin)){
            callback(null, true);

        }else{
            callback(new Error('Error de CORS'))
        }
    }
}