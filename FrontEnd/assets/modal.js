function show_list_gallery() {
    const preview = document.getElementById("modal-preview")
    const modal_header = document.querySelector(".modal_header")
    const list_gallery_page = document.getElementById("list-gallery-page")
    const add_gallery_page = document.getElementById("add-gallery-page")

    list_gallery_page.classList.remove('hidden')
    add_gallery_page.classList.add('hidden')
    preview.classList.add('hidden')
    modal_header.setAttribute("style", "justify-content:flex-end")
}

function manage_modal(){
    /*
        Cette fonction permet l'affichage de la vue ajout photo 
        de la modale lors du clique sur le bouton ajouter photo et
        cacher la vue galerie photo.
        Elle permet également d'ouvrir, fermer la modale en cliquant 
        sur la croix et en dehors de la modale également 
        retourner sur la vue précédente lors du clic.
    */
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
        list_gallery_page.classList.remove('hidden')
        add_gallery_page.classList.add('hidden')
        preview.classList.add('hidden')
        modal_header.setAttribute("style", "justify-content:flex-end")
    })
}

function workGallery(work, gallery_div){
    /*
    Cette fonction permet de créer un élément de la galerie photo de la modale 
    et de pouvoir supprimer les travaux du portfolio lors du clic sur le bouton corbeille.
     */
    const imgContainer = document.createElement('div')
    gallery_div.appendChild(imgContainer)
    imgContainer.className='image_container'

    //image 
    const imgEdit = document.createElement('img')
    imgContainer.appendChild(imgEdit)
    imgEdit.className='image_to_edit'
    imgEdit.src=work.imageUrl

    //supprimer 
    const deleteContent = document.createElement('div')
    imgContainer.appendChild(deleteContent)
    deleteContent.className='icon_delete_image'

    // icone corbeille 
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
                display_works()
            })
        }
    })
}


function modal_gallery(works){
    /*
    Cette fonction permet d'afficher l'ensemble de la liste des images
    de la galerie photo de la modale 
    */
    const gallery_div = document.querySelector(".edit-list-image")
    gallery_div.innerHTML = ''

    for (let index = 0; index < works.length; index++){
        const gallery = works[index]
        workGallery(gallery, gallery_div)
    }
}

function create_form_option(categories){
    /*
    Cette fonction permet d'ajouter dans le formulaire d'ajout photo, 
    les options de catégories 
     */
    const select_category_list = document.getElementById("category_option")
    select_category_list.innerHTML = ""
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

function add_picture() {
    // ajout de l'image dans le formulaire 
    inputPicture.addEventListener("change", () => {
    const img_container = document.querySelector('.img_container')
    const new_picture = document.querySelector('.new_picture')
    const file = inputPicture.files[0]
    if (!file)return

    // aperçu de l'image 

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ()=> {
        new_picture.src = reader.result
        img_container.classList.add('hidden')
        new_picture.classList.remove('hidden')
        }
    })
}




function validForm (){
    /*
    Cette fonction permet l'ajout d'un nouveau projet dans 
    le portfolio et dans la liste des images de la modale 
    lors de la validation du formulaire d'ajout photo 
     */
    const formAddPicture = document.querySelector('.valid_button')
    formAddPicture.addEventListener("click", () =>{
        const title_picture = document.getElementById("picture_title")
        const title = title_picture.value
        const category_work = document.getElementById("category_option")
        const category = category_work.value
        const form_error = document.querySelector(".login_error")

        const formData  = new FormData();
        formData.append("title", title)
        formData.append("category", category)
        formData.append("image", inputPicture.files[0])

        fetch("http://localhost:5678/api/works", {
            method : "POST",
            headers : {
                "accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("user")
            },
            body: formData
        }).then((response) => {
            if ([400, 401, 500].includes(response.status)) {
                throw new Error(response.status);
            }
            return response.json()
        }).then((data) => {
            const gallery_div = document.querySelector(".gallery")
            create_figure(gallery_div, data)

            const gallery_list = document.querySelector(".edit-list-image")
            workGallery(data, gallery_list)
            
            form_error.classList.add("hidden")
            
            // réinitialisation du formulaire 
            document.querySelector(".form_add_picture").reset();
            const new_picture = document.querySelector('.new_picture')
            new_picture.src = ''
            new_picture.classList.add("hidden")
            show_list_gallery()

        }).catch((error)=> {
            form_error.classList.remove("hidden")
        })
    })
}

function Validbutton(){
    /*
    Cette fonction permet le changement de la couleur du bouton de validation
    du formulaire lorsque l'ensemble des champs ont bien été complétés
     */
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

add_picture()
manage_modal()
validForm()
Validbutton()
