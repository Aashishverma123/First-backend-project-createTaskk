const { log } = require('console');
var express = require('express');
var router = express.Router();
const fs  =  require("fs");


router.get('/', function (req, res) {
      
  fs.readdir("./files",function(err , files){
    if(err){
      return res.status(500).send("internal server error");
    }
    const arr  = [];
    if(files.length === 0){
      res.render("index",{files: arr});
    }
    files.forEach(function(file){
      fs.readFile(`./files/${file}`,"utf-8",function(err, data){
        if(err){
         return res.status(500).send("internal server error");
        }
        arr.push({name:file,content:data});
        files.length--;
        if(files.length == 0){
          res.render("index",{files:arr});
        }
      });
    });
  });
});


router.get("/read/:filename",function(req , res){
  fs.readFile(`./files/${req.params.filename}`,"utf-8" , function (err , fileData){
    res.render("readmore",{filename:req.params.filename , fileData: fileData});
  });
});


router.get("/edit/:filename",function(req , res){
  fs.readFile(`./files/${req.params.filename}`,"utf-8" , function(err , fileData){
    if(err){
      res.status(500).send("internal server error");
    }
    res.render("edit",{filename:req.params.filename , fileData:fileData});
  })
})

router.post("/edit",function(req , res){
  fs.writeFile(`./files/${req.body.title}`,req.body.details , function(err){
    if(err){
      console.error(err);
      res.status(500).send("internal server error");
    }
    res.redirect("/");
  })
})



router.get("/delete/:filename",function(req , res){
  fs.unlink(`./files/${req.params.filename}` , function(err){
    if(err){
      res.status(500).send("internal server error");
    }
    res.redirect("/");
  })
})









router.post('/create', function(req, res) {
    const file  = req.body.title.split(" ").join("")
    fs.writeFile(`./files/${file}.txt`, req.body.details, function (err) {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }
      res.redirect('/');
  });
 

});

module.exports = router;

