const assert = require('assert'),
    Netstorage = require('./lib/netstorage'),
    secrets = require("./spike/secrets");


var ns = new Netstorage("astin-nsu.akamaihd.net", "astinastin", secrets.key);


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});