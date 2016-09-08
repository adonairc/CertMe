var express =   require("express");
var multer  =   require('multer');
var crypto = require('crypto');
var fs = require('fs');
var mongoose   = require('mongoose');
var bitcoinhash = require('./bitcoinhash.js');
var blocktrail = require('blocktrail-sdk');
var bodyParser= require('body-parser')


var Aluno = require('./models/aluno.js');
var Certificado = require('./models/certificado.js');
var Instituicao = require('./models/instituicao.js');

var blockchain = blocktrail.BlocktrailSDK({apiKey: "MY_APIKEY", apiSecret: "MY_APISECRET", network: "BTC", testnet: false});

mongoose.connect('mongodb://localhost/hackathon');


var app = express();

app.use(bodyParser.urlencoded({extended: true}))
function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('upload');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});


app.get('/api/aluno',function(req,res){
  var resultado = {}
  Aluno.find(function(err, alunos) {
    if (err) {
      res.send(err);
    }
    resultado.aluno = alunos;
    Certificado.find(function(err, certificados) {
      if (err) {
        res.send(err);
      }
      resultado.certificados = certificados;
      res.json(resultado);
    })
  });
});
/*
app.get('/api/certificados',function(req,res){
 
});*/

app.get('/api/certificado/:hash_cert',function(req,res){
 Certificado.findOne({'hash_cert':req.params.hash_cert},function(err,cert){
    console.log(cert);
  })
});

app.post('/api/upload',upload, function(req,res){
    var certificado = new Certificado();
    //console.log(req.file);
    fs.readFile(req.file.path, function (err, data) {
        var hash = checksum(data,'sha256');
        certificado.hash_cert = hash;
        certificado.hash_aluno = req.body.hash;
        certificado.hash = hash+req.body.hash;
        certificado.curso = 'Data Science'
        certificado.instituicao = 'MIT - Massachusetts Institute of Technology'
        certificado.filename = req.originalname;
        bitcoinhash.sendHash(hash+req.body.hash);
        certificado.txid = 10;
        certificado.save(function(err) {
            if (err)
                res.send(err);

            res.json({ status: 'success' });
        });
    });  
});

app.listen(3000,function(){
    console.log("Escutando na porta 3000");
});