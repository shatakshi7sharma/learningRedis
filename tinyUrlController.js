var crypto = require("crypto")
const Url= require('./tinyUrl')
const redis = require('redis');
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT)

var getTinyUrl =async(req,h) =>{

     //console.log("hiii")

        const {url} = req.payload

        if(!url){
            return "Please provide url."
        }

        try{

        hash = crypto.createHash('md5').update(url).digest('hex')
        short =`https://charpixel/${hash}`
     
        const saveUrl= await Url.findOneAndUpdate({longurl:url},
                {longurl:url, shorturl:short},
                { upsert: true, new: true } );
       
        if(saveUrl.hitCount && saveUrl.hitCount<=10){
            const urlHitCount =await Url.findOneAndUpdate({longurl:url},
                {$inc: { hitCount: 1 }},
                {new: true } );
            console.log(urlHitCount) 

        }
        else{
            client.setex(saveUrl.longurl,3600,saveUrl.shorturl)
       
        }
            return {
                     statusCode:200,
                     longurl:saveUrl.longurl,
                     shorturl:saveUrl.shorturl
                     
                 }

       }catch(error){

            return {
                 error:error,
                 statusCode:400
                   }
       }
}



function getRedis(key) {

    return new Promise((resolve, reject) => {

         client.get(key, function(err,result){
             if (err) {
                console.log("redis err",err)
                return reject(err);
             }
                console.log("redis result",result)
                return resolve(result);
            });

    })
}

var getLongUrl =async(req,h) =>{

    console.log("hiii","****")
       const {longurl} = req.payload
       if(!longurl){
           return "Please provide url."
       }
      try{
        // const url= await Url.findOne({shorturl:shorturl})
        // return url.longurl
        var shorturl =  await getRedis(longurl)
        return shorturl

      }catch(error){
       return {error}
     }
    
}


module.exports = {
   
    getTinyUrl,
    getLongUrl
    
}

