# NetstorageAPI: Akamai Netstorage API for Node.js

[![npm package](https://badge.fury.io/js/netstorageapi.svg)](https://badge.fury.io/js/netstorageapi)
[![Build Status](https://travis-ci.org/akamai-open/NetStorageKit-Node.svg?branch=master)](https://travis-ci.org/akamai-open/NetStorageKit-Node)
[![License](http://img.shields.io/:license-apache-blue.svg)](https://github.com/akamai-open/NetStorageKit-Node/blob/master/LICENSE)

[![npm package](https://nodei.co/npm/netstorageapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/netstorageapi/)

NetstorageAPI is Akamai Netstorage (File/Object Store) API for Node.js 4.0+ with native [http module](https://nodejs.org/api/http.html).

# Table of Contents
* [Installation](#installation)
* [Example](#example)
* [Methods](#methods)
  * [delete](#delete)
  * [dir](#dir)
  * [list](#list)
  * [download](#download)
  * [du](#du)
  * [mkdir](#mkdir)
  * [mtime](#mtime)
  * [quick_delete](#quick_delete)
  * [rename](#rename)# NetstorageAPI: Akamai Netstorage API for Node.js

[![npm package](https://badge.fury.io/js/netstorageapi.svg)](https://badge.fury.io/js/netstorageapi)
[![Build Status](https://travis-ci.org/akamai-open/NetStorageKit-Node.svg?branch=master)](https://travis-ci.org/akamai-open/NetStorageKit-Node)
[![License](http://img.shields.io/:license-apache-blue.svg)](https://github.com/akamai-open/NetStorageKit-Node/blob/master/LICENSE)

[![npm package](https://nodei.co/npm/netstorageapi.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/netstorageapi/)

NetstorageAPI is Akamai Netstorage (File/Object Store) API for Node.js 4.0+ with native [http module](https://nodejs.org/api/http.html).

# Table of Contents
* [Installation](#installation)
* [Example](#example)
* [Methods](#methods)
  * [delete](#delete)
  * [dir](#dir)
  * [list](#list)
  * [download](#download)
  * [du](#du)
  * [mkdir](#mkdir)
  * [mtime](#mtime)
  * [quick_delete](#quick_delete)
  * [rename](#rename)
  * [rmdir](#rmdir)
  * [stat](#stat)
  * [symlink](#symlink)
  * [upload](#upload)
* [Testing](#testing)
* [Author](#author)
* [License](#license)

# Installation

To install Netstorage API for Node.js:  

```Shell
$ npm install --save netstorageapi
```


# Example

```Javascript
const Netstorage = require('netstorageapi')

// Defaults: SSL: false
const config = {
  hostname: 'astinobj-nsu.akamaihd.net',
  keyName: 'astinobj',
  key: 'xxxxxxxxxx',
  cpCode: '407617',
  ssl: true
}
// Don't expose KEY on your public repository.

const ns = new Netstorage(config)
const local_source = 'hello.txt'

// or \`/${config.cpCode}/\` will asume the destination filename is the same as the source
const netstorage_destination = \`/${config.cpCode}/hello.txt\`

ns.upload(local_source, netstorage_destination, (error, response, body) => {
  if (error) { // errors other than http response codes
    console.log(\`Got error: ${error.message}\`)
  }
  if (response.statusCode == 200) {
    console.log(body)
  }
}); 

{ message: 'Request Processed.' }
```


# Methods

* [delete](#delete)
* [dir](#dir)
* [list](#list)
* [download](#download)
* [du](#du)
* [mkdir](#mkdir)
* [mtime](#mtime)
* [quick_delete](#quick_delete)
* [rename](#rename)
* [rmdir](#rmdir)
* [stat](#stat)
* [symlink](#symlink)
* [upload](#upload)

### delete
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript 
ns.delete(NETSTORAGE_PATH, callback(err, response, body)) 
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### dir
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**:
```Javascript
	ns.dir(NETSTORAGE_PATH|OPTIONS_OBJECT, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### list
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.list(NETSTORAGE_PATH|OPTIONS_OBJECT, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### download
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.download(NETSTORAGE_SOURCE, LOCAL_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |

### du
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.du(NETSTORAGE_PATH, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### mkdir
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.mkdir(`#{NETSTORAGE_PATH}/#{DIRECTORY_NAME}`, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |


### mtime
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.mtime(NETSTORAGE_PATH, Math.floor(Date.now()/1000), callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### quick_delete
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.quick_delete(NETSTORAGE_DIR, callback(err, response, body)) // needs to be enabled on the CP Code
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_DIR` | string | full path to the directory/object |

### rename
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.rename(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_TARGET` | string | full path to the original file/directory/object |
	| `NETSTORAGE_DESTINATION` | string | full path to the renamed file/directory/object |

### rmdir
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.rmdir(NETSTORAGE_DIR, callback(err, response, body)) // remove empty direcoty
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_DIR` | string | full path to the directory/object |

### stat
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.stat(NETSTORAGE_PATH, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### symlink
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.symlink(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |


### upload
######*[^ to table of contents](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.upload(LOCAL_SOURCE, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |

 
// INFO: can "upload" Only a single file, not directory.
// WARN: can raise FILE related error in "download" and "upload",
//       see error object in callback(err, response, body).

# Testing

Unit tests for all of the above methods are executed via the [test script](https://github.com/akamai-open/NetStorageKit-Node/blob/master/test/test-netstorage.js). Prior to testing, create an api-config.json file in the test directory using the provided [example](https://github.com/akamai-open/NetStorageKit-Node/blob/master/test/api-config.json.example) for the required values. The excellent [Mocha](https://mochajs.org/) and [ChaiJS](http://chaijs.com) libraries are used for all tests:


```Shell
$ npm install
$ export TEST_MODE=LOCAL # use test/api-config.json
$ npm test
```


# Author

Astin Choi (achoi@akamai.com)  

# License

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

  * [rmdir](#rmdir)
  * [stat](#stat)
  * [symlink](#symlink)
  * [upload](#upload)
* [Testing](#testing)
* [Author](#author)
* [License](#license)

# Installation

To install Netstorage API for Node.js:  

```Shell
$ npm install --save netstorageapi
```


# Example

```Javascript
const Netstorage = require('netstorageapi')

// Defaults: SSL: false
const config = {
  hostname: 'astinobj-nsu.akamaihd.net',
  keyName: 'astinobj',
  key: 'xxxxxxxxxx',
  cpCode: '407617',
  ssl: true
}
// Don't expose KEY on your public repository.

const ns = new Netstorage(config)
const local_source = 'hello.txt'

// or \`/${config.cpCode}/\` will asume the destination filename is the same as the source
const netstorage_destination = \`/${config.cpCode}/hello.txt\`

ns.upload(local_source, netstorage_destination, (error, response, body) => {
  if (error) { // errors other than http response codes
    console.log(\`Got error: ${error.message}\`)
  }
  if (response.statusCode == 200) {
    console.log(body)
  }
}); 

{ message: 'Request Processed.' }
```


# Methods

* [delete](#delete)
* [dir](#dir)
* [list](#list)
* [download](#download)
* [du](#du)
* [mkdir](#mkdir)
* [mtime](#mtime)
* [quick_delete](#quick_delete)
* [rename](#rename)
* [rmdir](#rmdir)
* [stat](#stat)
* [symlink](#symlink)
* [upload](#upload)

### delete
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript 
ns.delete(NETSTORAGE_PATH, callback(err, response, body)) 
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### dir
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**:
```Javascript
	ns.dir(NETSTORAGE_PATH|OPTIONS_OBJECT, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### list
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.list(NETSTORAGE_PATH|OPTIONS_OBJECT, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### download
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.download(NETSTORAGE_SOURCE, LOCAL_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |

### du
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.du(NETSTORAGE_PATH, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### mkdir
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.mkdir(`#{NETSTORAGE_PATH}/#{DIRECTORY_NAME}`, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |


### mtime
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.mtime(NETSTORAGE_PATH, Math.floor(Date.now()/1000), callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### quick_delete
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.quick_delete(NETSTORAGE_DIR, callback(err, response, body)) // needs to be enabled on the CP Code
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_DIR` | string | full path to the directory/object |

### rename
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.rename(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_TARGET` | string | full path to the original file/directory/object |
	| `NETSTORAGE_DESTINATION` | string | full path to the renamed file/directory/object |

### rmdir
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.rmdir(NETSTORAGE_DIR, callback(err, response, body)) // remove empty direcoty
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_DIR` | string | full path to the directory/object |

### stat
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.stat(NETSTORAGE_PATH, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |
	| `NETSTORAGE_PATH` | string | full path to the file/directory/object |

### symlink
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.symlink(NETSTORAGE_TARGET, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |


### upload
######*[^ back to method list](#methods)*
- **Description**:
- **Syntax**: 
```Javascript
	ns.upload(LOCAL_SOURCE, NETSTORAGE_DESTINATION, callback(err, response, body))
```
- **Parameters**:

	| Name        | Type        | Description                     |
	| :---------- | :---------: | :------------------------------ |

 
// INFO: can "upload" Only a single file, not directory.
// WARN: can raise FILE related error in "download" and "upload",
//       see error object in callback(err, response, body).

# Testing

Unit tests for all of the above methods are executed via the [test script](https://github.com/akamai-open/NetStorageKit-Node/blob/master/test/test-netstorage.js). Prior to testing, create an api-config.json file in the test directory using the provided [example](https://github.com/akamai-open/NetStorageKit-Node/blob/master/test/api-config.json.example) for the required values. The excellent [Mocha](https://mochajs.org/) and [ChaiJS](http://chaijs.com) libraries are used for all tests:


```Shell
$ npm install
$ export TEST_MODE=LOCAL # use test/api-config.json
$ npm test
```


# Author

Astin Choi (achoi@akamai.com)  

# License

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
