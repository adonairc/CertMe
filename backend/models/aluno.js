var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alunoSchema = new Schema({
  nome: String,
  descricao: String,
  hash_aluno: String,
  created_at: Date,
  updated_at: Date
});

var Aluno = mongoose.model('Aluno', alunoSchema);

module.exports = Aluno;