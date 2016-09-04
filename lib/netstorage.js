const crypto = require('crypto'),
  fs = require('fs'),
  http = require('http'),
  path = require('path');


var Netstorage = function(hostname, keyname, key) {
  this.hostname = hostname;
  this.keyname = keyname;
  this.key = key;
};

Netstorage.prototype._request = function(kwargs, callback) {
  var path = kwargs['path'];
  if (!path.startsWith('/')) {
    throw new Error('There is no Netstorage path');
  }
  path = escape(path);

  const acs_action = `version=1&action=${kwargs['action']}`;
  const acs_auth_data = `5, 0.0.0.0, 0.0.0.0, ${Math.floor(Date.now() / 1000)}, ${Math.floor((Math.random() * 100000))}, ${this.keyname}`;
  const sign_string = `${path}\nx-akamai-acs-action:${acs_action}\n`;
  const message = acs_auth_data + sign_string                      
  const acs_auth_sign = crypto.createHmac('sha256', this.key)
                            .update(message)
                            .digest('base64');
  
  var options = {
    method: kwargs['method'],
    host: this.hostname,
    port: 80,
    path: path,
    headers: {
      'X-Akamai-ACS-Action': acs_action,
      'X-Akamai-ACS-Auth-Data': acs_auth_data,
      'X-Akamai-ACS-Auth-Sign': acs_auth_sign,
      'Accept-Encoding': 'identity'
    }
  };

  var request = http.request(options, (res) => {
    // console.log(`STATUS: ${res.statusCode}`);
    // console.log(res.req._header);
    // console.log(res.headers);
    res.on('data', (chunk) => {
      callback(chunk, res);  
    //   console.log(`BODY: ${chunk}`);
    });
  });

  request.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // upload
  if (kwargs['action'] == 'upload') {
    fs.readFile(kwargs['source'], (err, data) => {
      if (err) throw err;
      request.write(data);
    });
  }

  request.end();
};

Netstorage.prototype.dir = function(ns_path, callback) {
  return this._request({ action: 'dir&format=xml',
                         method: 'GET',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.download = function(ns_path, local_destination, callback) {
  return this._request({ action: 'download',
                         method: 'GET',
                         path: ns_path,
                         destination: local_destination },
                       callback);
};

Netstorage.prototype.du = function(ns_path, callback) {
  return this._request({ action: 'du&format=xml',
                         method: 'GET',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.stat = function(ns_path, callback) {
  return this._request({ action: 'stat&format=xml',
                         method: 'GET',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.mkdir = function(ns_path, callback) {
  return this._request({ action: 'mkdir',
                         method: 'POST',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.rmdir = function(ns_path, callback) {
  return this._request({ action: 'rmdir',
                         method: 'POST',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.mtime = function(ns_path, mtime, callback) {
  return this._request({ action: `mtime&format=xml&mtime=${mtime}`,
                         method: 'POST',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.delete = function(ns_path, callback) {
  return this._request({ action: 'delete',
                         method: 'POST',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.quick_delete = function(ns_path, callback) {
  return this._request({ action: 'quick-delete&quick-delete=imreallyreallysure',
                         method: 'POST',
                         path: ns_path },
                       callback);
};

Netstorage.prototype.rename = function(ns_target, ns_destination, callback) {
  return this._request({ action: `rename&destination=${encodeURIComponent(ns_destination)}`,
                         method: 'POST',
                         path: ns_target },
                       callback);
};

Netstorage.prototype.symlink = function(ns_target, ns_destination, callback) {
  return this._request({ action: `symlink&ns_target=${encodeURIComponent(ns_target)}`,
                         method: 'POST',
                         path: ns_destination },
                       callback);
};

Netstorage.prototype.upload = function(local_source, ns_destination, callback) {
  fs.stat(local_source, (err, stats) => {
    if (err) {
      // do something
      throw new Error(err);
    }
    
    if (stats.isDirectory()) {
      // do something 2
      throw new Error('There is no Netstorage path');
    }
  });

  if (!path.basename(ns_destination)) {
    ns_destination = `${ns_destination}${path.basename(local_source)}`
  }

  return this._request({ action: 'upload',
                         method: 'PUT',
                         source: local_source,
                         path: ns_destination },
                       callback);
};

module.exports = Netstorage;


// const secrets = require("../spike/secrets")
// var ns = new Netstorage("astin-nsu.akamaihd.net", "astinastin", secrets.key)
// ns.dir("/360949", (data, response) => {
//     console.log(`${data}`);
//     // console.log(response);
// });
