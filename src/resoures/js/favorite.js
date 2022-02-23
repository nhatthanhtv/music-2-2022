import storage from "./storage.js"


function favorite() {
    const listFavorite = storage.get()
    const item = []
    
    listFavorite.map((id, index) => {
        fetch(`api/getsonginfo?id=${id}`)
            .then(response => response.json())
            .then(data => {
                item.push(data.data)
                console.log();
                if(item.length === listFavorite.length){
                    renderList()
                }
            })
    })

    function renderList() {

        const htmlLike = `
            <div class="items__top__song">
                <div class="dashboard__content">
                    <h3 class="dashboard__title">
                        Danh sách yêu thích ♥️
                    </h3>
                    <p class="dashboard__show_playlist">Show on ></p>

                </div>
                <ul class="list__song">
                    ${item.map((item, index) =>`
                    <li class="item__song" id="${item.encodeId}">
                        <span class="item__song__number">${index + 1}
                        </span>
                        <i class="ri-volume-up-line music__play"></i>
                        <span class="item__song__name">${item.title}</span>
                        <span class="item__song__singer">${item.artistsNames}</span>
                    </li>
                    `).join('')}
                </ul>
            </div>
        
        `
        document.querySelector('.container__mobile').innerHTML = htmlLike
        
    }  
}


export default favorite