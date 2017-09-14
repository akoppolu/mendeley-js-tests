'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumBaseDriver = require('appium-base-driver');

var _driver = require('./driver');

var _driver2 = _interopRequireDefault(_driver);

function startServer(port, host) {
  var d, router, server;
  return _regeneratorRuntime.async(function startServer$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        d = new _driver2['default']();
        router = (0, _appiumBaseDriver.routeConfiguringFunction)(d);
        server = (0, _appiumBaseDriver.server)(router, port, host);

        _logger2['default'].info('AndroidDriver server listening on http://' + host + ':' + port);
        return context$1$0.abrupt('return', server);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

exports.startServer = startServer;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFBZ0IsVUFBVTs7OztnQ0FDcUMsb0JBQW9COztzQkFDekQsVUFBVTs7OztBQUdwQyxTQUFlLFdBQVcsQ0FBRSxJQUFJLEVBQUUsSUFBSTtNQUNoQyxDQUFDLEVBQ0QsTUFBTSxFQUNOLE1BQU07Ozs7QUFGTixTQUFDLEdBQUcseUJBQW1CO0FBQ3ZCLGNBQU0sR0FBRyxnREFBeUIsQ0FBQyxDQUFDO0FBQ3BDLGNBQU0sR0FBRyw4QkFBVyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQzs7QUFDM0MsNEJBQUksSUFBSSwrQ0FBNkMsSUFBSSxTQUFJLElBQUksQ0FBRyxDQUFDOzRDQUM5RCxNQUFNOzs7Ozs7O0NBQ2Q7O1FBRVEsV0FBVyxHQUFYLFdBQVciLCJmaWxlIjoibGliL3NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgc2VydmVyIGFzIGJhc2VTZXJ2ZXIsIHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbiB9IGZyb20gJ2FwcGl1bS1iYXNlLWRyaXZlcic7XG5pbXBvcnQgQW5kcm9pZERyaXZlciBmcm9tICcuL2RyaXZlcic7XG5cblxuYXN5bmMgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIgKHBvcnQsIGhvc3QpIHtcbiAgbGV0IGQgPSBuZXcgQW5kcm9pZERyaXZlcigpO1xuICBsZXQgcm91dGVyID0gcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uKGQpO1xuICBsZXQgc2VydmVyID0gYmFzZVNlcnZlcihyb3V0ZXIsIHBvcnQsIGhvc3QpO1xuICBsb2cuaW5mbyhgQW5kcm9pZERyaXZlciBzZXJ2ZXIgbGlzdGVuaW5nIG9uIGh0dHA6Ly8ke2hvc3R9OiR7cG9ydH1gKTtcbiAgcmV0dXJuIHNlcnZlcjtcbn1cblxuZXhwb3J0IHsgc3RhcnRTZXJ2ZXIgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
