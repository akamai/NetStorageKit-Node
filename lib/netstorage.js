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
  var ns_path = kwargs['path'];
  if (!ns_path.startsWith('/')) {
    throw new Error('There is no Netstorage path');
  }
  ns_path = escape(ns_path);

  const acs_action = `version=1&action=${kwargs['action']}`;
  const acs_auth_data = `5, 0.0.0.0, 0.0.0.0, ${Math.floor(Date.now() / 1000)}, ${Math.floor((Math.random() * 100000))}, ${this.keyname}`;
  const sign_string = `${ns_path}\nx-akamai-acs-action:${acs_action}\n`;
  const message = acs_auth_data + sign_string                      
  const acs_auth_sign = crypto.createHmac('sha256', this.key)
                            .update(message)
                            .digest('base64');
  
  var options = {
    method: kwargs['method'],
    host: this.hostname,
    port: 80,
    path: ns_path,
    headers: {
      'X-Akamai-ACS-Action': acs_action,
      'X-Akamai-ACS-Auth-Data': acs_auth_data,
      'X-Akamai-ACS-Auth-Sign': acs_auth_sign,
      'Accept-Encoding': 'identity'
    }
  };

  var request = http.request(options, (res) => {
    res.on('data', (data) => {
      if (kwargs['action'] == 'download') {
        local_destination = kwargs['destination'];
        ns_filename = !(kwargs['path'].endsWith('/')) ? path.basename(kwargs['path']) : null;
        if (local_destination == '') {
          local_destination = ns_filename;
        } else if (fs.lstatSync(local_destination).isDirectory()) {
          local_destination = path.join(local_destination, ns_filename);
        }

        fs.writeFileSync(local_destination, data);
        callback('Download done', res);
      } else {
        callback(data, res);
      }  
    });
  });

  request.on('error', (e) => {
    // callback(,,e);
    console.log(`problem with request: ${e.message}`);
  });

  // upload
  if (kwargs['action'] == 'upload') {
    request.write(fs.readFileSync(kwargs['source']));
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
  if (typeof(local_destination) == 'function' && callback === undefined) {
    callback = local_destination;
    local_destination = '';
  }
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
  return this._request({ action: `symlink&target=${encodeURIComponent(ns_target)}`,
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