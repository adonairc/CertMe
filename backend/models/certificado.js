var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var certificadoSchema = new Schema({
  filename: String,
  hash_aluno: String,
  hash_cert: String,
  curso: String,
  instituicao: String,
  txid: String,
  created_at: Date,
  updated_at: Date
});

var Certificado = mongoose.model('Certificado', certificadoSchema);

module.exports = Certificado;