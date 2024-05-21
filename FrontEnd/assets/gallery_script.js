const displayWorks = () =>{
    /*
        Cette fonction permet de récupérer les travaux depuis le back-end, 
        créer la galerie dynamique, rajouter au menu-categories-list un 
        évènement au click afin de filtrer la galerie
    */


    fetch("http://localhost:5678/api/works")
    .then((response) => {
        return response.json()
    })
    .then(works => {
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
    
        GalleryToEdit(works) // Fonction de la modale galerie photo 
    })
}


function createWork(works, work_filter="Tous") {
    /*
        Cette fonction permet de créer une galerie dynamique et 
        de filter l'affichage selon la catégorie du projet 
    */
    const gallery_div = document.querySelector(".gallery")
    gallery_div.innerHTML = ''

    if (work_filter !== "Tous") {
        works = works.filter(function (work) {
            return work.category.name === work_filter
        });
    }

    // cette boucle permet d'afficher les travaux selon leur catégorie 
    for (let index = 0; index < works.length; index++){
        const gallery = works[index] 
        CreateFigure(gallery_div, gallery)
    }
}

function CreateFigure(gallery_div, gallery){
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

const displayCategories = () =>{
    /*
        Cette fonction permet de récupérer les catégories des 
        travaux depuis le back end, créer les boutons et les options 
    */
    fetch("http://localhost:5678/api/categories")
    .then((response) => { 
        return response.json()
    })
    .then(categories => {
        createButton(categories)
        createOption(categories) // Fonction de la modale ajout photo 
    })
}

function createButton(categories){
    /*
        Cette fonction rajoute au menu-categories-list la liste des catégories
    */
    const menu_category = document.querySelector('.menu-categories-list')
    let html = `<li class="category category_active">Tous</li>`
    
    for (let index = 0; index < categories.length; index++){
        const category = categories[index]
        html += `<li class="category">${category.name}</li>`
    }

    menu_category.innerHTML = html
}


displayWorks()
displayCategories()

