import { logger } from '../utils/utils.js';
import { ERRORES } from '../utils/errores.js';

export const handleError = (error, req, res, next) => {
    // Loguear el error usando Winston
    logger.error(`${error.cause ? error.cause : error.stack}`);

    // Manejo específico de diferentes tipos de errores
    switch (error.code) {
        case ERRORES["ARGUMENTOS INVALIDOS"]:
            res.setHeader('Content-Type', 'application/json');
            return res.status(ERRORES["ARGUMENTOS INVALIDOS"]).json({ error: `${error.name}`, detalle: error.message });

        case ERRORES["NOT FOUND"]:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: "Recurso no encontrado" });

        default:
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            });
    }
};
