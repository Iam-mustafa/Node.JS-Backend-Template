const mongoose = require('mongoose');
if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, err=>{
    if(err){
        console.log('Error in Database Connection: ', err);
    }
    if(process.env.SEED){
        console.log('Seed Flag!');
        require('./seed');
    }
});
