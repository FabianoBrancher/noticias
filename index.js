const express = require('express')
const app = express()
const path = require('path')
const port = process.env.port || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const User = require('./models/user')
const Noticia = require('./models/noticia')

const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const admin = require('./routes/admin')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const session = require('express-session')

mongoose.Promise = global.Promise

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(session({ secret: 'fullstack-master'}))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)
app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.use('/admin', admin)


const createInitialUser = async () => {
    const total = await User.count({})
    if (total === 0) {
        const user = new User({
            username: 'user1',
            password: '1234',
            roles: ['restrito', 'admin']
        })
        await user.save()

        const user2 = new User({
            username: 'user2',
            password: '1234',
            roles: ['restrito']
        })
        await user2.save()
        console.log('User created.')
    } else {
        console.log('User created skipped.')
    }

    // const noticia = new Noticia({
    //     title: 'Notícia pública '+ new Date().getTime(),
    //     content: 'content',
    //     category: 'public'
    // })
    // await noticia.save()

    // const noticia2 = new Noticia({
    //     title: 'Notícia privada '+ new Date().getTime(),
    //     content: 'content',
    //     category: 'private'
    // })
    // await noticia2.save()

}



mongoose
    .connect(mongo, { useNewUrlParser: true })
    .then(() => {
        createInitialUser()
        app.listen(port, () => console.log('Listening....'))
    })
    .catch((error) => console.log(error))




/*
const User = require('./models/user')
const user = new User({
    username: 'fabianobrancher',
    password: 'abc123'
})

user.save( () => console.log('opaaa'))
*/
