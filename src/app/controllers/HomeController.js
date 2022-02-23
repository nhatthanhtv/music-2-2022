const Product = require('../model/Product')
const { mutipleMongooseToObject } = require('../../util/mongoose')
class HomeController {

    // GET [/] home
    index(req, res,next) {
        res.render('home')
    }
}

module.exports = new HomeController