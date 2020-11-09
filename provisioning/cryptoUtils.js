var crypto = require("crypto");

module.exports = {
  createSignature : function(masterKey, secretKey) {
    var key = new Buffer.from(masterKey, "base64");
    var signature = crypto.createHmac("sha256", key).update(secretKey).digest("base64");
    
    return signature;
  }
}


