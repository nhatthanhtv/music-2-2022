const express = require('express')
// const morgan = require('morgan')
const handlebars = require('express-handlebars');

const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const  cors = require('cors')

const route = require('./router')
app.use(
  cors({
    origin:'*'
  })
)

// http log
// app.use(morgan('combined'))
// connect database

// POSt
app.use(express.urlencoded())
app.use(express.json())

// set default Folder
app.use(express.static(path.join(__dirname, 'resoures')))

// handblebars
app.engine('hbs', handlebars({
  extname:'hbs', 
  helpers:{
    price: (price => price.toLocaleString())
}
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))


// router MVC
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})