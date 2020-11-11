const 
    express = require('express'),
    app = express(), 
    router = require('./router/router'),
    PORT = 2000,
    formidable = require('express-form-data'),
    mongoose = require('mongoose'),
    colors = require('colors')



//.......Middlewares......

app.use(express.static('public'))
app.use(formidable.parse({
    keepExtensions: true,
    encoding: 'utf-8',
    uploadDir: './temp',
    multiples: true,
}))
app.set('view engine', 'pug')
app.use('/', router)


const Go = async()=>{
    
    try{
        await mongoose.connect('mongodb://localhost/users', {
            useNewUrlParser   : true,
            useUnifiedTopology: true,
            useCreateIndex    : true,
            useFindAndModify  : false
        })
        await app.listen(PORT)

        console.log(`   
            x~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~x
            | DataBase Runing                 |
            | Server listen in the port ${PORT}  |
            x~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~x`
        .cyan.bold.italic)

    }catch(err) {console.log(err)}
}
Go()
//......App listen.....
