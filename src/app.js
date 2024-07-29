import express from 'express'
//import de routers
import cartRouter from './routes/cartRouter.js'
import viewRouter from './routes/viewRouter.js'
import productMongoRouter from './routes/productRouter.js'
import authRouter from './routes/authRouter.js'
//utilidades
import __dirname from './utils/utils.js'
import path, { dirname } from 'path'
//handlebars
import handlebars from 'express-handlebars'
//webSocket
import {Server} from 'socket.io'
//mongoose
import mongoose from 'mongoose'
//passport
import inicializaPassport from './config/passport.config.js'
import passport from 'passport'
//cockieParser
import cookieParser from 'cookie-parser'
//config
import config from './config/config.js'
//winston
import { logger } from './utils/utils.js'
import { midLog } from './utils/utils.js'
import { handleError } from './middlewares/handlerError.js'
//swagger
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'




const PORT = config.PORT

//app.use() -> método de express para montar middleware

const app = express()

app.use(express.json()) //middleware para analizar los JSON entrantes

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "../views"))

app.use(express.static(path.join(__dirname, '../public')))  //middleware para servir archivos estáticos  


// meanejador de errores a nivel aplicación. 
app.use(handleError)

app.get('/', (req, res) => {
    res.status(200).render("inicio")
    })
    
//winston
app.use(midLog)
    
//passport 
inicializaPassport()
app.use(passport.initialize())
//cookie parser
app.use(cookieParser(config.SECRET))
//swagger 
const options = {
    definition:{
        openapi:'3.0.0',
        info:{
            title: 'E-commerce Coder',
            version:'1.0.0', 
            description:'configuracion de swagger en aplicacion de backend de curso coder.'
        }
    },
    apis: ["./src/docs/*.yaml"]
}

const spec = swaggerJsdoc(options)


//routers
app.use('/api/cart', cartRouter)
app.use('/api/products', productMongoRouter)
app.use('/api/sessions', authRouter)
app.use('/', viewRouter)

//sgaggerui
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))


const server = app.listen(PORT, () => {
    logger.info(`app corriendo en puerto ${PORT}`)
})


//ESTO ME INCOMODA ACÁ. 

let mensajes=[]
let usuarios=[]

const io=new Server(server)   // websocket server

io.on("connection", socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)
    
    socket.on("presentacion", nombre=>{
        usuarios.push({id:socket.id, nombre})
        socket.emit("historial", mensajes)
        // console.log(nombre)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", (nombre, mensaje)=>{
        mensajes.push({nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            socket.broadcast.emit("saleUsuario", usuario.nombre)
        }
    })

})




const connect = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME} )
        logger.info('Base de datos conectada!')
    } catch (err) {
        logger.error(`Falló la conexión a base de datos. Detalle: ${error.message}`)
    }
}
connect();

//manejo global de rechazos de promesas no manejadas. 
process.on('unhandledRejection', (error) => {
    logger.error(`Promesa no manejada: ${error.message}`, { stack: error.stack });
});

// Manejo global de excepciones no capturadas. 
process.on('uncaughtException', (error) => {
    logger.error(`excepción no manejada: ${error.message}`, { stack: error.stack });
});
 
