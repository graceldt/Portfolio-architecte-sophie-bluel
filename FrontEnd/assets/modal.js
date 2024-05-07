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




manage_modal()