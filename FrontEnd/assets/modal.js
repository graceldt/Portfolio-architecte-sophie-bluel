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

function workToEdit(work, gallery_div){
    const imgContainer = document.createElement('div')
        gallery_div.appendChild(imgContainer)
        imgContainer.className='image_container'

        //img 
        const imgEdit = document.createElement('img')
        imgContainer.appendChild(imgEdit)
        imgEdit.className='image_to_edit'
        imgEdit.src=work.imageUrl

        //delete 
        const deleteContent = document.createElement('div')
        imgContainer.appendChild(deleteContent)
        deleteContent.className='icon_delete_image'

        // trash icon
        const trashIcon = document.createElement('i')
        deleteContent.appendChild(trashIcon)
        trashIcon.className='fa-regular fa-trash-can'
        trashIcon.setAttribute('data-id', work.id )
        trashIcon.setAttribute('data-name', work.title )

        deleteContent.addEventListener('click', ()=> {
            if(confirm(`L'élement "${work.title}" va être définitivement supprimé`)){
                fetch("http://localhost:5678/api/works/"+ work.id, {
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
}


function GalleryToEdit(works){
    const gallery_div = document.querySelector(".edit-list-image")
    gallery_div.innerHTML = ''

    for (let index = 0; index < works.length; index++){
        const gallery = works[index] // get current work
        workToEdit(gallery, gallery_div)
    }
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
    const form_error = document.querySelector(".login_error")

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
            throw new Error(response.status);
        } 
                
        return response.json()
    }).then((data) => {
        console.log(data)
        const gallery_div = document.querySelector(".gallery")
        CreateFigure(gallery_div, data)

        const gallery_list = document.querySelector(".edit-list-image")
        workToEdit(data, gallery_list)

        form_validation.classList.remove("hidden")
        form_error.classList.add("hidden")
    })
    .catch((error)=> {
        console.log(error)
        if (error === 401) {
            alert("vous n'êtes plus connecté")
        } else {
            form_error.classList.remove("hidden")
            form_validation.classList.add("hidden")
        }
        
    })
    
})
}

function FormValidation(){
    const formAddPicture = document.querySelector('.valid_button')
    const title_picture = document.getElementById("picture_title")
    const select_category_list = document.getElementById("category_option")

    const checkForm = () => {
        if (title_picture.value != "" && select_category_list.value !="" && inputPicture.files.length != 0){
            formAddPicture.style.backgroundColor="#1D6154";
        }
        else {
            formAddPicture.style.backgroundColor="#B3B3B3";
        }
    }
    
    title_picture.addEventListener('keyup', () => {
        checkForm()
    })
    select_category_list.addEventListener('change', () => {
        checkForm()
    })
    inputPicture.addEventListener('change', () => {
        checkForm()
    })
}

manage_modal()
validForm()
FormValidation()
