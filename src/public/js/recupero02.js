let password = document.getElementById('contraseña1')
let passwordVerificado = document.getElementById('contraseña2')
let inputToken = document.getElementById('token').value
let btnSubmit = document.getElementById('submit')

let querystring = window.location.search 

const params = new URLSearchParams(querystring)

const token = params.get('token')


btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault()

    if (password.value !== passwordVerificado.value) {
        alert('Las contraseñas no coinciden');
        return;
    }

    let body = {
        password:password.value,
        passwordVerificado:passwordVerificado.value,
        token:token
    }


    try {
        let resultado = await fetch("/api/sessions/recupero03", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        console.log(resultado)


        if (resultado.status == 200){
            alert('la contraseña se reestableció correctamente, será redireccionado a la página de login')
        } else {
            const error = await resultado.json();
            alert('Error: ocurrió un error al actualizar la contraseña');
        }

      } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al enviar la solicitud.");
      }
})