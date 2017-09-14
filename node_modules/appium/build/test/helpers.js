'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var TEST_HOST = 'localhost';
var TEST_PORT = 4723;
var TEST_FAKE_APP = _path2['default'].resolve(__dirname, "..", "..", "node_modules", "appium-fake-driver", "test", "fixtures", "app.xml");

function initSession(caps) {
  var _this = this;

  var resolve = function resolve() {};
  var driver = undefined;
  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          driver = _wd2['default'].promiseChainRemote({ host: TEST_HOST, port: TEST_PORT });
          resolve(driver);
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap(driver.init(caps));

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(driver.quit());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  return new _bluebird2['default'](function (_resolve) {
    resolve = _resolve;
  });
}

exports.initSession = initSession;
exports.TEST_FAKE_APP = TEST_FAKE_APP;
exports.TEST_HOST = TEST_HOST;
exports.TEST_PORT = TEST_PORT;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUFpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7d0JBQ0wsVUFBVTs7OztBQUV4QixJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFDOUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLElBQU0sYUFBYSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQ3JDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQ3hDLFNBQVMsQ0FBQyxDQUFDOztBQUU5QyxTQUFTLFdBQVcsQ0FBRSxJQUFJLEVBQUU7OztBQUMxQixNQUFJLE9BQU8sR0FBRyxtQkFBTSxFQUFFLENBQUM7QUFDdkIsTUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLFFBQU0sQ0FBQzs7OztBQUNMLGdCQUFNLEdBQUcsZ0JBQUcsa0JBQWtCLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ25FLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7OzJDQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7Ozs7O0dBQ3hCLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQzs7Ozs7MkNBQ0UsTUFBTSxDQUFDLElBQUksRUFBRTs7Ozs7OztHQUNwQixDQUFDLENBQUM7QUFDSCxTQUFPLDBCQUFNLFVBQUMsUUFBUSxFQUFLO0FBQ3pCLFdBQU8sR0FBRyxRQUFRLENBQUM7R0FDcEIsQ0FBQyxDQUFDO0NBQ0o7O1FBRVEsV0FBVyxHQUFYLFdBQVc7UUFBRSxhQUFhLEdBQWIsYUFBYTtRQUFFLFNBQVMsR0FBVCxTQUFTO1FBQUUsU0FBUyxHQUFULFNBQVMiLCJmaWxlIjoidGVzdC9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgd2QgZnJvbSAnd2QnO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuXG5jb25zdCBURVNUX0hPU1QgPSAnbG9jYWxob3N0JztcbmNvbnN0IFRFU1RfUE9SVCA9IDQ3MjM7XG5jb25zdCBURVNUX0ZBS0VfQVBQID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIFwibm9kZV9tb2R1bGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXBwaXVtLWZha2UtZHJpdmVyXCIsIFwidGVzdFwiLCBcImZpeHR1cmVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXBwLnhtbFwiKTtcblxuZnVuY3Rpb24gaW5pdFNlc3Npb24gKGNhcHMpIHtcbiAgbGV0IHJlc29sdmUgPSAoKSA9PiB7fTtcbiAgbGV0IGRyaXZlcjtcbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBkcml2ZXIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoe2hvc3Q6IFRFU1RfSE9TVCwgcG9ydDogVEVTVF9QT1JUfSk7XG4gICAgcmVzb2x2ZShkcml2ZXIpO1xuICAgIGF3YWl0IGRyaXZlci5pbml0KGNhcHMpO1xuICB9KTtcbiAgYWZ0ZXIoYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGRyaXZlci5xdWl0KCk7XG4gIH0pO1xuICByZXR1cm4gbmV3IEIoKF9yZXNvbHZlKSA9PiB7XG4gICAgcmVzb2x2ZSA9IF9yZXNvbHZlO1xuICB9KTtcbn1cblxuZXhwb3J0IHsgaW5pdFNlc3Npb24sIFRFU1RfRkFLRV9BUFAsIFRFU1RfSE9TVCwgVEVTVF9QT1JUIH07XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
