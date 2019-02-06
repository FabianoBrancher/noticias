const express = require('express')
const app = express()
const path = require('path')
const port = process.env.port || 3000
const mongoose = require('mongoose')

const User = require('./models/user')

mongoose.Promise = global.Promise

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

const createInitialUser = async () => {
    const total = await User.countDocuments({username: 'fabianobrancher'})
    if (total === 0) {
        const user = new User({
            username: 'fabianobrancher',
            password: 'abc123'
        })
        await user.save()
        console.log('User created.')
    } else {
        console.log('User created skipped.')
    }
}

app.get('/', (req, res) => {
    res.render('index')
})

mongoose
    .connect(mongo)
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

user.save( () => console.log('opa'))
*/