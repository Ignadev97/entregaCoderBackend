let btnSubmit=document.getElementById("submit")
let inputEmail=document.getElementById("email")
let inputPassword=document.getElementById("password")
let inputNombre = document.getElementById("nombre")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()

    let body={
        nombre: inputNombre.value,
        email:inputEmail.value,
        password:inputPassword.value
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