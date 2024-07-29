let inputEmail = document.getElementById("email");
let btnSubmit = document.getElementById("submit");

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  let body = {
    email: inputEmail.value,
  };

  try {
    let resultado = await fetch("/api/sessions/recupero01", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (resultado.redirected) {
      window.location.href = resultado.url;
    } else {
      alert("Ocurrió un error");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al enviar la solicitud.");
  }
});
