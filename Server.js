const express = require('express');
const helmet = require('helmet');
const path = require("path");
const cors = require('cors')
require('./db-initialize');

const app = express();
const port = process.env.PORT || 7000;

app.use(helmet());

app.use(express.static(process.cwd() + '/public'));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));

if(process.env.NODE_ENV !== 'production'){
    app.use(cors());
  }
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
  });
//http://localhost:7000/

///URIs Mounting
require('./routes/User').init(app);

app.listen(port, () => {
    console.log(`template app listening on port ${port}`)
  });