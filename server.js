const express = require('express')
const app = express()
const path = require('path')

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'd332ee6d8a424f6591776887a98b4a11',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']
rollbar.log('site is live')

app.get('/', (req, res) => {
    rollbar.log('site visited')
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
    rollbar.info('student list is sent')

})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
           rollbar.info('student added successfully')
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
           rollbar.error('attempted to add blank student name')
       } else {
           res.status(400).send('That student already exists.')
           rollbar.warning('attempted dupe student')
       }
   } catch (err) {
       console.log(err)
       rollbar.error(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
