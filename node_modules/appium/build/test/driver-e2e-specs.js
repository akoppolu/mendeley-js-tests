require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

var _libMain = require('../lib/main');

var _helpers = require('./helpers');

_chai2['default'].use(_chaiAsPromised2['default']);

var should = _chai2['default'].should();
var shouldStartServer = process.env.USE_RUNNING_SERVER !== "0";
var caps = { platformName: "Fake", deviceName: "Fake", app: _helpers.TEST_FAKE_APP };

describe('FakeDriver - via HTTP', function () {
  var server = null;
  before(function callee$1$0() {
    var args;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!shouldStartServer) {
            context$2$0.next = 5;
            break;
          }

          args = { port: _helpers.TEST_PORT, host: _helpers.TEST_HOST };
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 4:
          server = context$2$0.sent;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!server) {
            context$2$0.next = 3;
            break;
          }

          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(server.close());

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  describe('session handling', function () {
    it('should start and stop a session', function callee$2$0() {
      var driver, _ref, _ref2, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.init(caps));

          case 3:
            _ref = context$3$0.sent;
            _ref2 = _slicedToArray(_ref, 1);
            sessionId = _ref2[0];

            should.exist(sessionId);
            sessionId.should.be.a('string');
            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(driver.quit());

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.title().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should be able to run two FakeDriver sessions simultaneously', function callee$2$0() {
      var driver1, _ref3, _ref32, sessionId1, driver2, _ref4, _ref42, sessionId2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver1.init(caps));

          case 3:
            _ref3 = context$3$0.sent;
            _ref32 = _slicedToArray(_ref3, 1);
            sessionId1 = _ref32[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 11;
            return _regeneratorRuntime.awrap(driver2.init(caps));

          case 11:
            _ref4 = context$3$0.sent;
            _ref42 = _slicedToArray(_ref4, 1);
            sessionId2 = _ref42[0];

            should.exist(sessionId2);
            sessionId2.should.be.a('string');
            sessionId1.should.not.equal(sessionId2);
            context$3$0.next = 19;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 19:
            context$3$0.next = 21;
            return _regeneratorRuntime.awrap(driver2.quit());

          case 21:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should not be able to run two FakeDriver sessions simultaneously when one is unique', function callee$2$0() {
      var uniqueCaps, driver1, _ref5, _ref52, sessionId1, driver2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            uniqueCaps = _lodash2['default'].clone(caps);

            uniqueCaps.uniqueApp = true;
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(driver1.init(uniqueCaps));

          case 5:
            _ref5 = context$3$0.sent;
            _ref52 = _slicedToArray(_ref5, 1);
            sessionId1 = _ref52[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 13;
            return _regeneratorRuntime.awrap(driver2.init(caps).should.eventually.be.rejected);

          case 13:
            context$3$0.next = 15;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should use the newCommandTimeout of the inner Driver on session creation', function callee$2$0() {
      var driver, _ref6, _ref62, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);

            caps.newCommandTimeout = 0.25;

            context$3$0.next = 4;
            return _regeneratorRuntime.awrap(driver.init(caps));

          case 4:
            _ref6 = context$3$0.sent;
            _ref62 = _slicedToArray(_ref6, 1);
            sessionId = _ref62[0];

            should.exist(sessionId);

            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(_bluebird2['default'].delay(250));

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.source().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });
});

describe('Logsink', function () {
  var server = null;
  var logs = [];
  var logHandler = function logHandler(level, message) {
    logs.push([level, message]);
  };
  var args = { port: _helpers.TEST_PORT, host: _helpers.TEST_HOST, logHandler: logHandler };

  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 2:
          server = context$2$0.sent;

        case 3:
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
          return _regeneratorRuntime.awrap(server.close());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('should send logs to a logHandler passed in by a parent package', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          logs.length.should.be.above(1);
          logs[0].length.should.equal(2);
          logs[0][1].should.include("Welcome to Appium");

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZHJpdmVyLWUyZS1zcGVjcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7Ozt3QkFDUixVQUFVOzs7O29CQUNQLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O2tCQUM5QixJQUFJOzs7O3VCQUNrQixhQUFhOzt1QkFDRSxXQUFXOztBQUUvRCxrQkFBSyxHQUFHLDZCQUFnQixDQUFDOztBQUV6QixJQUFNLE1BQU0sR0FBRyxrQkFBSyxNQUFNLEVBQUUsQ0FBQztBQUM3QixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssR0FBRyxDQUFDO0FBQ2pFLElBQU0sSUFBSSxHQUFHLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsd0JBQWUsRUFBQyxDQUFDOztBQUU1RSxRQUFRLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUN0QyxNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTSxDQUFDO1FBRUMsSUFBSTs7OztlQUROLGlCQUFpQjs7Ozs7QUFDZixjQUFJLEdBQUcsRUFBQyxJQUFJLG9CQUFXLEVBQUUsSUFBSSxvQkFBVyxFQUFDOzsyQ0FDOUIsbUJBQWEsSUFBSSxDQUFDOzs7QUFBakMsZ0JBQU07Ozs7Ozs7R0FFVCxDQUFDLENBQUM7QUFDSCxPQUFLLENBQUM7Ozs7ZUFDQSxNQUFNOzs7Ozs7MkNBQ0YsTUFBTSxDQUFDLEtBQUssRUFBRTs7Ozs7OztHQUV2QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakMsTUFBRSxDQUFDLGlDQUFpQyxFQUFFO1VBQ2hDLE1BQU0sZUFDTCxTQUFTOzs7OztBQURWLGtCQUFNLEdBQUcsZ0JBQUcsa0JBQWtCLHdDQUFzQjs7NkNBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOzs7OztBQUFwQyxxQkFBUzs7QUFDZCxrQkFBTSxD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Q0FBQztBQUNsQixNQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxNQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUUsT0FBTyxFQUFLO0FBQ25DLFFBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUM3QixDQUFDO0FBQ0YsTUFBSSxJQUFJLEdBQUcsRUFBQyxJQUFJLG9CQUFXLEVBQUUsSUFBSSxvQkFBVyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQzs7QUFFMUQsUUFBTSxDQUFDOzs7OzsyQ0FDVSxtQkFBYSxJQUFJLENBQUM7OztBQUFqQyxnQkFBTTs7Ozs7OztHQUNQLENBQUMsQ0FBQzs7QUFFSCxPQUFLLENBQUM7Ozs7OzJDQUNFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Ozs7Ozs7R0FDckIsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxnRUFBZ0UsRUFBRTs7OztBQUNuRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLGNBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixjQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7Ozs7O0dBQ2hELENBQUMsQ0FBQztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L2RyaXZlci1lMmUtc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGU6bW9jaGFcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IHdkIGZyb20gJ3dkJztcbmltcG9ydCB7IG1haW4gYXMgYXBwaXVtU2VydmVyIH0gZnJvbSAnLi4vbGliL21haW4nO1xuaW1wb3J0IHsgVEVTVF9GQUtFX0FQUCwgVEVTVF9IT1NULCBURVNUX1BPUlQgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmNvbnN0IHNob3VsZCA9IGNoYWkuc2hvdWxkKCk7XG5jb25zdCBzaG91bGRTdGFydFNlcnZlciA9IHByb2Nlc3MuZW52LlVTRV9SVU5OSU5HX1NFUlZFUiAhPT0gXCIwXCI7XG5jb25zdCBjYXBzID0ge3BsYXRmb3JtTmFtZTogXCJGYWtlXCIsIGRldmljZU5hbWU6IFwiRmFrZVwiLCBhcHA6IFRFU1RfRkFLRV9BUFB9O1xuXG5kZXNjcmliZSgnRmFrZURyaXZlciAtIHZpYSBIVFRQJywgKCkgPT4ge1xuICBsZXQgc2VydmVyID0gbnVsbDtcbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBpZiAoc2hvdWxkU3RhcnRTZXJ2ZXIpIHtcbiAgICAgIGxldCBhcmdzID0ge3BvcnQ6IFRFU1RfUE9SVCwgaG9zdDogVEVTVF9IT1NUfTtcbiAgICAgIHNlcnZlciA9IGF3YWl0IGFwcGl1bVNlcnZlcihhcmdzKTtcbiAgICB9XG4gIH0pO1xuICBhZnRlcihhc3luYyAoKSA9PiB7XG4gICAgaWYgKHNlcnZlcikge1xuICAgICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XG4gICAgfVxuICB9KTtcblxuICBkZXNjcmliZSgnc2Vzc2lvbiBoYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHN0YXJ0IGFuZCBzdG9wIGEgc2Vzc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBkcml2ZXIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuICAgICAgbGV0IFtzZXNzaW9uSWRdID0gYXdhaXQgZHJpdmVyLmluaXQoY2Fwcyk7XG4gICAgICBzaG91bGQuZXhpc3Qoc2Vzc2lvbklkKTtcbiAgICAgIHNlc3Npb25JZC5zaG91bGQuYmUuYSgnc3RyaW5nJyk7XG4gICAgICBhd2FpdCBkcml2ZXIucXVpdCgpO1xuICAgICAgYXdhaXQgZHJpdmVyLnRpdGxlKCkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC90ZXJtaW5hdGVkLyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gcnVuIHR3byBGYWtlRHJpdmVyIHNlc3Npb25zIHNpbXVsdGFuZW91c2x5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGRyaXZlcjEgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuICAgICAgbGV0IFtzZXNzaW9uSWQxXSA9IGF3YWl0IGRyaXZlcjEuaW5pdChjYXBzKTtcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQxKTtcbiAgICAgIHNlc3Npb25JZDEuc2hvdWxkLmJlLmEoJ3N0cmluZycpO1xuICAgICAgbGV0IGRyaXZlcjIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuICAgICAgbGV0IFtzZXNzaW9uSWQyXSA9IGF3YWl0IGRyaXZlcjIuaW5pdChjYXBzKTtcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQyKTtcbiAgICAgIHNlc3Npb25JZDIuc2hvdWxkLmJlLmEoJ3N0cmluZycpO1xuICAgICAgc2Vzc2lvbklkMS5zaG91bGQubm90LmVxdWFsKHNlc3Npb25JZDIpO1xuICAgICAgYXdhaXQgZHJpdmVyMS5xdWl0KCk7XG4gICAgICBhd2FpdCBkcml2ZXIyLnF1aXQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGJlIGFibGUgdG8gcnVuIHR3byBGYWtlRHJpdmVyIHNlc3Npb25zIHNpbXVsdGFuZW91c2x5IHdoZW4gb25lIGlzIHVuaXF1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCB1bmlxdWVDYXBzID0gXy5jbG9uZShjYXBzKTtcbiAgICAgIHVuaXF1ZUNhcHMudW5pcXVlQXBwID0gdHJ1ZTtcbiAgICAgIGxldCBkcml2ZXIxID0gd2QucHJvbWlzZUNoYWluUmVtb3RlKFRFU1RfSE9TVCwgVEVTVF9QT1JUKTtcbiAgICAgIGxldCBbc2Vzc2lvbklkMV0gPSBhd2FpdCBkcml2ZXIxLmluaXQodW5pcXVlQ2Fwcyk7XG4gICAgICBzaG91bGQuZXhpc3Qoc2Vzc2lvbklkMSk7XG4gICAgICBzZXNzaW9uSWQxLnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGxldCBkcml2ZXIyID0gd2QucHJvbWlzZUNoYWluUmVtb3RlKFRFU1RfSE9TVCwgVEVTVF9QT1JUKTtcbiAgICAgIGF3YWl0IGRyaXZlcjIuaW5pdChjYXBzKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZDtcbiAgICAgIGF3YWl0IGRyaXZlcjEucXVpdCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdGhlIG5ld0NvbW1hbmRUaW1lb3V0IG9mIHRoZSBpbm5lciBEcml2ZXIgb24gc2Vzc2lvbiBjcmVhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBkcml2ZXIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuXG4gICAgICBjYXBzLm5ld0NvbW1hbmRUaW1lb3V0ID0gMC4yNTtcblxuICAgICAgbGV0IFtzZXNzaW9uSWRdID0gYXdhaXQgZHJpdmVyLmluaXQoY2Fwcyk7XG4gICAgICBzaG91bGQuZXhpc3Qoc2Vzc2lvbklkKTtcblxuICAgICAgYXdhaXQgQi5kZWxheSgyNTApO1xuICAgICAgYXdhaXQgZHJpdmVyLnNvdXJjZSgpLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aCgvdGVybWluYXRlZC8pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTG9nc2luaycsICgpID0+IHtcbiAgbGV0IHNlcnZlciA9IG51bGw7XG4gIGxldCBsb2dzID0gW107XG4gIGxldCBsb2dIYW5kbGVyID0gKGxldmVsLCBtZXNzYWdlKSA9PiB7XG4gICAgbG9ncy5wdXNoKFtsZXZlbCwgbWVzc2FnZV0pO1xuICB9O1xuICBsZXQgYXJncyA9IHtwb3J0OiBURVNUX1BPUlQsIGhvc3Q6IFRFU1RfSE9TVCwgbG9nSGFuZGxlcn07XG5cbiAgYmVmb3JlKGFzeW5jICgpID0+IHtcbiAgICBzZXJ2ZXIgPSBhd2FpdCBhcHBpdW1TZXJ2ZXIoYXJncyk7XG4gIH0pO1xuXG4gIGFmdGVyKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBzZXJ2ZXIuY2xvc2UoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZW5kIGxvZ3MgdG8gYSBsb2dIYW5kbGVyIHBhc3NlZCBpbiBieSBhIHBhcmVudCBwYWNrYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgIGxvZ3MubGVuZ3RoLnNob3VsZC5iZS5hYm92ZSgxKTtcbiAgICBsb2dzWzBdLmxlbmd0aC5zaG91bGQuZXF1YWwoMik7XG4gICAgbG9nc1swXVsxXS5zaG91bGQuaW5jbHVkZShcIldlbGNvbWUgdG8gQXBwaXVtXCIpO1xuICB9KTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
