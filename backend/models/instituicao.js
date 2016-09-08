var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var instituicaoSchema = new Schema({
  name: String,
  hash: String,
  created_at: Date,
  updated_at: Date
});

var Instituicao = mongoose.model('Instituicao', instituicaoSchema);

module.exports = Instituicao;