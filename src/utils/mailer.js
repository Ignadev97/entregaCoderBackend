import nodemailer from "nodemailer"

const trasnporter=nodemailer.createTransport(
    {
        service:"gmail", 
        port:"587",
        auth:{
            user:"ignacio.tello.dev@gmail.com",
            pass: "unmo hhna iygg phtr"
        }
    }
)

export const enviarMail=async(to, subject, message)=>{
    return await trasnporter.sendMail(
        {
            from:"App Coderhouse ignacio.tello.dev@gmail.com",
            to, subject, 
            html: message
        }
    )
}