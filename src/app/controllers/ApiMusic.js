const {
  getSong,
  getDetailPlaylist,
  getHome,
  getTop100,
  getChartHome,
  getNewReleaseChart,
  getInfoSong,
  getArtist,
  getLyric,
  search,
  getListMV,
  getCategoryMV,
  getVideo
} = require("zingmp3-api-full")


class ApiMusic {
  
    getsong(req, res){
      getSong(req.query.id)
        .then(data => res.json(data))
    }
    getinfoplaylist(req, res){
      getDetailPlaylist(req.query.idlist).then((data) => res.json(data))
    }
    gethone(req, res){
      getHome("1").then((data) => res.json(data))
    }
    gettop100(req, res){
      getTop100().then((data) => res.json(data))
    }
    getsonginfo(req, res){
      getInfoSong(req.query.id).then((data) => res.json(data))
    }
    searchsong(req, res){
      search(req.query.value).then((data) => res.json(data))
    }


}

module.exports = new ApiMusic