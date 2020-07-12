    const currentPage = location.pathname
    const menuItems = document.querySelectorAll(".links a")

    for(item of menuItems){
        if(currentPage.includes(item.getAttribute("href"))){
            item.classList.add("active")
        }
    }

    function paginate(selectedPage, totalPages){

        let pages = []

        let oldPage

        for(let currentPage = 1; currentPage <= totalPages; currentPage++){

            const firstAndLastPage = currentPage == 1 || currentPage == totalPages 
            const pagesAfterSelected = currentPage <= selectedPage + 2
            const pagesBeforeSelected =  currentPage >= selectedPage-2

            if( firstAndLastPage ||  pagesAfterSelected && pagesBeforeSelected){

                if(oldPage && currentPage - oldPage > 2){
                    pages.push("...")
                    
                }
                if(oldPage && currentPage - oldPage == 2){
                    pages.push(oldPage + 1)
                    
                }
                pages.push(currentPage)

                oldPage = currentPage
            }

            
        }
        return pages
    }



    function createPagination(pagination){

        const filter = pagination.dataset.filter
        const page = +pagination.dataset.page
        const total = +pagination.dataset.total
        const pages = paginate(page, total)

        let elements = ""

        for (let page of pages){
            if(String(page).includes("...")){
                elements += '<p>...</p>'
            }else{
                if(filter){
                    elements  +=`<a href="?page=${page}&filter=${filter}">${page}</a>`
                    
                }else{
                    elements  +=`<a href="?page=${page}">${page}</a>`
                }
            }
        }
        pagination.innerHTML = elements
    }

    const pagination = document.querySelector(".pagination")


    if(pagination){
    createPagination(pagination)
    }