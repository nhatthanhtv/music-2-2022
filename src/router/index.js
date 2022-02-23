const homeRouter = require('./home')
const api = require('./api')

function route(app){
  
    app.use('/api', api)
    app.use('/', homeRouter)
}

module.exports = route