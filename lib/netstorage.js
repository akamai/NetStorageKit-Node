// Original author: Astin Choi <achoi@akamai.com>

// Copyright 2016 Akamai Technologies http://developer.akamai.com.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const crypto = require('crypto'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  path = require('path');


var Netstorage = function(hostname, keyname, key, ssl) {
  if (!(hostname && keyname && key)) {
    throw new Error('[Netstorage Error] You should input netstorage hostname, keyname and key all');
  }
  
  if (ssl === undefined) {
    ssl = false;
  } else if (typeof(ssl) !== 'boolean') {
    throw new TypeError('[Netstorage Error] "ssl" argument should be boolean type');
  }

  this.hostname = hostname;
  this.keyname = keyname;
  this.key = key;
  this.ssl = ssl;
};

Netstorage.prototype._request = function(kwargs, callback) {
  var ns_path = kwargs['path'];
  if (!ns_path.startsWith('/')) {
    callback(error=new Error('[Netstorage Error] Invalid netstorage path'));
    return;
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
    path: ns_path,
    headers: {
      'X-Akamai-ACS-Action': acs_action,
      'X-Akamai-ACS-Auth-Data': acs_auth_data,
      'X-Akamai-ACS-Auth-Sign': acs_auth_sign,
      'Accept-Encoding': 'identity',
      'User-Agent': 'NetStorageKit-Node'
    }
  };

  var request = (this.ssl?https:http).request(options, (res) => {
    res.on('data', (data) => {
      if (kwargs['action'] == 'download') {
        local_destination = kwargs['destination'];
        ns_filename = !(kwargs['path'].endsWith('/')) ? path.basename(kwargs['path']) : false;
        if (!ns_filename) {
          callback(error=new Error('[Netstorage Error] Nestorage Path should be a file, not directory'));
          request.end();
          return;
        } else if (local_destination == '') {
          local_destination = ns_filename;
        } else if (fs.lstatSync(local_destination).isDirectory()) {
          local_destination = path.join(local_destination, ns_filename);
        }
        try {
          fs.writeFileSync(local_destination, data);
        } catch (e) {
          callback(error=e);
          request.end();
          return;
        }
        callback(body='Download done', response=res);
      } else {
        callback(body=data, response=res);
      }  
    });
  });

  request.on('error', (e) => {
    callback(error=e);
  });

  if (kwargs['action'] == 'upload') {
    try {
      request.write(fs.readFileSync(kwargs['source']));
    } catch (e) {
      callback(error=e);
    } 
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
  if (typeof(local_destination) === 'function' && callback === undefined) {
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
  try {
    if (fs.statSync(local_source).isFile()) {
      if (ns_destination.endsWith('/')) {
        ns_destination = `${ns_destination}${path.basename(local_source)}`;
      }  
    } else {
      callback(error=new Error("[Netstorage Error] You should upload a file"));
      return;
    }
  } catch (e) {
    callback(error=e);
    return;
  }

  return this._request({ action: 'upload',
                         method: 'PUT',
                         source: local_source,
                         path: ns_destination },
                       callback);
};

module.exports = Netstorage;