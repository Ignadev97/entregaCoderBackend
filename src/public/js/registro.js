let btnSubmit=document.getElementById("submit")
let inputEmail=document.getElementById("email")
let inputPassword=document.getElementById("password")
let inputNombre = document.getElementById("nombre")
let inputApellido = document.getElementById("apellido")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    
    let body={
        firstName: inputNombre.value,
        lastName: inputApellido.value,
        email:inputEmail.value,
        password:inputPassword.value,
        role:'user'
    }

    let resultado=await fetch("/api/sessions/registro",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    })
    let status=resultado.status
    let datos=await resultado.json()

    console.log(status, datos)
})