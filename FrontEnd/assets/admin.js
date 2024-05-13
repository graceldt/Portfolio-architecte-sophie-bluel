function changeUserConnection() {
    const user = sessionStorage.getItem("user")
    const login = document.getElementById("login")
    const logout = document.getElementById("logout")
    const buttonModify = document.getElementById("modify_button")
    const categories = document.getElementById("categories")




    if (user !== null) {
        logout.classList.remove("hidden")
        login.classList.add("hidden")
        buttonModify.classList.remove('hidden')
        categories.classList.add('hidden')
    } else {
        logout.classList.add("hidden")
        login.classList.remove("hidden")
        buttonModify.classList.add('hidden')
        categories.classList.remove('hidden')
    }
}

function userLogOut() {
    const logout = document.getElementById("logout")
    logout.addEventListener("click", function (){
        sessionStorage.removeItem("user", null)
        changeUserConnection()
        return window.location.href="login_page.html"
    })
}

changeUserConnection()
userLogOut()