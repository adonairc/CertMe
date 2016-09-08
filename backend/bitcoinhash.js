var BitGoJS = require('./BitGoJS/src/index.js');
var BitcoinJSLib = require('bitcoinjs-lib');

var exports = module.exports = {};

exports.sendHash = function(hash,certificado){

  var token = '3896771e383b7152d1ef0e30753ad8828e2032f8b8d44bcb3195903954c70d88 ';
  var walletId = '2NAEhpyhqs79VYrz4t3yqPtS14oUxGT9s1Z'
  var walletPassphrase = 't&$tU$&r'


  var bitgo = new BitGoJS.BitGo({accessToken: token});

  console.log("Obtendo carteira...");

  // Now get the wallet
  bitgo.wallets().get({id: walletId}, function(err, wallet) {
    if (err) {
      console.log("Error getting wallet!");
      console.dir(err);
      return process.exit(-1);
    }
    console.log("Saldo: " + (wallet.balance() / 1e8).toFixed(4));

    wallet.getEncryptedUserKeychain({}, function(err, keychain) {
      if (err) {
        console.log("Error getting encrypted keychain!");
        console.dir(err);
        return process.exit(-1);
      }


      // Decrypt the user key with the passphrase
      keychain.xprv = bitgo.decrypt({ password: walletPassphrase, input: keychain.encryptedXprv });

      var data = new Buffer(hash);
     // console.log(data);
      
      var outputScript = BitcoinJSLib.script.nullDataOutput(data);

      // Set recipients
      var recipients = [];
      recipients.push({ script: outputScript, amount: 0.0001 * 1e8 });

      console.log("Criando transação");
      wallet.createTransaction({
        recipients: recipients
      },
      function(err, transaction) {
        if (err) {
          console.log("Falha ao criar transação");
          console.dir(err);
          return process.exit(-1);
        }
        console.dir(transaction);
        console.log("Assinando transação");
        wallet.signTransaction({
          transactionHex: transaction.transactionHex,
          unspents: transaction.unspents,
          keychain: keychain
        },
        function (err, transaction) {
          if (err) {
            console.log("Falha ao assinar transação!");
            console.dir(err);
            return process.exit(-1);
          }
          //console.dir(transaction);
          console.log("Enviando transação..");
          wallet.sendTransaction({tx: transaction.tx}, function (err, callback) {
            if (err) {
              console.log("Falha ao realizar transação!");
              console.dir(err);
              return process.exit(-1);
            }
            console.log("Transação efetuada!");
            //console.dir(callback);
            certificado.txid = callback.hash;
            
          });
        });
      });
    });
  });
};