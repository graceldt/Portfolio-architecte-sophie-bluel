const form = document.querySelector('form')


form.addEventListener("submit", (Event) => {
    Event.preventDefault()
    const baliseEmail = document.getElementById("email")
    const email = baliseEmail.value
    const balisePassword = document.getElementById("password")
    const password = balisePassword.value

    fetch("http://localhost:5678/api/users/login", {
        //configuration objet 
        method : "POST",
        headers : {
            "Content-type": "application/json",
            "accept": "application/json",
        },
        body : JSON.stringify({
            "email": email,
            "password": password,
        }),
    })
    .then((response) => {
        if ([404, 401].includes(response.status)) {
            const login_error = document.querySelector(".login_error")
            login_error.classList.remove("hidden")
            throw new Error(response.status);
        }
        return response.json()
    })
    .then((data) => {
        sessionStorage.setItem("user", data.token)
        return window.location.href="index.html"
    }).catch((error) => {
        console.log(error)
    })
})





