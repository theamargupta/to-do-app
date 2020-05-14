let express = require('express')
let mongodb = require('mongodb')


let app = express()
let db

let collectionString = 'mongodb+srv://todoappuser:lalaamarji12@cluster0-ju2pj.mongodb.net/todoapp?retryWrites=true&w=majority'

const port = process.env.PORT || 3000

mongodb.connect(collectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res)=>{
  db = res.db()
  app.listen(port, ()=>{
    console.log('http://127.0.0.1:'+port)
})
})

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const passwordProtections = (req, res, next) => {
  res.set('WWW-Authenticate', 'Basic realm="simple todo app"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic YW1hcjoxMjM0"){
    next()
  } else {
    res.status(401).send("authentication requires")
  }
}

app.use(passwordProtections)

app.get('/', (req, res)=> {
  db.collection('item').find().toArray((err, item)=>{
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <style>
      footer {
        min-height: 100px;
        background-color: #eaecee70;
        color: #929eaa;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
        font-size: 20px;
        text-align: center;
    }
      </style>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add the New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
          
        </ul>
        
      </div>
      <footer>
            <p>Made with ❤️ by Amar Gupta </p>
        </footer>
      <script>
      let items=${JSON.stringify(item)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="browser.js"></script>
    </body>
    </html>`)
    
  })
  })


app.post('/create-item', (req, res)=>{
  db.collection('item').insertOne({text: req.body.text}, (err, info)=>{
    res.json(info.ops[0])
  })
    
})


app.post('/update-item', (req, res)=>{
  db.collection('item').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, ()=>{
    res.send('sucess')})
})


app.post('/delete-item', (req, res) =>{
  db.collection('item').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, ()=>{
    res.send('sucess')
  })
})