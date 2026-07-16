'use strict'
const Auth = require('./api-auth')
const Parser = require('./api-request-parser')
const path = require('path')
const https = require('https')
const fs = require('fs')
const { HttpsProxyAgent } = require('https-proxy-agent')

class Requestor {
  constructor(requestorOptions) {
    this.requestorOptions = requestorOptions
    if (!this.requestorOptions instanceof Object) {
      throw new TypeError('[Requestor Error] options should be an object')
    } else if (!(this.requestorOptions.hostname && this.requestorOptions.keyName && this.requestorOptions.key)) {
      throw new Error('[Requestor Error] options object should contain key, keyName, and hostname attributes')
    }

    this.auth = new Auth({ key: this.requestorOptions.key, keyName: this.requestorOptions.keyName })
    this.parser = new Parser()
    if (requestorOptions.proxy) this.agent = new HttpsProxyAgent(requestorOptions.proxy);
  }

  async makeRequest(requestArgs, callback) {
    const acs_action = `version=1&action=${requestArgs.action}`
    const netstoragePath = this.validatePath(requestArgs.path)
    const authData = this.auth.auth(netstoragePath, acs_action)

    var url = "https://" + this.requestorOptions.hostname + netstoragePath;
    var options = {
      method: requestArgs.method,
      headers: {
        'X-Akamai-ACS-Action': acs_action,
        'X-Akamai-ACS-Auth-Data': authData.acs_auth_data,
        'X-Akamai-ACS-Auth-Sign': authData.acs_auth_sign,
        'Accept-Encoding': 'identity',
        'User-Agent': 'NetStorageKit-Node',
        'Accept': '*/*'
      }
    }

    if (this.agent) options.agent = this.agent;

    // Create read stream
    if (requestArgs.action == 'upload') {
      var fileStats = fs.statSync(requestArgs.source);
      var fileSize = fileStats.size;
      var fileStream = fs.createReadStream(requestArgs.source, {
        highWaterMark: 64 * 1024 // 64KB chunks by default
      });
      options.headers['Content-Type'] = 'application/octet-stream';
      options.headers['Content-Length'] = fileSize;
    }


    var request = https.request(url, options, (res) => {
      var rawData = ''
      res.setEncoding('binary')
      res
        .on('data', (data) => {
          rawData += data
        })
        .on('end', () => {
          if (requestArgs.action == 'download') {
            var local_destination = requestArgs.destination
            if (requestArgs.path.endsWith('/')) {
              callback(new Error('[Netstorage Error] Nestorage Path should be a file, not directory'), null, null)
              return
            } else if (local_destination == '') {
              local_destination = path.basename(requestArgs.path)
            } else {
              try {
                if (fs.statSync(local_destination).isDirectory()) {
                  local_destination = path.join(local_destination, path.basename(requestArgs.path))
                }
              } catch (e) { }
            }
            try {
              fs.writeFileSync(local_destination, rawData, 'binary')
            } catch (e) {
              callback(e)
              return
            }
            callback(null, res, { message: 'Download Done.' })
          } else {
            this.parser.parse(rawData, (err, json) => {
              if (requestArgs.action == 'upload' && !rawData && res.statusCode == 200) {
                // For Object Store upload response: {}
                callback(null, res, { message: 'Request Processed.' })
              } else {
                callback(null, res, json)
              }
            })
          }
        })
    })

    request
      .on('error', (err) => {
        callback(err, null, null)
      })

    if (requestArgs.action == 'upload') {
      // Handle file stream errors
      fileStream.on('error', (error) => {
        console.error('File stream error:', error.message);
        req.destroy();
        reject(error);
      });

      // Pipe the file to the request
      fileStream.pipe(request);
    } else {
      request.end();
    }
  }

  validatePath(path) {
    this.path = path
    if (!this.path.startsWith('/')) {
      return escape(`/${this.path}`)
    }
    return escape(this.path)
  }
}

module.exports = Requestor
