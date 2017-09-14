'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _appiumSupport = require('appium-support');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// set up distributed logging before everything else
_appiumSupport.logger.patchLogger(_npmlog2['default']);
global._global_npmlog = _npmlog2['default'];

// npmlog is used only for emitting, we use winston for output
_npmlog2['default'].level = "silent";
var levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1
};

var colors = {
  info: 'cyan',
  debug: 'grey',
  warn: 'yellow',
  error: 'red'
};

var npmToWinstonLevels = {
  silly: 'debug',
  verbose: 'debug',
  debug: 'debug',
  info: 'info',
  http: 'info',
  warn: 'warn',
  error: 'error'
};

var log = null;
var timeZone = null;

function timestamp() {
  var date = new Date();
  if (!timeZone) {
    date = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
  }
  return (0, _dateformat2['default'])(date, "yyyy-mm-dd HH:MM:ss:l");
}

// Strip the color marking within messages.
// We need to patch the transports, because the stripColor functionality in
// Winston is wrongly implemented at the logger level, and we want to avoid
// having to create 2 loggers.
function applyStripColorPatch(transport) {
  var _log = transport.log.bind(transport);
  transport.log = function (level, msg, meta, callback) {
    // eslint-disable-line promise/prefer-await-to-callbacks
    var code = /\u001b\[(\d+(;\d+)*)?m/g;
    msg = ('' + msg).replace(code, '');
    _log(level, msg, meta, callback);
  };
}

function _createConsoleTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.Console({
    name: "console",
    timestamp: args.logTimestamp ? timestamp : undefined,
    colorize: !args.logNoColors,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    formatter: function formatter(options) {
      var meta = options.meta && _Object$keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '';
      var timestampPrefix = '';
      if (options.timestamp) {
        timestampPrefix = options.timestamp() + ' - ';
      }
      return '' + timestampPrefix + (options.message || '') + meta;
    }
  });
  if (args.logNoColors) {
    applyStripColorPatch(transport);
  }

  return transport;
}

function _createFileTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.File({
    name: "file",
    timestamp: timestamp,
    filename: args.log,
    maxFiles: 1,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createHttpTransport(args, logLvl) {
  var host = null,
      port = null;

  if (args.webhook.match(':')) {
    var hostAndPort = args.webhook.split(':');
    host = hostAndPort[0];
    port = parseInt(hostAndPort[1], 10);
  }

  var transport = new _winston2['default'].transports.Http({
    name: "http",
    host: host || '127.0.0.1',
    port: port || 9003,
    path: '/',
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createTransports(args) {
  var transports, consoleLogLevel, fileLogLevel, lvlPair;
  return _regeneratorRuntime.async(function _createTransports$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        transports = [];
        consoleLogLevel = null;
        fileLogLevel = null;

        if (args.loglevel && args.loglevel.match(":")) {
          lvlPair = args.loglevel.split(':');

          consoleLogLevel = lvlPair[0] || consoleLogLevel;
          fileLogLevel = lvlPair[1] || fileLogLevel;
        } else {
          consoleLogLevel = fileLogLevel = args.loglevel;
        }

        transports.push(_createConsoleTransport(args, consoleLogLevel));

        if (!args.log) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.prev = 6;
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(args.log));

      case 9:
        if (!context$1$0.sent) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(args.log));

      case 12:

        transports.push(_createFileTransport(args, fileLogLevel));
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](6);

        // eslint-disable-next-line no-console
        console.log('Tried to attach logging to file ' + args.log + ' but an error ' + ('occurred: ' + context$1$0.t0.message));

      case 18:

        if (args.webhook) {
          try {
            transports.push(_createHttpTransport(args, fileLogLevel));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Tried to attach logging to Http at ' + args.webhook + ' but ' + ('an error occurred: ' + e.message));
          }
        }

        return context$1$0.abrupt('return', transports);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 15]]);
}

function init(args) {
  return _regeneratorRuntime.async(function init$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // set de facto param passed to timestamp function
        timeZone = args.localTimezone;

        // by not adding colors here and not setting 'colorize' in transports
        // when logNoColors === true, console output is fully stripped of color.
        if (!args.logNoColors) {
          _winston2['default'].addColors(colors);
        }

        // clean up in case we have initted before since npmlog is a global
        // object
        clear();

        context$1$0.t0 = _winston2['default'].Logger;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_createTransports(args));

      case 6:
        context$1$0.t1 = context$1$0.sent;
        context$1$0.t2 = {
          transports: context$1$0.t1
        };
        log = new context$1$0.t0(context$1$0.t2);

        // Capture logs emitted via npmlog and pass them through winston
        _npmlog2['default'].on('log', function (logObj) {
          var winstonLevel = npmToWinstonLevels[logObj.level] || 'info';
          var msg = logObj.message;
          if (logObj.prefix) {
            var prefix = '[' + logObj.prefix + ']';
            msg = prefix.magenta + ' ' + msg;
          }
          log[winstonLevel](msg);
          if (args.logHandler && typeof args.logHandler === "function") {
            args.logHandler(logObj.level, msg);
          }
        });

        log.setLevels(levels);

        // 8/19/14 this is a hack to force Winston to print debug messages to stdout rather than stderr.
        // TODO: remove this if winston provides an API for directing streams.
        if (levels[log.transports.console.level] === levels.debug) {
          log.debug = function (msg) {
            log.info('[debug] ' + msg);
          };
        }

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function clear() {
  if (log) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_lodash2['default'].keys(log.transports)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var transport = _step.value;

        log.remove(transport);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  _npmlog2['default'].removeAllListeners('log');
}

exports.init = init;
exports.clear = clear;
exports['default'] = init;

// --log-level arg can optionally provide diff logging levels for console and file, separated by a colon

// if we don't delete the log file, winston will always append and it will grow infinitely large;
// winston allows for limiting log file size, but as of 9.2.14 there's a serious bug when using
// maxFiles and maxSize together. https://github.com/flatiron/winston/issues/397
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2dzaW5rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7O3VCQUNOLFNBQVM7Ozs7NkJBQ0gsZ0JBQWdCOzswQkFDcEIsWUFBWTs7OztzQkFDckIsUUFBUTs7Ozs7QUFHdEIsc0JBQU8sV0FBVyxxQkFBUSxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxjQUFjLHNCQUFTLENBQUM7OztBQUcvQixvQkFBTyxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQ3hCLElBQU0sTUFBTSxHQUFHO0FBQ2IsT0FBSyxFQUFFLENBQUM7QUFDUixNQUFJLEVBQUUsQ0FBQztBQUNQLE1BQUksRUFBRSxDQUFDO0FBQ1AsT0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDOztBQUVGLElBQU0sTUFBTSxHQUFHO0FBQ2IsTUFBSSxFQUFFLE1BQU07QUFDWixPQUFLLEVBQUUsTUFBTTtBQUNiLE1BQUksRUFBRSxRQUFRO0FBQ2QsT0FBSyxFQUFFLEtBQUs7Q0FDYixDQUFDOztBQUVGLElBQU0sa0JBQWtCLEdBQUc7QUFDekIsT0FBSyxFQUFFLE9BQU87QUFDZCxTQUFPLEVBQUUsT0FBTztBQUNoQixPQUFLLEVBQUUsT0FBTztBQUNkLE1BQUksRUFBRSxNQUFNO0FBQ1osTUFBSSxFQUFFLE1BQU07QUFDWixNQUFJLEVBQUUsTUFBTTtBQUNaLE9BQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQzs7QUFFRixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXBCLFNBQVMsU0FBUyxHQUFJO0FBQ3BCLE1BQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdEIsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFFBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7R0FDcEU7QUFDRCxTQUFPLDZCQUFXLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0NBQ2xEOzs7Ozs7QUFNRCxTQUFTLG9CQUFvQixDQUFFLFNBQVMsRUFBRTtBQUN4QyxNQUFJLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxXQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFOztBQUNwRCxRQUFJLElBQUksR0FBRyx5QkFBeUIsQ0FBQztBQUNyQyxPQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFBLENBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDbEMsQ0FBQztDQUNIOztBQUVELFNBQVMsdUJBQXVCLENBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUM5QyxNQUFJLFNBQVMsR0FBRyxJQUFLLHFCQUFRLFVBQVUsQ0FBQyxPQUFPLENBQUU7QUFDL0MsUUFBSSxFQUFFLFNBQVM7QUFDZixhQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLEdBQUcsU0FBUztBQUNwRCxZQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUMzQixvQkFBZ0IsRUFBRSxJQUFJO0FBQ3RCLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLFFBQUksRUFBRSxLQUFLO0FBQ1gsU0FBSyxFQUFFLE1BQU07QUFDYixhQUFTLEVBQUMsbUJBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFLLEVBQUUsQ0FBQztBQUN6RyxVQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDekIsVUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQ3JCLHVCQUFlLEdBQU0sT0FBTyxDQUFDLFNBQVMsRUFBRSxRQUFLLENBQUM7T0FDL0M7QUFDRCxrQkFBVSxlQUFlLElBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUEsR0FBRyxJQUFJLENBQUc7S0FDNUQ7R0FDRixDQUFDLENBQUM7QUFDSCxNQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsd0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDakM7O0FBRUQsU0FBTyxTQUFTLENBQUM7Q0FDbEI7O0FBRUQsU0FBUyxvQkFBb0IsQ0FBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNDLE1BQUksU0FBUyxHQUFHLElBQUsscUJBQVEsVUFBVSxDQUFDLElBQUksQ0FBRTtBQUM1QyxRQUFJLEVBQUUsTUFBTTtBQUNaLGFBQVMsRUFBVCxTQUFTO0FBQ1QsWUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHO0FBQ2xCLFlBQVEsRUFBRSxDQUFDO0FBQ1gsb0JBQWdCLEVBQUUsSUFBSTtBQUN0QixlQUFXLEVBQUUsS0FBSztBQUNsQixRQUFJLEVBQUUsS0FBSztBQUNYLFNBQUssRUFBRSxNQUFNO0dBQ2QsQ0FBQyxDQUFDO0FBQ0gsc0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEMsU0FBTyxTQUFTLENBQUM7Q0FDbEI7O0FBRUQsU0FBUyxvQkFBb0IsQ0FBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNDLE1BQUksSUFBSSxHQUFHLElBQUk7TUFDWCxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixNQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLFFBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLFFBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDckM7O0FBRUQsTUFBSSxTQUFTLEdBQUcsSUFBSyxxQkFBUSxVQUFVLENBQUMsSUFBSSxDQUFFO0FBQzVDLFFBQUksRUFBRSxNQUFNO0FBQ1osUUFBSSxFQUFFLElBQUksSUFBSSxXQUFXO0FBQ3pCLFFBQUksRUFBRSxJQUFJLElBQUksSUFBSTtBQUNsQixRQUFJLEVBQUUsR0FBRztBQUNULG9CQUFnQixFQUFFLElBQUk7QUFDdEIsZUFBVyxFQUFFLEtBQUs7QUFDbEIsUUFBSSxFQUFFLEtBQUs7QUFDWCxTQUFLLEVBQUUsTUFBTTtHQUNkLENBQUMsQ0FBQztBQUNILHNCQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hDLFNBQU8sU0FBUyxDQUFDO0NBQ2xCOztBQUVELFNBQWUsaUJBQWlCLENBQUUsSUFBSTtNQUNoQyxVQUFVLEVBQ1YsZUFBZSxFQUNmLFlBQVksRUFJVixPQUFPOzs7O0FBTlQsa0JBQVUsR0FBRyxFQUFFO0FBQ2YsdUJBQWUsR0FBRyxJQUFJO0FBQ3RCLG9CQUFZLEdBQUcsSUFBSTs7QUFFdkIsWUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBRXpDLGlCQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztBQUN0Qyx5QkFBZSxHQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUM7QUFDakQsc0JBQVksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDO1NBQzNDLE1BQU07QUFDTCx5QkFBZSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2hEOztBQUVELGtCQUFVLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOzthQUU1RCxJQUFJLENBQUMsR0FBRzs7Ozs7Ozt5Q0FLRSxrQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7O3lDQUNyQixrQkFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7OztBQUczQixrQkFBVSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7O0FBRzFELGVBQU8sQ0FBQyxHQUFHLENBQUMscUNBQW1DLElBQUksQ0FBQyxHQUFHLHNDQUM5QixlQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUM7Ozs7QUFJMUMsWUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLGNBQUk7QUFDRixzQkFBVSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztXQUMzRCxDQUFDLE9BQU8sQ0FBQyxFQUFFOztBQUVWLG1CQUFPLENBQUMsR0FBRyxDQUFDLHdDQUFzQyxJQUFJLENBQUMsT0FBTyxzQ0FDNUIsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUM7V0FDaEQ7U0FDRjs7NENBRU0sVUFBVTs7Ozs7OztDQUNsQjs7QUFFRCxTQUFlLElBQUksQ0FBRSxJQUFJOzs7OztBQUV2QixnQkFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7Ozs7QUFJOUIsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckIsK0JBQVEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCOzs7O0FBSUQsYUFBSyxFQUFFLENBQUM7O3lCQUVHLHFCQUFRLE1BQU07O3lDQUNMLGlCQUFpQixDQUFDLElBQUksQ0FBQzs7Ozs7QUFBekMsb0JBQVU7O0FBRFosV0FBRzs7O0FBS0gsNEJBQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFDLE1BQU0sRUFBSztBQUMzQixjQUFJLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDO0FBQzlELGNBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDekIsY0FBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLGdCQUFJLE1BQU0sU0FBTyxNQUFNLENBQUMsTUFBTSxNQUFHLENBQUM7QUFDbEMsZUFBRyxHQUFNLE1BQU0sQ0FBQyxPQUFPLFNBQUksR0FBRyxBQUFFLENBQUM7V0FDbEM7QUFDRCxhQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsY0FBSSxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7QUFDNUQsZ0JBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztXQUNwQztTQUVGLENBQUMsQ0FBQzs7QUFHSCxXQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7O0FBSXRCLFlBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDekQsYUFBRyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUN6QixlQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztXQUM1QixDQUFDO1NBQ0g7Ozs7Ozs7Q0FDRjs7QUFFRCxTQUFTLEtBQUssR0FBSTtBQUNoQixNQUFJLEdBQUcsRUFBRTs7Ozs7O0FBQ1Asd0NBQXNCLG9CQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLDRHQUFFO1lBQXJDLFNBQVM7O0FBQ2hCLFdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDdkI7Ozs7Ozs7Ozs7Ozs7OztHQUNGO0FBQ0Qsc0JBQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDbEM7O1FBR1EsSUFBSSxHQUFKLElBQUk7UUFBRSxLQUFLLEdBQUwsS0FBSztxQkFDTCxJQUFJIiwiZmlsZSI6ImxpYi9sb2dzaW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5wbWxvZyBmcm9tICducG1sb2cnO1xuaW1wb3J0IHdpbnN0b24gIGZyb20gJ3dpbnN0b24nO1xuaW1wb3J0IHsgZnMsIGxvZ2dlciB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCBkYXRlZm9ybWF0IGZyb20gJ2RhdGVmb3JtYXQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuLy8gc2V0IHVwIGRpc3RyaWJ1dGVkIGxvZ2dpbmcgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZVxubG9nZ2VyLnBhdGNoTG9nZ2VyKG5wbWxvZyk7XG5nbG9iYWwuX2dsb2JhbF9ucG1sb2cgPSBucG1sb2c7XG5cbi8vIG5wbWxvZyBpcyB1c2VkIG9ubHkgZm9yIGVtaXR0aW5nLCB3ZSB1c2Ugd2luc3RvbiBmb3Igb3V0cHV0XG5ucG1sb2cubGV2ZWwgPSBcInNpbGVudFwiO1xuY29uc3QgbGV2ZWxzID0ge1xuICBkZWJ1ZzogNCxcbiAgaW5mbzogMyxcbiAgd2FybjogMixcbiAgZXJyb3I6IDEsXG59O1xuXG5jb25zdCBjb2xvcnMgPSB7XG4gIGluZm86ICdjeWFuJyxcbiAgZGVidWc6ICdncmV5JyxcbiAgd2FybjogJ3llbGxvdycsXG4gIGVycm9yOiAncmVkJyxcbn07XG5cbmNvbnN0IG5wbVRvV2luc3RvbkxldmVscyA9IHtcbiAgc2lsbHk6ICdkZWJ1ZycsXG4gIHZlcmJvc2U6ICdkZWJ1ZycsXG4gIGRlYnVnOiAnZGVidWcnLFxuICBpbmZvOiAnaW5mbycsXG4gIGh0dHA6ICdpbmZvJyxcbiAgd2FybjogJ3dhcm4nLFxuICBlcnJvcjogJ2Vycm9yJyxcbn07XG5cbmxldCBsb2cgPSBudWxsO1xubGV0IHRpbWVab25lID0gbnVsbDtcblxuZnVuY3Rpb24gdGltZXN0YW1wICgpIHtcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICBpZiAoIXRpbWVab25lKSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUudmFsdWVPZigpICsgZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDApO1xuICB9XG4gIHJldHVybiBkYXRlZm9ybWF0KGRhdGUsIFwieXl5eS1tbS1kZCBISDpNTTpzczpsXCIpO1xufVxuXG4vLyBTdHJpcCB0aGUgY29sb3IgbWFya2luZyB3aXRoaW4gbWVzc2FnZXMuXG4vLyBXZSBuZWVkIHRvIHBhdGNoIHRoZSB0cmFuc3BvcnRzLCBiZWNhdXNlIHRoZSBzdHJpcENvbG9yIGZ1bmN0aW9uYWxpdHkgaW5cbi8vIFdpbnN0b24gaXMgd3JvbmdseSBpbXBsZW1lbnRlZCBhdCB0aGUgbG9nZ2VyIGxldmVsLCBhbmQgd2Ugd2FudCB0byBhdm9pZFxuLy8gaGF2aW5nIHRvIGNyZWF0ZSAyIGxvZ2dlcnMuXG5mdW5jdGlvbiBhcHBseVN0cmlwQ29sb3JQYXRjaCAodHJhbnNwb3J0KSB7XG4gIGxldCBfbG9nID0gdHJhbnNwb3J0LmxvZy5iaW5kKHRyYW5zcG9ydCk7XG4gIHRyYW5zcG9ydC5sb2cgPSBmdW5jdGlvbiAobGV2ZWwsIG1zZywgbWV0YSwgY2FsbGJhY2spIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcm9taXNlL3ByZWZlci1hd2FpdC10by1jYWxsYmFja3NcbiAgICBsZXQgY29kZSA9IC9cXHUwMDFiXFxbKFxcZCsoO1xcZCspKik/bS9nO1xuICAgIG1zZyA9ICgnJyArIG1zZykucmVwbGFjZShjb2RlLCAnJyk7XG4gICAgX2xvZyhsZXZlbCwgbXNnLCBtZXRhLCBjYWxsYmFjayk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDb25zb2xlVHJhbnNwb3J0IChhcmdzLCBsb2dMdmwpIHtcbiAgbGV0IHRyYW5zcG9ydCA9IG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUpKHtcbiAgICBuYW1lOiBcImNvbnNvbGVcIixcbiAgICB0aW1lc3RhbXA6IGFyZ3MubG9nVGltZXN0YW1wID8gdGltZXN0YW1wIDogdW5kZWZpbmVkLFxuICAgIGNvbG9yaXplOiAhYXJncy5sb2dOb0NvbG9ycyxcbiAgICBoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuICAgIGV4aXRPbkVycm9yOiBmYWxzZSxcbiAgICBqc29uOiBmYWxzZSxcbiAgICBsZXZlbDogbG9nTHZsLFxuICAgIGZvcm1hdHRlciAob3B0aW9ucykge1xuICAgICAgbGV0IG1ldGEgPSBvcHRpb25zLm1ldGEgJiYgT2JqZWN0LmtleXMob3B0aW9ucy5tZXRhKS5sZW5ndGggPyBgXFxuXFx0JHtKU09OLnN0cmluZ2lmeShvcHRpb25zLm1ldGEpfWAgOiAnJztcbiAgICAgIGxldCB0aW1lc3RhbXBQcmVmaXggPSAnJztcbiAgICAgIGlmIChvcHRpb25zLnRpbWVzdGFtcCkge1xuICAgICAgICB0aW1lc3RhbXBQcmVmaXggPSBgJHtvcHRpb25zLnRpbWVzdGFtcCgpfSAtIGA7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7dGltZXN0YW1wUHJlZml4fSR7b3B0aW9ucy5tZXNzYWdlIHx8ICcnfSR7bWV0YX1gO1xuICAgIH1cbiAgfSk7XG4gIGlmIChhcmdzLmxvZ05vQ29sb3JzKSB7XG4gICAgYXBwbHlTdHJpcENvbG9yUGF0Y2godHJhbnNwb3J0KTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc3BvcnQ7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVGaWxlVHJhbnNwb3J0IChhcmdzLCBsb2dMdmwpIHtcbiAgbGV0IHRyYW5zcG9ydCA9IG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkZpbGUpKHtcbiAgICBuYW1lOiBcImZpbGVcIixcbiAgICB0aW1lc3RhbXAsXG4gICAgZmlsZW5hbWU6IGFyZ3MubG9nLFxuICAgIG1heEZpbGVzOiAxLFxuICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG4gICAgZXhpdE9uRXJyb3I6IGZhbHNlLFxuICAgIGpzb246IGZhbHNlLFxuICAgIGxldmVsOiBsb2dMdmwsXG4gIH0pO1xuICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xuICByZXR1cm4gdHJhbnNwb3J0O1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlSHR0cFRyYW5zcG9ydCAoYXJncywgbG9nTHZsKSB7XG4gIGxldCBob3N0ID0gbnVsbCxcbiAgICAgIHBvcnQgPSBudWxsO1xuXG4gIGlmIChhcmdzLndlYmhvb2subWF0Y2goJzonKSkge1xuICAgIGxldCBob3N0QW5kUG9ydCA9IGFyZ3Mud2ViaG9vay5zcGxpdCgnOicpO1xuICAgIGhvc3QgPSBob3N0QW5kUG9ydFswXTtcbiAgICBwb3J0ID0gcGFyc2VJbnQoaG9zdEFuZFBvcnRbMV0sIDEwKTtcbiAgfVxuXG4gIGxldCB0cmFuc3BvcnQgPSBuZXcgKHdpbnN0b24udHJhbnNwb3J0cy5IdHRwKSh7XG4gICAgbmFtZTogXCJodHRwXCIsXG4gICAgaG9zdDogaG9zdCB8fCAnMTI3LjAuMC4xJyxcbiAgICBwb3J0OiBwb3J0IHx8IDkwMDMsXG4gICAgcGF0aDogJy8nLFxuICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG4gICAgZXhpdE9uRXJyb3I6IGZhbHNlLFxuICAgIGpzb246IGZhbHNlLFxuICAgIGxldmVsOiBsb2dMdmwsXG4gIH0pO1xuICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xuICByZXR1cm4gdHJhbnNwb3J0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBfY3JlYXRlVHJhbnNwb3J0cyAoYXJncykge1xuICBsZXQgdHJhbnNwb3J0cyA9IFtdO1xuICBsZXQgY29uc29sZUxvZ0xldmVsID0gbnVsbDtcbiAgbGV0IGZpbGVMb2dMZXZlbCA9IG51bGw7XG5cbiAgaWYgKGFyZ3MubG9nbGV2ZWwgJiYgYXJncy5sb2dsZXZlbC5tYXRjaChcIjpcIikpIHtcbiAgICAvLyAtLWxvZy1sZXZlbCBhcmcgY2FuIG9wdGlvbmFsbHkgcHJvdmlkZSBkaWZmIGxvZ2dpbmcgbGV2ZWxzIGZvciBjb25zb2xlIGFuZCBmaWxlLCBzZXBhcmF0ZWQgYnkgYSBjb2xvblxuICAgIGxldCBsdmxQYWlyID0gYXJncy5sb2dsZXZlbC5zcGxpdCgnOicpO1xuICAgIGNvbnNvbGVMb2dMZXZlbCA9ICBsdmxQYWlyWzBdIHx8IGNvbnNvbGVMb2dMZXZlbDtcbiAgICBmaWxlTG9nTGV2ZWwgPSBsdmxQYWlyWzFdIHx8IGZpbGVMb2dMZXZlbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlTG9nTGV2ZWwgPSBmaWxlTG9nTGV2ZWwgPSBhcmdzLmxvZ2xldmVsO1xuICB9XG5cbiAgdHJhbnNwb3J0cy5wdXNoKF9jcmVhdGVDb25zb2xlVHJhbnNwb3J0KGFyZ3MsIGNvbnNvbGVMb2dMZXZlbCkpO1xuXG4gIGlmIChhcmdzLmxvZykge1xuICAgIHRyeSB7XG4gICAgICAvLyBpZiB3ZSBkb24ndCBkZWxldGUgdGhlIGxvZyBmaWxlLCB3aW5zdG9uIHdpbGwgYWx3YXlzIGFwcGVuZCBhbmQgaXQgd2lsbCBncm93IGluZmluaXRlbHkgbGFyZ2U7XG4gICAgICAvLyB3aW5zdG9uIGFsbG93cyBmb3IgbGltaXRpbmcgbG9nIGZpbGUgc2l6ZSwgYnV0IGFzIG9mIDkuMi4xNCB0aGVyZSdzIGEgc2VyaW91cyBidWcgd2hlbiB1c2luZ1xuICAgICAgLy8gbWF4RmlsZXMgYW5kIG1heFNpemUgdG9nZXRoZXIuIGh0dHBzOi8vZ2l0aHViLmNvbS9mbGF0aXJvbi93aW5zdG9uL2lzc3Vlcy8zOTdcbiAgICAgIGlmIChhd2FpdCBmcy5leGlzdHMoYXJncy5sb2cpKSB7XG4gICAgICAgIGF3YWl0IGZzLnVubGluayhhcmdzLmxvZyk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zcG9ydHMucHVzaChfY3JlYXRlRmlsZVRyYW5zcG9ydChhcmdzLCBmaWxlTG9nTGV2ZWwpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coYFRyaWVkIHRvIGF0dGFjaCBsb2dnaW5nIHRvIGZpbGUgJHthcmdzLmxvZ30gYnV0IGFuIGVycm9yIGAgK1xuICAgICAgICAgICAgICAgICAgYG9jY3VycmVkOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoYXJncy53ZWJob29rKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRyYW5zcG9ydHMucHVzaChfY3JlYXRlSHR0cFRyYW5zcG9ydChhcmdzLCBmaWxlTG9nTGV2ZWwpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coYFRyaWVkIHRvIGF0dGFjaCBsb2dnaW5nIHRvIEh0dHAgYXQgJHthcmdzLndlYmhvb2t9IGJ1dCBgICtcbiAgICAgICAgICAgICAgICAgIGBhbiBlcnJvciBvY2N1cnJlZDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRyYW5zcG9ydHM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXQgKGFyZ3MpIHtcbiAgLy8gc2V0IGRlIGZhY3RvIHBhcmFtIHBhc3NlZCB0byB0aW1lc3RhbXAgZnVuY3Rpb25cbiAgdGltZVpvbmUgPSBhcmdzLmxvY2FsVGltZXpvbmU7XG5cbiAgLy8gYnkgbm90IGFkZGluZyBjb2xvcnMgaGVyZSBhbmQgbm90IHNldHRpbmcgJ2NvbG9yaXplJyBpbiB0cmFuc3BvcnRzXG4gIC8vIHdoZW4gbG9nTm9Db2xvcnMgPT09IHRydWUsIGNvbnNvbGUgb3V0cHV0IGlzIGZ1bGx5IHN0cmlwcGVkIG9mIGNvbG9yLlxuICBpZiAoIWFyZ3MubG9nTm9Db2xvcnMpIHtcbiAgICB3aW5zdG9uLmFkZENvbG9ycyhjb2xvcnMpO1xuICB9XG5cbiAgLy8gY2xlYW4gdXAgaW4gY2FzZSB3ZSBoYXZlIGluaXR0ZWQgYmVmb3JlIHNpbmNlIG5wbWxvZyBpcyBhIGdsb2JhbFxuICAvLyBvYmplY3RcbiAgY2xlYXIoKTtcblxuICBsb2cgPSBuZXcgKHdpbnN0b24uTG9nZ2VyKSh7XG4gICAgdHJhbnNwb3J0czogYXdhaXQgX2NyZWF0ZVRyYW5zcG9ydHMoYXJncylcbiAgfSk7XG5cbiAgLy8gQ2FwdHVyZSBsb2dzIGVtaXR0ZWQgdmlhIG5wbWxvZyBhbmQgcGFzcyB0aGVtIHRocm91Z2ggd2luc3RvblxuICBucG1sb2cub24oJ2xvZycsIChsb2dPYmopID0+IHtcbiAgICBsZXQgd2luc3RvbkxldmVsID0gbnBtVG9XaW5zdG9uTGV2ZWxzW2xvZ09iai5sZXZlbF0gfHwgJ2luZm8nO1xuICAgIGxldCBtc2cgPSBsb2dPYmoubWVzc2FnZTtcbiAgICBpZiAobG9nT2JqLnByZWZpeCkge1xuICAgICAgbGV0IHByZWZpeCA9IGBbJHtsb2dPYmoucHJlZml4fV1gO1xuICAgICAgbXNnID0gYCR7cHJlZml4Lm1hZ2VudGF9ICR7bXNnfWA7XG4gICAgfVxuICAgIGxvZ1t3aW5zdG9uTGV2ZWxdKG1zZyk7XG4gICAgaWYgKGFyZ3MubG9nSGFuZGxlciAmJiB0eXBlb2YgYXJncy5sb2dIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGFyZ3MubG9nSGFuZGxlcihsb2dPYmoubGV2ZWwsIG1zZyk7XG4gICAgfVxuXG4gIH0pO1xuXG5cbiAgbG9nLnNldExldmVscyhsZXZlbHMpO1xuXG4gIC8vIDgvMTkvMTQgdGhpcyBpcyBhIGhhY2sgdG8gZm9yY2UgV2luc3RvbiB0byBwcmludCBkZWJ1ZyBtZXNzYWdlcyB0byBzdGRvdXQgcmF0aGVyIHRoYW4gc3RkZXJyLlxuICAvLyBUT0RPOiByZW1vdmUgdGhpcyBpZiB3aW5zdG9uIHByb3ZpZGVzIGFuIEFQSSBmb3IgZGlyZWN0aW5nIHN0cmVhbXMuXG4gIGlmIChsZXZlbHNbbG9nLnRyYW5zcG9ydHMuY29uc29sZS5sZXZlbF0gPT09IGxldmVscy5kZWJ1Zykge1xuICAgIGxvZy5kZWJ1ZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgIGxvZy5pbmZvKCdbZGVidWddICcgKyBtc2cpO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xlYXIgKCkge1xuICBpZiAobG9nKSB7XG4gICAgZm9yIChsZXQgdHJhbnNwb3J0IG9mIF8ua2V5cyhsb2cudHJhbnNwb3J0cykpIHtcbiAgICAgIGxvZy5yZW1vdmUodHJhbnNwb3J0KTtcbiAgICB9XG4gIH1cbiAgbnBtbG9nLnJlbW92ZUFsbExpc3RlbmVycygnbG9nJyk7XG59XG5cblxuZXhwb3J0IHsgaW5pdCwgY2xlYXIgfTtcbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
