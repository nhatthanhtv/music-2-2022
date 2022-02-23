
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

import top100 from './top100.js'
import favorite from './favorite.js'
import storage from './storage.js'

const appMusic  = $('#app')
const btnMenu = $('.menu__mobile')
const overlaySidebar = $('.overlay__sidebar')
const listSongs = $('.list__song')
const namePlaySong = $('#name__play__song')
const audio = $('#source-mp3')
const titleApp = $('#title-app')
const controlCenter = $('.control__center')
const btnPlay = $('#play__app-music')
const timesong = $('#timesong')
const cdthumb = $('.song__info__img')
const songInfo = $('.song__info ') 
const volume = $('#voulume') 
const inputSearchSong = $('#search-song') 
const btnSearch = $('.ri-search-line') 
const itemSearch = $('.item__search') 
const itemSearchList = $('.item__search__list') 
const musicPlaylist = $('#music-playlist') 
const nextBtn = $('.ri-speed-fill') 
const prevBtn = $('.ri-rewind-fill') 
const banner = $('.app__banner') 
const suggest = $('.suggest') 
const navbar = $('.navbar')
const heart = $('.ri-heart-fill')
const boxHeart = $('.add__list__album')
const containerApp = $('.container__app')
// songInfo.style.display = 'none'




const app = {

    songs: [],
    currentIndex: 0,
    isSongPlay: false,
    isFavorite: false,
    listRenderLike: [],
    listFavailable: storage.get(),

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    getListTop100(){
        fetch('api/gettop100')
            .then(response => response.json())
            .then(data => {
                this.renderTop100(data.data[0])
            })
    },


    renderTop100(data){
        const output = data.items.map((item, index) => {
        return `
            <div class="suggest__content" id='${item.encodeId}'>
                <div class="suggest__content__photo">

                    <img src="${item.thumbnailM}"
                        alt="" class="suggest-photo-img">
                </div>
                <div class="suggest__content__p">

                    <div class="suggest__data">
                        <h3 class="suggest__data__title">${item.title}</h3>
                        <span class="suggerst__drs">
                           ${item.artistsNames}
                        </span>
                    </div>
                </div>
            </div>
            `
            
        })
        $('.suggest').innerHTML = output.join('')
        

    },
// get list nhạc home
    getSongsListTopic(id = 'ZWZB969E'){
        fetch(`api/getinfoplaylist?idlist=${id}`)
            .then(response => response.json())
            .then(data => {
                this.songs = data.data.song.items
                this.renderItemSong()
            })
          

    },

    renderItemSong(){
        const output = this.songs.map((song, index) => {

            return `
            
                <li class="item__song ${index == this.currentIndex ? 'playing' : ''}"
                index="${index}" id-song="${song.encodeId}">
                    <span class="item__song__number">${index + 1}
                    </span>
                    <i class="ri-volume-up-line music__play"></i>
                    ${index == this.currentIndex ? `<marquee>${song.title}</marquee>`: `<span class="item__song__name">${song.title}</span>`}
                    <span class="item__song__singer">${song.artistsNames}</span>
                </li>
            `
        })
        listSongs.innerHTML = output.join('')
        this.loadSong()
    },
    getHome(){
        fetch('api/gethome')
            .then(response => response.json())
            .then(items => {
                this.loadHome(items)
            })
    },

    loadHome(data){
        // load sugget
        $('.trending__title-1').innerText = data.data.items[3].title
        const output = data.data.items[3].items.map((item, index) => {

               return `
            <div class="col c-6 l-4 m-3">
                <div class="top__item" id-listtop=${item.encodeId}>
                    <img src="${item.thumbnailM}"
                        alt="">
                    <h3 class="top__item__title">${item.title}</h3>
                    <span class="top__item__singer">${item.artistsNames}</span>
                </div>
            </div>
            
            `
        })
        musicPlaylist.innerHTML = output.join('')
       
        const banner = data.data.items[0].items.map((item, index) =>{
            return `
            <div class="swiper-slide" >
                <div  class="app__banner__link" id-song=${item.encodeId}>
                    <img src="${item.banner}" alt="">
                </div>
            </div>
            `
        })
        $('.swiper-wrapper').innerHTML = banner.join(' ')
    },
    handleEvent(){
        const _this = this

        const cdThumbAnimate = cdthumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        btnPlay.onclick = function () {
            if (_this.isSongPlay) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onplay = function () {
            cdThumbAnimate.play();
            _this.isSongPlay = true;
            controlCenter.classList.add("playing");

        };
        audio.onpause = function () {
            cdThumbAnimate.pause();
            _this.isSongPlay = false;
            controlCenter.classList.remove("playing");

        };
        nextBtn.onclick = function () {
            let value = $('.navbar__item.active').querySelector('span').textContent
            audio.pause()
            _this.nextSong()
            switch (value) {
                case 'Trang chủ':
                    _this.renderItemSong()
                    break;

                case 'Danh sách yêu thích':
                    _this.renderListLike()
                   

            }
            _this.scrollToActiveSong()
            setTimeout(() => _this.loadSong(true), 1500)
        }
        prevBtn.onclick = function () {
            audio.pause()
            _this.prevSong()
            let value = $('.navbar__item.active').querySelector('span').textContent
               switch (value) {
                case 'Trang chủ':
                    _this.renderItemSong()
                    break;

                case 'Danh sách yêu thích':
                    _this.renderListLike()
                   

            }
            setTimeout(() => _this.loadSong(true), 1500)
            _this.scrollToActiveSong()
        }
        audio.onended =  function () {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
            
        }

        audio.ontimeupdate = function () {
            const degSong = audio.currentTime / audio.duration *100
            if(audio.currentTime){
                timesong.value = degSong
                 $('.time__end').innerText = _this.convertHMS(audio.duration)
                $('.time__start').innerText = _this.convertHMS(audio.currentTime)
            }
        }
        timesong.oninput = function(e){
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        }
        musicPlaylist.onclick = function (e) {
            console.log('item songlist');
            audio.pause()
            _this.currentIndex = 0
            timesong.value = 0
            let idList = e.target.closest('.top__item').getAttribute('id-listtop')
            _this.getSongsListTopic(idList)
            _this.scrollToActiveSong()
            setTimeout(() => _this.loadSong(true), 1000)
        }

        containerApp.onclick = function (e) {
            let item = e.target.closest('.item__song')
           if(item){
            timesong.value = 0
              let index =  item.getAttribute('index')
              _this.currentIndex = Number(index)
              let value = $('.navbar__item.active').querySelector('span').textContent
               switch (value) {
                case 'Trang chủ':
                    _this.renderItemSong()
                    break;

                case 'Danh sách yêu thích':
                    _this.renderListLike()
                   

            }
            _this.scrollToActiveSong()
            setTimeout(() => _this.loadSong(true), 1500)
              _this.loadSong(true)
       }}
        btnSearch.onclick = function (e) {
            _this.searchSong(inputSearchSong.value)
            itemSearch.classList.add('active')

            
        }
        inputSearchSong.onkeyup = function (e){
           if( e.keyCode === 13){
               btnSearch.click()
           }
        }
        inputSearchSong.onblur = function(){
            // itemSearch.classList.remove('active')
            
        }
        itemSearchList.onclick = function (e){
            audio.pause()
            timesong.value = 0
            _this.currentIndex = 0;
            let element = e.target.closest('.item__search__item')
            if(element){
                if (element.getAttribute('song') == 0){
                    let idList = element.getAttribute('id-playlist')
                    _this.getSongsListTopic(idList)
                    
                }else{
                    let id = element.getAttribute('id')
                    _this.getOneSong(id)
                    
                }   

            }
            itemSearch.classList.remove('active')
        }
        volume.oninput = function(e){
            audio.volume = e.target.value/100
        }
        suggest.onclick = function(e){
            audio.pause()
            timesong.value = 0
            let id = e.target.closest('.suggest__content').getAttribute('id')
            _this.currentIndex = 0
            _this.getSongsListTopic(id)
            _this.scrollToActiveSong()
            setTimeout(() => _this.loadSong(true), 1000)

        }
        banner.onclick = function (e) {
            let item = e.target.closest('.app__banner__link')
            if (item) {
                let id =item.getAttribute('id-song')
                _this.getOneSong(id)
                _this.scrollToActiveSong()
                setTimeout(() => _this.loadSong(true), 1000)
            }


        }
        // xử lí thêm bài hát yêu thích
        boxHeart.onclick =  function(e) {
            if(_this.isFavorite){
                $('.ri-heart-fill.red').classList.remove('red')
                _this.isFavorite = false
                _this.deleteSongFavorite()
               
                
            }else{
                $('.ri-heart-fill').classList.add('red')

                _this.isFavorite = true
                _this.addSongFavorite()
                
            }
        }


      
        navbar.onclick = function (e) {
            let item = e.target.closest('.navbar__item ')
            if(item){
                let value = item.querySelector('span').innerText.trim()
                switch(value){
                    case 'Top 100':
                        top100()
                        break;
                    case 'Danh sách yêu thích':
                        $('.navbar__item.active').classList.remove('active')
                        item.classList.add('active')
                        _this.favorite()
                        _this.scrollToActiveSong()
                        $('.sidebar.active').classList.remove('active')
                        
                        break;
                }
            }
        }
        $('.overlay__sidebar').onclick = function() {
            $('.sidebar.active').classList.remove('active')

        }
        btnMenu.onclick = function() {
            $('.sidebar').classList.add('active')
        }
        


    },

     favorite() { 
        const item = []
        const _this = this
        
        storage.get().map((id, index) => {
            fetch(`api/getsonginfo?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    _this.listRenderLike.push(data.data)
                    if(_this.listRenderLike.length === this.listFavailable.length){
                        this.songs = _this.listRenderLike
                        _this.renderListLike()
                    }
                })
        })
    },
   
    
    renderListLike() {
            const htmlLike = `
                <div class="items__top__song">
                    <div class="dashboard__content">
                        <h3 class="dashboard__title">
                            Danh sách yêu thích ♥️
                        </h3>
                        <p class="dashboard__show_playlist">Show on ></p>
    
                    </div>
                    <ul class="list__song">
                    </ul>
                </div>
            
            `
            document.querySelector('.container__mobile').innerHTML = htmlLike
            this.renderItemSong()
            this.renderItemLike()
        } ,
    renderItemLike(){
        const a = this.listRenderLike.map((item, index) => 
        `
        <li class="item__song ${index == this.currentIndex ? 'playing' : ''}" id-song="${item.encodeId}" index=${index}>
            <span class="item__song__number">${index + 1}
            </span>
            <i class="ri-volume-up-line music__play"></i>
            <span class="item__song__name">${item.title}</span>
            <span class="item__song__singer">${item.artistsNames}</span>
        </li>
        `
        )
        document.querySelector('.list__song').innerHTML = a.join('')

    },

    deleteSongFavorite(){
        let itemFavorite = this.currentSong.encodeId
        const list = this.listFavailable.find((id, index) => {
            if(id === itemFavorite){
            this.listFavailable.splice(index, 1)
            storage.set(this.listFavailable)
        }})
      
    },
    addSongFavorite() {
        let itemFavorite = this.currentSong.encodeId
           const isLike = this.listFavailable.find((item) =>item.includes(itemFavorite))
           if(isLike){
           }else{
            this.listFavailable.push(itemFavorite)
            storage.set(this.listFavailable)
           }
        
    },
    getOneSong(id){
        fetch(`api/getsonginfo?id=${id}`)
            .then(response => response.json())
            .then(item => {
                this.songs.unshift(item.data)
                this.renderItemSong()
                this.loadSong(true)
               
            })
    },

    convertHMS(value) {
        let sec_num = parseInt(value, 10); // đổi giá trị sang number (đơn vị giây)
        let hours   = Math.floor(sec_num / 3600); // giờ
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60); //  phút
        let seconds = sec_num - (hours * 3600) - (minutes * 60); //  giây
        // thêm số 0 trước đơn vị nhỏ hơn 10
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds; // kết quả trả về HH : MM : SS
    },
    searchSong(value) {
        fetch(`api/searchsong?value=${value}`)
            .then(response => response.json())
            .then(data => {
                const playlist = data.data.playlists.map(item =>{
                    return `
                    <li class="item__search__item playlist__item" id-playlist="${item.encodeId}" song="0">
                        <div class="item__search__data">
                            <img src="${item.thumbnailM}"
                                alt="">
                            <div class="item__search__info">
                                <h3 class="item__search__title">${item.title}</h3>
                                <p class="item__search__title" style="color:red">${item.textType}</p>
                            </div>
                        </div>
                    </li>
                    `
                })
                const song = data.data.songs.map(item =>{
                    return `
                    <li class="item__search__item" id="${item.encodeId}" song="1">
                        <div class="item__search__data">
                            <img src="${item.thumbnailM}"
                                alt="">
                            <div class="item__search__info">
                                <h3 class="item__search__title">${item.title}</h3>
                                <p class="item__search__title">${item.artistsNames}</p>
                            </div>
                        </div>
                    </li>
                    `
                })
            
                const output = [ ...song,...playlist]
                
                itemSearchList.innerHTML = output.join('')

            })
    },  

    nextSong(){
        audio.pause()
        this.currentIndex++
        if(this.currentIndex == this.songs.length){
            this.currentIndex = 0;
        }
    },
    prevSong() {
        audio.pause()
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
    },
    scrollToActiveSong:function () {
        setTimeout(function () {
            $('.item__song.playing').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
        },500)
    },
    loadSong( play = false,id = this.songs[this.currentIndex].encodeId){
        timesong.value = 0
        // api info Song
        const info =  fetch(`api/getsonginfo?id=${id}`)
            .then(response => response.json())
            .then(song => song.data)
        const linkMp3 =  fetch(`api/getsong?id=${id}`)   
            .then(response => response.json())
            .then(data => data.data[128])

        Promise.all([info, linkMp3])
            .then(([data,...link]) => {
                // set src Mp3
                audio.src = link
                // set info
                $('.song__info__img').style.backgroundImage = `url(${data.thumbnailM})`
                $('.song__info__title').innerText = data.title
                $('.song__info__singer').innerText = data.artistsNames
                // set title
                $('#title-app').innerText = `${data.title} - ${data.artistsNames}`
                $('#favicon').href = data.thumbnailM

            })
            .then(() =>{
                let issFavorite = this.listFavailable.includes(this.currentSong.encodeId)
                const heart = `<i class="ri-heart-fill ${ issFavorite && 'red'}"></i>`
                $('.add__list__album').innerHTML = heart
                this.isFavorite = issFavorite
               
                if(play){
                    audio.play()
                }
            })
            
        
        // Điều kiện Play khi load
        




                
    },

    start(){
        this.getListTop100()
        this.defineProperties()
        this.getSongsListTopic()
        this.getHome()
        this.handleEvent()
    }
}
window.addEventListener('load', function(){ 
    app.start()
    setTimeout(() =>{
        $('.loading__container').style.display = 'none'

    },800)
})