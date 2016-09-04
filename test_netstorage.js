// $ mocha --ui tdd test_netstorage.js

const assert = require('assert'),
    fs = require('fs'),
    Netstorage = require('./lib/netstorage'),
    secrets = require('./spike/secrets');


var NS_HOSTNAME = "astin-nsu.akamaihd.net";
var NS_KEYNAME = "astinastin";
var NS_KEY = secrets.key;
var NS_CPCODE = "360949";


suite('Netstorage test', function() {
  
  var ns = new Netstorage(NS_HOSTNAME, NS_KEYNAME, NS_KEY);
  
  var temp_ns_dir = `/${NS_CPCODE}/netstoragetest_${Date.now()}`;
  var temp_file = `netstoragetest_${Date.now()}.txt`;
  var temp_ns_file = `${temp_ns_dir}/${temp_file}`;

  
  suiteTeardown(function() {
    try {
      fs.unlinkSync(temp_file);
      console.log(`[TEARDOWN] remove ${temp_file} from local done`);
    } catch (err) {
      // Do Nothing
    }

    ns.delete(temp_ns_file, (data, response) => {
      if (response.statusCode == 200) {
        console.log(`[TEARDOWN] delete ${temp_ns_file} done`);
      }
    });

    ns.delete(`${temp_ns_file}_lnk`, (data, response) => {
      if (response.statusCode == 200) {
        console.log(`[TEARDOWN] delete ${temp_ns_file}_lnk done`);
      }
    });
    
    ns.delete(`${temp_ns_file}_rename`, (data, response) => {
      if (response.statusCode == 200) {
        console.log(`[TEARDOWN] delete ${temp_ns_file}_rename done`);
      }
    });

    ns.rmdir(temp_ns_dir, (data, response) => {
      if (response.statusCode == 200) {
        console.log(`[TEARDOWN] rmdir ${temp_ns_dir} done`);
      }
    });
  });

  suite(`ns.dir();`, function() {
    test('should return 200 when netstorage path exists', function() {
      ns.dir(`/${NS_CPCODE}`, (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });
  

  suite(`ns.mkdir("${temp_ns_dir}");`, function() {
    test('should return 200 when netstorage directory creates', function() {
      ns.mkdir(temp_ns_dir, (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });

  suite(`ns.upload();`, function() {
    test('should return 200 when the file is uploaded', function() {
      fs.writeFileSync(temp_file, 'Hello, Netstorage API World!', 'utf8');
      ns.upload(temp_file, temp_ns_file, (data, response) => {
          assert.equal(200, response.statusCode);
        });
    });
  });

  suite(`ns.du();`, function() {
    test('should return 200 when du done', function() {
      ns.du(temp_ns_dir, (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });

  suite(`ns.mtime();`, function() {
    test('should return 200 when mtime done', function() {
      ns.mtime(temp_ns_file, Date.now(), (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });

  suite(`ns.symlink();`, function() {
    test('should return 200 when symlinke file is created', function() {
      ns.symlink(temp_ns_file, `${temp_ns_file}_lnk`, (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });

  suite(`ns.rename();`, function() {
    test('should return 200 when file is renamed', function() {
      ns.rename(temp_ns_file, `${temp_ns_file}_rename`, (data, response) => {
        assert.equal(200, response.statusCode);
      });
    });
  });
});