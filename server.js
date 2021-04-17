const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const redis = require('redis');
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT)

const mongoDBUrl = 'mongodb://localhost:27017/tinyurl'

const tinyUrlController = require('./tinyUrlController');


const init = async() => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
     
    })

    server.route(
        {
            method: 'POST',
            path: '/url/long',
            handler: tinyUrlController.getLongUrl
            },

        {
        method: 'POST',
        path: '/url/tiny',
        handler: tinyUrlController.getTinyUrl
        },

        

    )

    await server.start();
   // console.log("hola")

    mongoose.connect(mongoDBUrl, {
        useNewUrlParser:true,
       // useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
    //console.log("hola--")
    mongoose.connection.on('connected',()=>{
        console.log("Connected to mongo instance");
    })

    mongoose.connection.on('error',(err)=>{
        console.log("Error connecting to mongo instace ",err);
    })
    console.log('Server running at %s',server.info.uri);
}


process.on('unhandledRejection',(err)=>{
    console.log(err);
    process.exit(1);
})

init();

