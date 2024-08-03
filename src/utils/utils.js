import {fileURLToPath} from 'url'
import {dirname} from 'path'
import bcrypt from 'bcrypt'
import winston from 'winston'

// funcion para limpiar carrito 

export let limpiarCarrito = async ( carrito ) => {
    carrito.products.splice(0, carrito.products.length);

      await carrito.save();
}

//config dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//hasheo password
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)


//passport
export const passportCall = (estrategia) => {
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err) }
            if (!user) {
                res.setHeader('Content-Type','application/json');
                return res.status(401).json({
                    error:info.message?info.message:info.toString(),
                    detalle:info.detalle?info.detalle:"-",

                })
            }
            req.user=user
            next()
        })(req, res, next);
    }
}

//winston
export const logger = winston.createLogger(
    {
        transports:[
            new winston.transports.Console(
                {
                    level: "info",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }
            ),
            new winston.transports.Console(
                {
                    level: "silly",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.colorize(),
                        winston.format.prettyPrint()
                    )
                }
            ),
            new winston.transports.File(
                {
                    level: "warn",
                    filename: "./src/logs/error.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        // winston.format.colorize(),
                        winston.format.prettyPrint()
                    )
                }
            ) 
        ]
    }
)

export const midLog = ( req,res, next ) => {

    req.logger = logger

    next()
}



export default __dirname;