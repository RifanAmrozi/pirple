var fs = require('fs');
var path = require('path')
var helpers = require('./helpers')

var lib ={}

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false)
                        }else{
                            callback('Error closing new file')
                        }
                    })
                }else{
                    callback('Error writing to new file')
                }
            })
        }else{
            callback('Error create new file')
        }
    })
}
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data)
            callback(false,parsedData)
        }else{
            callback(err,data)
        }
    })
}
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data)
            fs.truncate(fileDescriptor,function(err){
                if(!err){
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error closing existing file')
                                }
                            })
                        }else{
                            callback('Error writing to existing file')
                        }
                    })
                }else{
                    callback('Error truncating file')
                }
            })
        }
    })
}
lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file')
        }
    })
}
module.exports=lib