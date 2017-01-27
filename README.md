NetstorageAPI: Akamai Netstorage API for Node.js
================================================

[![npm package](https://badge.fury.io/js/netstorageapi.svg)](https://badge.fury.io/js/netstorageapi)
[![Build Status](https://travis-ci.org/akamai-open/NetStorageKit-Node.svg?branch=master)](https://travis-ci.org/akamai-open/NetStorageKit-Node)
[![License](http://img.shields.io/:license-apache-blue.svg)](https://github.com/akamai-open/NetStorageKit-Node/blob/master/LICENSE)

[![npm package](https://nodei.co/npm/netstorageapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/netstorageapi/)

NetstorageAPI is Akamai Netstorage (File/Object Store) API for Node.js 4.0+ with native [http module](https://nodejs.org/api/http.html).


Installation
------------

To install Netstorage API for Node.js:  

```bash
$ npm install --save netstorageapi
```


Example
-------

```javascript
> const Netstorage = require('netstorageapi'),
>
> const config = { hostname: 'astin-nsu.akamaihd.net', keyName: 'astinapi', key: 'xxxxxxxxxx', cpCode: '360949', ssl: true } // Don't expose NS_KEY on public repository.
> var ns = new Netstorage(config);
> local_source = 'hello.txt'
> netstorage_destination = `/${config.cpCode}/hello.txt` // or `/${config.cpCode}/` is same.
>
> ns.upload(local_source, netstorage_destination, (error, response, body) => {
...  if (error) { // errors other than http response codes
...     console.log(`Got error: ${error.message}`);
...  }
...  if (response.statusCode == 200) { // http response codes: 2xx, 3xx, 4xx, 5xx
...     console.log(`#{body}`);
...  }
... });
<HTML>Request Processed</HTML> // 200 OK
>
```


Methods
-------

```javascript
> function callback(error, response, body) { /* do something */ }
>
> ns.delete(NETSTORAGE_PATH, callback);
> ns.dir(NETSTORAGE_PATH, callback);
> ns.list(NETSTORAGE_PATH, ACTIONS_OBJ, callback);
> ns.download(NETSTORAGE_SOURCE, LOCAL_DESTINATION, callback);
> ns.du(NETSTORAGE_PATH, callback);
> ns.mkdir(`#{NETSTORAGE_PATH}/#{DIRECTORY_NAME}`, callback);
> ns.mtime(NETSTORAGE_PATH, new Date.now(), callback);
> ns.quick_delete(NETSTORAGE_DIR, callback); // needs to be enabled on the CP Code
> ns.rename(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback);
> ns.rmdir(NETSTORAGE_DIR, callback); // remove empty direcoty
> ns.stat(NETSTORAGE_PATH, callback);
> ns.symlink(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback);
> ns.upload(LOCAL_SOURCE, NETSTORAGE_DESTINATION, callback);
>  
> // INFO: can "upload" Only a single file, not directory.
> // WARN: can raise FILE related error in "download" and "upload",
> //       see error object in callback.
```


Test
----
You can test all above methods with [Unit Test Script](https://github.com/AstinCHOI/NetStorageKit-Node/blob/master/test_netstorage.js) (NOTE: You should input NS_HOSTNAME, NS_KEYNAME, NS_KEY and NS_CPCODE in the script). It uses [Mocha](https://mochajs.org/) for the test:


```bash
$ npm install --global mocha
...
$ mocha --no-timeouts test_netstorage.js

### Netstorage test ###
  ns.dir("/360949", callback);
    ✓ should return 200 OK (..ms)
  ns.mkdir("/360949/nst_1473649665790", callback);
    ✓ should return 200 OK (..ms)
  ns.upload("nst_1473649665790.txt", "/360949/nst_1473649665790/nst_1473649665790.txt" callback);
    ✓ should return 200 OK (..ms)
  ns.du("/360949/nst_1473649665790", callback);
    ✓ should return 200 OK (..ms)
  ns.mtime("/360949/nst_1473649665790/nst_1473649665790.txt", 1473649665794, callback);
    ✓ should return 200 OK (..ms)
  ns.stat("/360949/nst_1473649665790/nst_1473649665790.txt", callback);
    ✓ should return 200 OK (..ms)
  ns.symlink("/360949/nst_1473649665790/nst_1473649665790.txt", "/360949/nst_1473649665790/nst_1473649665790.txt_lnk", callback);
    ✓ should return 200 OK (..ms)
  ns.rename("/360949/nst_1473649665790/nst_1473649665790.txt", "/360949/nst_1473649665790/nst_1473649665790.txt_rename", callback);
    ✓ should return 200 OK (..ms)
  ns.download("/360949/nst_1473649665790/nst_1473649665790.txt_rename", callback);
    ✓ should return 200 OK (..ms)
  ns.delete("/360949/nst_1473649665790/nst_1473649665790.txt_rename", callback);
    ✓ should return 200 OK (..ms)
  ns.delete("/360949/nst_1473649665790/nst_1473649665790.txt_lnk", callback);
    ✓ should return 200 OK (..ms)
  ns.rmdir("/360949/nst_1473649665790", callback);
    ✓ should return 200 OK (..ms)
[TEARDOWN] remove nst_1473649665790.txt from local done
[TEARDOWN] remove nst_1473649665790.txt_rename from local done

### Error test ###
  ns.dir("invalid ns path", callback);
    ✓ should get Error object
  ns.upload("invalid local path", "/360949/nst_1473649665790/nst_1473649665790.txt" callback);
    ✓ should get Error object
  ns.download("/123456/directory/", "nst_1476971428611.txt" callback);
    ✓ should get Error object

15 passing (..s)
```


Author
------

Astin Choi (achoi@akamai.com)  


License
-------

Copyright 2016 Akamai Technologies, Inc.  All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
