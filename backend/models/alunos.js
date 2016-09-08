var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alunoSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hash: String,
  created_at: Date,
  updated_at: Date
});

var Aluno = mongoose.model('Aluno', alunoSchema);

module.exports = Aluno;