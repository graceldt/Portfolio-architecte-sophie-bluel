async function GetWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

function createWork(works, work_filter="Tous") {
    /*
        This function allows to create dynamic gallery
    */
    const gallery_div = document.querySelector(".gallery")
    gallery_div.innerHTML = ''

    if (work_filter !== "Tous") {
        works = works.filter(function (work) {
            return work.category.name === work_filter
        });
    }

    // for each works
    for (let index = 0; index < works.length; index++){
        const gallery = works[index] // get current work

        // create figure and add to the gallery parent item
        const figure_img = document.createElement('figure') 
        gallery_div.appendChild(figure_img)

        // add img to figure parent item
        const imageElement = document.createElement('img')
        figure_img.appendChild(imageElement)
        imageElement.src = gallery.imageUrl
        
        // add title to the figure parent item
        const captionElement = document.createElement('figcaption')
        captionElement.innerText = gallery.title
        figure_img.appendChild(captionElement)
    }
}

async function GetCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}

function createButton(categories){
    const menu_category = document.querySelector('.menu-categories-list')
    let html = `<li class="category category_active">Tous</li>`
    
    for (let index = 0; index < categories.length; index++){
        const category = categories[index]
        html += `<li class="category">${category.name}</li>`
    }

    menu_category.innerHTML = html
}


function listGalleryToEdit(works){
    const gallery_div = document.querySelector(".edit-list-image")
    let html = ''
    works.forEach(work => {
        html += `<div class="image_container">
                    <img class="image_to_edit" src="${work.imageUrl}" id="${work.id}"/>
                    <div class="icon_delete_image"><i class="fa-regular fa-trash-can"></i></div>
                </div>`
    });
    gallery_div.innerHTML = html
}

GetWorks().then(works => {
    createWork(works)
    const category_list = document.querySelector('.menu-categories-list')
    
    category_list.addEventListener("click", function(event){
        
        let current_li = event.target.closest("li")
        if (current_li === null) return;

        let element_select = document.querySelector('.menu-categories-list .category_active');
        element_select.className=""
        current_li.className = "category_active"
        
        createWork(works, event.target.textContent)
    })

    listGalleryToEdit(works)
})

GetCategories().then(categories => {
    createButton(categories)
})


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

manage_modal()

