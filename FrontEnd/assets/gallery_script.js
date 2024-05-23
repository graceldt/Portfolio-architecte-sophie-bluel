async function GetWorks() {
    //Cette fonction permet de récupérer  via l'api ,les travaux  sauvegarder dans le back-end.
    const reponse = await fetch("http://localhost:5678/api/works");
    return await reponse.json();
}

async function GetCategories() {
    //Cette fonction permet de récupérer  via l'api ,les catégories  sauvegarder dans le back-end.

    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}


function create_work(works) {
    /*
        Cette fonction permet de l'affichage de la galerie
    */
    const gallery_div = document.querySelector(".gallery")
    gallery_div.innerHTML = ''

    
    for (let index = 0; index < works.length; index++){
        const gallery = works[index] 
        create_figure(gallery_div, gallery)
    }
}

function create_figure(gallery_div, gallery){
    // création et ajout de la balise figure dans l'élément parent gallery
    const figure_img = document.createElement('figure') 
    gallery_div.appendChild(figure_img)

    //création de la balise img dans l'élément parent figure
    const imageElement = document.createElement('img')
    figure_img.appendChild(imageElement)
    imageElement.src = gallery.imageUrl
    
    //création de la légende dans l'élément parent figure 
    const captionElement = document.createElement('figcaption')
    captionElement.innerText = gallery.title
    figure_img.appendChild(captionElement)
}

function work_filter(works){
    /*
        Cette fonction permet le filtrage du portfolio selon les catégories des travaux.
    */
    const category_list = document.querySelectorAll('.menu-categories-list li')
    category_list.forEach((category) => {
        category.addEventListener("click", function(event){
            let new_works = works

            let element_select = document.querySelector('.menu-categories-list .category_active');
            element_select.className=""
            category.className = "category_active"
            
            if (event.target.textContent !== "Tous") {
                new_works = works.filter(function (work) {
                    return work.category.name === event.target.textContent
                });
            }
            create_work(new_works)
        })
    })
}


function create_filter_buttons(categories){
    /*
        Cette fonction permet de créer la liste des boutons des catégories  
    */
    const menu_category = document.querySelector('.menu-categories-list')
    const li_tag = document.createElement('li')
    li_tag.className = "category category_active"
    li_tag.textContent = "Tous"
    menu_category.appendChild(li_tag)
    
    for (let index = 0; index < categories.length; index++){
        const category = categories[index]
        const li_tag = document.createElement('li')
        li_tag.className = "category"
        li_tag.textContent = category.name
        menu_category.appendChild(li_tag)
    }
}


const display_works = () => {
    /*
        Cette fonction d'iniatiliser la galerie photo, le système de filtre et la modale 
    */
    Promise.all([GetWorks(), GetCategories()])
    .then(([works, categories]) => {
        create_filter_buttons(categories) // creation categories
        create_form_option(categories) // remplissages des options dans la modale
    
        create_work(works) // affichage des travaux 
        modal_gallery(works) // affichage des travaux dans la modale 
        work_filter(works) // ajout d'une fonction de filtre
    })
    
}


display_works()
