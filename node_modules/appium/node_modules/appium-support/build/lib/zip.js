'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _extractZip = require('extract-zip');

var _extractZip2 = _interopRequireDefault(_extractZip);

var _yauzl = require('yauzl');

var _yauzl2 = _interopRequireDefault(_yauzl);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libMkdirp = require('../lib/mkdirp');

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var extract = _bluebird2['default'].promisify(_extractZip2['default']);
var open = _bluebird2['default'].promisify(_yauzl2['default'].open);

/**
 * Extract zipfile to a directory
 * @param {string} zipFilepath
 * @param {string} destDir
 */
function extractAllTo(zipFilepath, destDir) {
  return _regeneratorRuntime.async(function extractAllTo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(extract(zipFilepath, { dir: destDir }));

      case 2:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Extract a single zip entry to a directory
 * @param {Streamable} zipfile
 * @param {Object} entry
 * @param {str} destDir
 */
function _extractEntryTo(zipfile, entry, destDir) {
  var writeStream, writeStreamPromise, zipReadStream, zipReadStreamPromise;
  return _regeneratorRuntime.async(function _extractEntryTo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _libMkdirp.mkdirp)(_path2['default'].resolve(destDir, _path2['default'].dirname(entry.fileName))));

      case 2:
        writeStream = (0, _fs.createWriteStream)(_path2['default'].resolve(destDir, entry.fileName), { flags: 'w' });
        writeStreamPromise = new _bluebird2['default'](function (resolve, reject) {
          writeStream.once('finish', resolve);
          writeStream.once('error', reject);
        });
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(new _bluebird2['default'](function (resolve, reject) {
          zipfile.openReadStream(entry, function (err, readStream) {
            return err ? reject(err) : resolve(readStream);
          });
        }));

      case 6:
        zipReadStream = context$1$0.sent;
        zipReadStreamPromise = new _bluebird2['default'](function (resolve, reject) {
          zipReadStream.once('end', resolve);
          zipReadStream.once('error', reject);
        });

        zipReadStream.pipe(writeStream);

        // Wait for the zipReadStream and writeStream to end before returning
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(_bluebird2['default'].all([zipReadStreamPromise, writeStreamPromise]));

      case 11:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Get entries for a zip folder
 * @param {string} srcDir
 * @param {function} onEntry Callback when entry is read
 * @param {function} onError Callback when error occurs
 */
function readEntries(zipFilepath, onEntry) {
  var zipfile, zipReadStreamPromise;
  return _regeneratorRuntime.async(function readEntries$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(open(zipFilepath, { lazyEntries: true }));

      case 2:
        zipfile = context$1$0.sent;
        zipReadStreamPromise = new _bluebird2['default'](function (resolve, reject) {
          zipfile.once('end', resolve);
          zipfile.once('error', reject);

          // On each entry, call 'onEntry' and then read the next entry
          zipfile.on('entry', function callee$2$0(entry) {
            var res;
            return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
              while (1) switch (context$3$0.prev = context$3$0.next) {
                case 0:
                  context$3$0.next = 2;
                  return _regeneratorRuntime.awrap(onEntry({ entry: entry, extractEntryTo: function extractEntryTo(destDir) {
                      return _extractEntryTo(zipfile, entry, destDir);
                    } }));

                case 2:
                  res = context$3$0.sent;

                  if (!(res === false)) {
                    context$3$0.next = 5;
                    break;
                  }

                  return context$3$0.abrupt('return', zipfile.emit('end'));

                case 5:
                  zipfile.readEntry();

                case 6:
                case 'end':
                  return context$3$0.stop();
              }
            }, null, _this);
          });
        });

        zipfile.readEntry();

        // Wait for the entries to finish being iterated through
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(zipReadStreamPromise);

      case 7:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Converts contents of local directory to an in-memory .zip buffer
 * @param {*} srcDir
 */
function toInMemoryZip(srcDir) {
  var zipBufferArr, zipWriteStream, zipWriteStreamPromise, archive, archiveStreamPromise;
  return _regeneratorRuntime.async(function toInMemoryZip$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        zipBufferArr = [];
        zipWriteStream = new _stream2['default'].Writable({
          write: function write(buffer, encoding, next) {
            zipBufferArr.push(buffer);
            next();
          }
        });
        zipWriteStreamPromise = new _bluebird2['default'](function (resolve) {
          // Don't need to do error handling since this writeStream is in-memory and doesn't emit any errors
          zipWriteStream.once('finish', resolve);
        });
        archive = (0, _archiver2['default'])('zip', {
          zlib: { level: 9 }
        });
        archiveStreamPromise = new _bluebird2['default'](function (resolve, reject) {
          archive.once('finish', resolve);
          archive.once('error', function (errStr) {
            return reject(new Error('Failed to zip directory ' + srcDir + ': ' + errStr));
          });
        });

        archive.directory(srcDir, false);
        archive.pipe(zipWriteStream);
        archive.finalize();

        // Wait for the streams to finish
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(_bluebird2['default'].all([archiveStreamPromise, zipWriteStreamPromise]));

      case 10:
        return context$1$0.abrupt('return', Buffer.concat(zipBufferArr));

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

exports.extractAllTo = extractAllTo;
exports.readEntries = readEntries;
exports.toInMemoryZip = toInMemoryZip;
exports._extractEntryTo = _extractEntryTo;
exports['default'] = { extractAllTo: extractAllTo, readEntries: readEntries, toInMemoryZip: toInMemoryZip };

// Create dest directory if doesn't exist already

// Create a write stream

// Create zipReadStream and pipe data to the write stream
// (for some odd reason B.promisify doesn't work on zipfile.openReadStream, it causes an error 'closed')

// Open a zip file and start reading entries

// Create a writable stream that zip buffers will be streamed to

// Zip 'srcDir' and stream it to the above writable stream

// Return the array of zip buffers concatenated into one buffer
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUEsQ0FBQyxDQUFDO1NBQ3RHLENBQUM7O0FBQ0YsZUFBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDakMsZUFBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM3QixlQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7Ozs7eUNBR2Isc0JBQUUsR0FBRyxDQUFDLENBQUMsb0JBQW9CLEVBQUUscUJBQXFCLENBQUMsQ0FBQzs7OzRDQUduRCxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzs7Ozs7OztDQUNuQzs7UUFFUSxZQUFZLEdBQVosWUFBWTtRQUFFLFdBQVcsR0FBWCxXQUFXO1FBQUUsYUFBYSxHQUFiLGFBQWE7UUFBRSxlQUFlLEdBQWYsZUFBZTtxQkFDbkQsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsYUFBYSxFQUFiLGFBQWEsRUFBRSIsImZpbGUiOiJsaWIvemlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IG5vZGVFeHRyYWN0IGZyb20gJ2V4dHJhY3QtemlwJztcbmltcG9ydCB5YXV6bCBmcm9tICd5YXV6bCc7XG5pbXBvcnQgYXJjaGl2ZXIgZnJvbSAnYXJjaGl2ZXInO1xuaW1wb3J0IHsgY3JlYXRlV3JpdGVTdHJlYW0gfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IG1rZGlycCB9IGZyb20gJy4uL2xpYi9ta2RpcnAnO1xuaW1wb3J0IHN0cmVhbSBmcm9tICdzdHJlYW0nO1xuXG5jb25zdCBleHRyYWN0ID0gQi5wcm9taXNpZnkobm9kZUV4dHJhY3QpO1xuY29uc3Qgb3BlbiA9IEIucHJvbWlzaWZ5KHlhdXpsLm9wZW4pO1xuXG4vKipcbiAqIEV4dHJhY3QgemlwZmlsZSB0byBhIGRpcmVjdG9yeVxuICogQHBhcmFtIHtzdHJpbmd9IHppcEZpbGVwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzdERpclxuICovXG5hc3luYyBmdW5jdGlvbiBleHRyYWN0QWxsVG8gKHppcEZpbGVwYXRoLCBkZXN0RGlyKSB7XG4gIHJldHVybiBhd2FpdCBleHRyYWN0KHppcEZpbGVwYXRoLCB7ZGlyOiBkZXN0RGlyfSk7XG59XG5cbi8qKlxuICogRXh0cmFjdCBhIHNpbmdsZSB6aXAgZW50cnkgdG8gYSBkaXJlY3RvcnlcbiAqIEBwYXJhbSB7U3RyZWFtYWJsZX0gemlwZmlsZVxuICogQHBhcmFtIHtPYmplY3R9IGVudHJ5XG4gKiBAcGFyYW0ge3N0cn0gZGVzdERpclxuICovXG5hc3luYyBmdW5jdGlvbiBfZXh0cmFjdEVudHJ5VG8gKHppcGZpbGUsIGVudHJ5LCBkZXN0RGlyKSB7XG5cbiAgLy8gQ3JlYXRlIGRlc3QgZGlyZWN0b3J5IGlmIGRvZXNuJ3QgZXhpc3QgYWxyZWFkeVxuICBhd2FpdCBta2RpcnAocGF0aC5yZXNvbHZlKGRlc3REaXIsIHBhdGguZGlybmFtZShlbnRyeS5maWxlTmFtZSkpKTtcblxuICAvLyBDcmVhdGUgYSB3cml0ZSBzdHJlYW1cbiAgY29uc3Qgd3JpdGVTdHJlYW0gPSBjcmVhdGVXcml0ZVN0cmVhbShwYXRoLnJlc29sdmUoZGVzdERpciwgZW50cnkuZmlsZU5hbWUpLCB7ZmxhZ3M6ICd3J30pO1xuICBjb25zdCB3cml0ZVN0cmVhbVByb21pc2UgPSBuZXcgQigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd3JpdGVTdHJlYW0ub25jZSgnZmluaXNoJywgcmVzb2x2ZSk7XG4gICAgd3JpdGVTdHJlYW0ub25jZSgnZXJyb3InLCByZWplY3QpO1xuICB9KTtcblxuICAvLyBDcmVhdGUgemlwUmVhZFN0cmVhbSBhbmQgcGlwZSBkYXRhIHRvIHRoZSB3cml0ZSBzdHJlYW1cbiAgLy8gKGZvciBzb21lIG9kZCByZWFzb24gQi5wcm9taXNpZnkgZG9lc24ndCB3b3JrIG9uIHppcGZpbGUub3BlblJlYWRTdHJlYW0sIGl0IGNhdXNlcyBhbiBlcnJvciAnY2xvc2VkJylcbiAgY29uc3QgemlwUmVhZFN0cmVhbSA9IGF3YWl0IG5ldyBCKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB6aXBmaWxlLm9wZW5SZWFkU3RyZWFtKGVudHJ5LCAoZXJyLCByZWFkU3RyZWFtKSA9PiBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUocmVhZFN0cmVhbSkpO1xuICB9KTtcbiAgY29uc3QgemlwUmVhZFN0cmVhbVByb21pc2UgPSBuZXcgQigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgemlwUmVhZFN0cmVhbS5vbmNlKCdlbmQnLCByZXNvbHZlKTtcbiAgICB6aXBSZWFkU3RyZWFtLm9uY2UoJ2Vycm9yJywgcmVqZWN0KTtcbiAgfSk7XG4gIHppcFJlYWRTdHJlYW0ucGlwZSh3cml0ZVN0cmVhbSk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIHppcFJlYWRTdHJlYW0gYW5kIHdyaXRlU3RyZWFtIHRvIGVuZCBiZWZvcmUgcmV0dXJuaW5nXG4gIHJldHVybiBhd2FpdCBCLmFsbChbXG4gICAgemlwUmVhZFN0cmVhbVByb21pc2UsXG4gICAgd3JpdGVTdHJlYW1Qcm9taXNlLFxuICBdKTtcbn1cblxuLyoqXG4gKiBHZXQgZW50cmllcyBmb3IgYSB6aXAgZm9sZGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3JjRGlyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVudHJ5IENhbGxiYWNrIHdoZW4gZW50cnkgaXMgcmVhZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25FcnJvciBDYWxsYmFjayB3aGVuIGVycm9yIG9jY3Vyc1xuICovXG5hc3luYyBmdW5jdGlvbiByZWFkRW50cmllcyAoemlwRmlsZXBhdGgsIG9uRW50cnkpIHtcblxuICAvLyBPcGVuIGEgemlwIGZpbGUgYW5kIHN0YXJ0IHJlYWRpbmcgZW50cmllc1xuICBjb25zdCB6aXBmaWxlID0gYXdhaXQgb3Blbih6aXBGaWxlcGF0aCwge2xhenlFbnRyaWVzOiB0cnVlfSk7XG4gIGNvbnN0IHppcFJlYWRTdHJlYW1Qcm9taXNlID0gbmV3IEIoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHppcGZpbGUub25jZSgnZW5kJywgcmVzb2x2ZSk7XG4gICAgemlwZmlsZS5vbmNlKCdlcnJvcicsIHJlamVjdCk7XG5cbiAgICAvLyBPbiBlYWNoIGVudHJ5LCBjYWxsICdvbkVudHJ5JyBhbmQgdGhlbiByZWFkIHRoZSBuZXh0IGVudHJ5XG4gICAgemlwZmlsZS5vbignZW50cnknLCBhc3luYyAoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9uRW50cnkoe2VudHJ5LCBleHRyYWN0RW50cnlUbzogKGRlc3REaXIpID0+IF9leHRyYWN0RW50cnlUbyh6aXBmaWxlLCBlbnRyeSwgZGVzdERpcil9KTtcbiAgICAgIGlmIChyZXMgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB6aXBmaWxlLmVtaXQoJ2VuZCcpO1xuICAgICAgfVxuICAgICAgemlwZmlsZS5yZWFkRW50cnkoKTtcbiAgICB9KTtcbiAgfSk7XG4gIHppcGZpbGUucmVhZEVudHJ5KCk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIGVudHJpZXMgdG8gZmluaXNoIGJlaW5nIGl0ZXJhdGVkIHRocm91Z2hcbiAgcmV0dXJuIGF3YWl0IHppcFJlYWRTdHJlYW1Qcm9taXNlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGNvbnRlbnRzIG9mIGxvY2FsIGRpcmVjdG9yeSB0byBhbiBpbi1tZW1vcnkgLnppcCBidWZmZXJcbiAqIEBwYXJhbSB7Kn0gc3JjRGlyXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHRvSW5NZW1vcnlaaXAgKHNyY0Rpcikge1xuXG4gIC8vIENyZWF0ZSBhIHdyaXRhYmxlIHN0cmVhbSB0aGF0IHppcCBidWZmZXJzIHdpbGwgYmUgc3RyZWFtZWQgdG9cbiAgY29uc3QgemlwQnVmZmVyQXJyID0gW107XG4gIGNvbnN0IHppcFdyaXRlU3RyZWFtID0gbmV3IHN0cmVhbS5Xcml0YWJsZSh7XG4gICAgd3JpdGU6IChidWZmZXIsIGVuY29kaW5nLCBuZXh0KSA9PiB7XG4gICAgICB6aXBCdWZmZXJBcnIucHVzaChidWZmZXIpO1xuICAgICAgbmV4dCgpO1xuICAgIH0sXG4gIH0pO1xuICBjb25zdCB6aXBXcml0ZVN0cmVhbVByb21pc2UgPSBuZXcgQigocmVzb2x2ZSkgPT4ge1xuICAgIC8vIERvbid0IG5lZWQgdG8gZG8gZXJyb3IgaGFuZGxpbmcgc2luY2UgdGhpcyB3cml0ZVN0cmVhbSBpcyBpbi1tZW1vcnkgYW5kIGRvZXNuJ3QgZW1pdCBhbnkgZXJyb3JzXG4gICAgemlwV3JpdGVTdHJlYW0ub25jZSgnZmluaXNoJywgcmVzb2x2ZSk7XG4gIH0pO1xuXG4gIC8vIFppcCAnc3JjRGlyJyBhbmQgc3RyZWFtIGl0IHRvIHRoZSBhYm92ZSB3cml0YWJsZSBzdHJlYW1cbiAgY29uc3QgYXJjaGl2ZSA9IGFyY2hpdmVyKCd6aXAnLCB7XG4gICAgemxpYjoge2xldmVsOiA5fVxuICB9KTtcbiAgY29uc3QgYXJjaGl2ZVN0cmVhbVByb21pc2UgPSBuZXcgQigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgYXJjaGl2ZS5vbmNlKCdmaW5pc2gnLCByZXNvbHZlKTtcbiAgICBhcmNoaXZlLm9uY2UoJ2Vycm9yJywgKGVyclN0cikgPT4gcmVqZWN0KG5ldyBFcnJvcihgRmFpbGVkIHRvIHppcCBkaXJlY3RvcnkgJHtzcmNEaXJ9OiAke2VyclN0cn1gKSkpO1xuICB9KTtcbiAgYXJjaGl2ZS5kaXJlY3Rvcnkoc3JjRGlyLCBmYWxzZSk7XG4gIGFyY2hpdmUucGlwZSh6aXBXcml0ZVN0cmVhbSk7XG4gIGFyY2hpdmUuZmluYWxpemUoKTtcblxuICAvLyBXYWl0IGZvciB0aGUgc3RyZWFtcyB0byBmaW5pc2hcbiAgYXdhaXQgQi5hbGwoW2FyY2hpdmVTdHJlYW1Qcm9taXNlLCB6aXBXcml0ZVN0cmVhbVByb21pc2VdKTtcblxuICAvLyBSZXR1cm4gdGhlIGFycmF5IG9mIHppcCBidWZmZXJzIGNvbmNhdGVuYXRlZCBpbnRvIG9uZSBidWZmZXJcbiAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoemlwQnVmZmVyQXJyKTtcbn1cblxuZXhwb3J0IHsgZXh0cmFjdEFsbFRvLCByZWFkRW50cmllcywgdG9Jbk1lbW9yeVppcCwgX2V4dHJhY3RFbnRyeVRvIH07XG5leHBvcnQgZGVmYXVsdCB7IGV4dHJhY3RBbGxUbywgcmVhZEVudHJpZXMsIHRvSW5NZW1vcnlaaXAgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
