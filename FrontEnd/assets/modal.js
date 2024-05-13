function manage_modal(){
    const modal = document.getElementById("mymodal")
    const modal_header = document.querySelector(".modal_header")
    const open = document.getElementById("modify_button")
    const close = document.getElementById("close-modal")
    const preview = document.getElementById("modal-preview")
    const add_picture_btn = document.getElementById("add-picture")
    const list_gallery_page = document.getElementById("list-gallery-page")
    const add_gallery_page = document.getElementById("add-gallery-page")

    add_picture_btn.addEventListener("click", function(event){
        event.preventDefault()
        preview.classList.remove('hidden')
        modal_header.setAttribute("style", "justify-content:space-between")
        list_gallery_page.classList.add('hidden')
        add_gallery_page.classList.remove('hidden')
    })

    open.addEventListener("click", function(event){
        event.preventDefault()
        modal.setAttribute("style","display:flex");
    })

    close.addEventListener("click", function(event){
        event.preventDefault()
        modal.setAttribute("style","display:none");
    })

    window.addEventListener("click", function(event){
        if (event.target === modal){
            modal.setAttribute("style","display:none");
        }
    })

    preview.addEventListener("click", function(event){
        event.preventDefault()
        list_gallery_page.classList.remove('hidden')
        add_gallery_page.classList.add('hidden')
        preview.classList.add('hidden')
        modal_header.setAttribute("style", "justify-content:flex-end")
    })
}

function listGalleryToEdit(works){
    const gallery_div = document.querySelector(".edit-list-image")
    let html = ''
    works.forEach(work => {
        html += `<div class="image_container">
                    <img class="image_to_edit" src="${work.imageUrl}"/>
                    <div class="icon_delete_image" data-id="${work.id}" data-name="${work.title}">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>`
    });
    gallery_div.innerHTML = html

    const listTrash = document.querySelectorAll('.icon_delete_image')

    listTrash.forEach(tr => {
        const idWork = tr.getAttribute('data-id')
        const titleWork = tr.getAttribute('data-name')

        tr.addEventListener('click', ()=>{
            if(confirm(`L'élement "${titleWork}" va être définitivement supprimé`)){
                fetch("http://localhost:5678/api/works/"+ idWork, {
                    method : "DELETE",
                    headers : {
                    "Content-type": "application/json",
                    "accept": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem("user")
                    },
                    
                })
                .then((response)=> {
                    if ([401, 500].includes(response.status)) {
                        throw new Error(response.status);
                    }
                    displayWorks()
                })
            }
        })
        
    })
}

function createOption(categories){
    const select_category_list = document.getElementById("category_option")

    const select_option = document.createElement('option')
    select_option.innerHTML = ""
    select_category_list.appendChild(select_option)

    categories.forEach(category =>{
        const select_option = document.createElement('option')
        select_option.value = category.id
        select_option.innerHTML = category.name

        select_category_list.appendChild(select_option)
    })
}

const inputPicture = document.getElementById('images')

inputPicture.addEventListener("change", () => {
    const img_container = document.querySelector('.img_container')
    const new_picture = document.querySelector('.new_picture')
    const file = inputPicture.files[0]
    if (!file)return

    // Generate img preview 

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ()=> {
        new_picture.src = reader.result
        img_container.classList.add('hidden')
        new_picture.classList.remove('hidden')
        }
    })



function validForm (){
const formAddPicture = document.querySelector('.valid_button')
formAddPicture.addEventListener("click", () =>{

    const picture = document.querySelector('.new_picture')
    const image = picture.src
    const title_picture = document.getElementById("picture_title")
    const title = title_picture.value
    const category_work = document.getElementById("category_option")
    const category = category_work.value
    const form_validation = document.querySelector(".form_validation")

    console.log(title, ' ', category, ' ', image)

    const formData  = new FormData();
    formData.append("title", title)
    formData.append("category", category)
    formData.append("image", inputPicture.files[0])

    fetch("http://localhost:5678/api/works", {
        method : "POST",
        headers : {
                    "accept": "application/json",
                    //"Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + sessionStorage.getItem("user")
                    },
        body : formData
    })
    .then((response) => {
        if ([400, 401, 500].includes(response.status)) {
            const form_error = document.querySelector(".login_error")
            form_error.classList.remove("hidden")
            throw new Error(response.status);
        } else {
                form_validation.classList.remove("hidden")
        }
        return response.json()
    }).catch((error)=> {
        console.log(error)
    })

})
}




manage_modal()
validForm ()