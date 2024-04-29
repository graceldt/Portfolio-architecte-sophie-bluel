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


function createButton(works){
    const menu_category = document.querySelector('.menu-categories-list')
    const categories = new Set() // init categories
    categories.add("Tous")
    let html = ''
    
    for (let index = 0; index < works.length; index++){
        const gallery = works[index] // get current work
        categories.add(gallery.category.name) // save categories
    }

    for(const category of categories) {
        html += `<li class='category'>${category}</li>`
    }

    menu_category.innerHTML = html
}





GetWorks().then(works => {
    createWork(works)
    createButton(works)

    console.log(works)
    const category_list = document.querySelector('.menu-categories-list')
    category_list.addEventListener( "click", function(event){
        createWork(works, event.target.textContent)
    })
})