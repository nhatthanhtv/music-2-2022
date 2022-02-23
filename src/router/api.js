const express = require('express');
const router = express.Router()

const apiMusic = require('../app/controllers/ApiMusic')



router.get('/getsong', apiMusic.getsong)
router.get('/getinfoplaylist', apiMusic.getinfoplaylist)
router.get('/gethome', apiMusic.gethone)
router.get('/gettop100', apiMusic.gettop100)
router.get('/getsonginfo', apiMusic.getsonginfo)
router.get('/searchsong', apiMusic.searchsong)


module.exports = router