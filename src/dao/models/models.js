import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"
import config from "../../config/config.js"

let adminId = new mongoose.Types.ObjectId(config.ADMIN_ID)

const productColl = "products"
const cartsColl = "carts"
const messagesColl = "messages"
const userColl = 'users'
const compraColl = 'compras'


const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String, 
        price: Number, 
        code: {
            type: Number, 
            required: true,
            unique: true
        },
        stock: String,
        quantity: Number,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref:userColl,
            default: adminId
        }
    },
    {
        timestamps: true
    }
)

productSchema.plugin(paginate);

const cartsSchema = new mongoose.Schema(
    {
      products: {type:[
        {
            product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: productColl},
            quantity: Number
        }
      ]}
    },
    {
        timestamps: true
    }
)
const messagesSchema = new mongoose.Schema(
    {
        email: String, 
        user: String, 
        message: String
    },
    {
        timestamps: true
    }
)

const usuarioSchema = new mongoose.Schema (
    {
        first_name: String, 
        last_name: String, 
        email: {
            type: String, unique: true
        },
        password: String,
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref:cartsColl
        },
        role: {
            type:String, 
            default: 'user',
            enum:['user', 'premium', 'admin']
        }
    },
    {
        timestamps: true, strict: false
    }
)

const compraSchema = new mongoose.Schema (
    {
        carritoId: {
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        userId: {
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        productos: [
            {
                product: mongoose.Schema.Types.ObjectId,
                cantidad: Number
            }
        ],
        total: {
            type: Number,
            required:true
        }
    }
)




export const modeloProducts = mongoose.model(productColl, productSchema)
export const modeloCarts = mongoose.model(cartsColl, cartsSchema)
export const modeloMessages = mongoose.model(messagesColl, messagesSchema)
export const modeloUsers = mongoose.model(userColl, usuarioSchema)
export const modeloCompra = mongoose.model(compraColl, compraSchema)