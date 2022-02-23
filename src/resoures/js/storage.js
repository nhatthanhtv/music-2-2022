const KEY = 'Music_TNT'
const storage = {
    get: function (){
        return JSON.parse(localStorage.getItem(KEY)) || [];
    },
    set: function (value) {
        return localStorage.setItem(KEY, JSON.stringify(value));
    }
}

export default storage