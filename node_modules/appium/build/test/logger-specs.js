require('source-map-support').install();

'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _libLogsink = require('../lib/logsink');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _appiumSupport = require('appium-support');

// temporarily turn on logging to stdio, so we can catch and query
var forceLogs = process.env._FORCE_LOGS;
process.env._FORCE_LOGS = 1;
var log = _appiumSupport.logger.getLogger('Appium');

describe('logging', function () {
  var stderrSpy = undefined;
  var stdoutSpy = undefined;
  beforeEach(function () {
    stderrSpy = _sinon2['default'].spy(process.stderr, 'write');
    stdoutSpy = _sinon2['default'].spy(process.stdout, 'write');
    (0, _libLogsink.clear)();
  });
  afterEach(function () {
    stderrSpy.restore();
    stdoutSpy.restore();
  });
  after(function () {
    process.env._FORCE_LOGS = forceLogs;
  });

  var errorMsg = 'some error';
  var warnMsg = 'some warning';
  var debugMsg = 'some debug';

  function doLogging() {
    log.error(errorMsg);
    log.warn(warnMsg);
    log.debug(debugMsg);
  }

  it('should send error, info and debug when loglevel is debug', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'debug' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(2);
          stdoutSpy.args[0][0].should.include(warnMsg);
          stdoutSpy.args[1][0].should.include(debugMsg);

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should send error and info when loglevel is info', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'info' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(1);
          stdoutSpy.args[0][0].should.include(warnMsg);

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should send error when loglevel is error', function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libLogsink.init)({ loglevel: 'error' }));

        case 2:

          doLogging();

          stderrSpy.callCount.should.equal(1);
          stderrSpy.args[0][0].should.include(errorMsg);

          stdoutSpy.callCount.should.equal(0);

        case 6:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvbG9nZ2VyLXNwZWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRTJELGdCQUFnQjs7cUJBQ3pELE9BQU87Ozs7NkJBQ0YsZ0JBQWdCOzs7QUFJdkMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLElBQUksR0FBRyxHQUFHLHNCQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3hCLE1BQUksU0FBUyxZQUFBLENBQUM7QUFDZCxNQUFJLFNBQVMsWUFBQSxDQUFDO0FBQ2QsWUFBVSxDQUFDLFlBQU07QUFDZixhQUFTLEdBQUcsbUJBQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0MsYUFBUyxHQUFHLG1CQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLDRCQUFjLENBQUM7R0FDaEIsQ0FBQyxDQUFDO0FBQ0gsV0FBUyxDQUFDLFlBQU07QUFDZCxhQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsYUFBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3JCLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQyxZQUFNO0FBQ1YsV0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0dBQ3JDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUM7QUFDOUIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0FBQy9CLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQzs7QUFFOUIsV0FBUyxTQUFTLEdBQUk7QUFDcEIsT0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQixPQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xCLE9BQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDckI7O0FBRUQsSUFBRSxDQUFDLDBEQUEwRCxFQUFFOzs7OzsyQ0FDdkQsc0JBQVksRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7Ozs7QUFFdEMsbUJBQVMsRUFBRSxDQUFDOztBQUVaLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUMsbUJBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7R0FDL0MsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLGtEQUFrRCxFQUFFOzs7OzsyQ0FDL0Msc0JBQVksRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7Ozs7QUFFckMsbUJBQVMsRUFBRSxDQUFDOztBQUVaLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUMsbUJBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7O0dBQzlDLENBQUMsQ0FBQztBQUNILElBQUUsQ0FBQywwQ0FBMEMsRUFBRTs7Ozs7MkNBQ3ZDLHNCQUFZLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDOzs7O0FBRXRDLG1CQUFTLEVBQUUsQ0FBQzs7QUFFWixtQkFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlDLG1CQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7R0FDckMsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6InRlc3QvbG9nZ2VyLXNwZWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHJhbnNwaWxlOm1vY2hhXG5cbmltcG9ydCB7IGluaXQgYXMgbG9nc2lua0luaXQsIGNsZWFyIGFzIGxvZ3NpbmtDbGVhciB9IGZyb20gJy4uL2xpYi9sb2dzaW5rJztcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5cblxuLy8gdGVtcG9yYXJpbHkgdHVybiBvbiBsb2dnaW5nIHRvIHN0ZGlvLCBzbyB3ZSBjYW4gY2F0Y2ggYW5kIHF1ZXJ5XG5sZXQgZm9yY2VMb2dzID0gcHJvY2Vzcy5lbnYuX0ZPUkNFX0xPR1M7XG5wcm9jZXNzLmVudi5fRk9SQ0VfTE9HUyA9IDE7XG5sZXQgbG9nID0gbG9nZ2VyLmdldExvZ2dlcignQXBwaXVtJyk7XG5cbmRlc2NyaWJlKCdsb2dnaW5nJywgKCkgPT4ge1xuICBsZXQgc3RkZXJyU3B5O1xuICBsZXQgc3Rkb3V0U3B5O1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGRlcnJTcHkgPSBzaW5vbi5zcHkocHJvY2Vzcy5zdGRlcnIsICd3cml0ZScpO1xuICAgIHN0ZG91dFNweSA9IHNpbm9uLnNweShwcm9jZXNzLnN0ZG91dCwgJ3dyaXRlJyk7XG4gICAgbG9nc2lua0NsZWFyKCk7XG4gIH0pO1xuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHN0ZGVyclNweS5yZXN0b3JlKCk7XG4gICAgc3Rkb3V0U3B5LnJlc3RvcmUoKTtcbiAgfSk7XG4gIGFmdGVyKCgpID0+IHtcbiAgICBwcm9jZXNzLmVudi5fRk9SQ0VfTE9HUyA9IGZvcmNlTG9ncztcbiAgfSk7XG5cbiAgY29uc3QgZXJyb3JNc2cgPSAnc29tZSBlcnJvcic7XG4gIGNvbnN0IHdhcm5Nc2cgPSAnc29tZSB3YXJuaW5nJztcbiAgY29uc3QgZGVidWdNc2cgPSAnc29tZSBkZWJ1Zyc7XG5cbiAgZnVuY3Rpb24gZG9Mb2dnaW5nICgpIHtcbiAgICBsb2cuZXJyb3IoZXJyb3JNc2cpO1xuICAgIGxvZy53YXJuKHdhcm5Nc2cpO1xuICAgIGxvZy5kZWJ1ZyhkZWJ1Z01zZyk7XG4gIH1cblxuICBpdCgnc2hvdWxkIHNlbmQgZXJyb3IsIGluZm8gYW5kIGRlYnVnIHdoZW4gbG9nbGV2ZWwgaXMgZGVidWcnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9nc2lua0luaXQoe2xvZ2xldmVsOiAnZGVidWcnfSk7XG5cbiAgICBkb0xvZ2dpbmcoKTtcblxuICAgIHN0ZGVyclNweS5jYWxsQ291bnQuc2hvdWxkLmVxdWFsKDEpO1xuICAgIHN0ZGVyclNweS5hcmdzWzBdWzBdLnNob3VsZC5pbmNsdWRlKGVycm9yTXNnKTtcblxuICAgIHN0ZG91dFNweS5jYWxsQ291bnQuc2hvdWxkLmVxdWFsKDIpO1xuICAgIHN0ZG91dFNweS5hcmdzWzBdWzBdLnNob3VsZC5pbmNsdWRlKHdhcm5Nc2cpO1xuICAgIHN0ZG91dFNweS5hcmdzWzFdWzBdLnNob3VsZC5pbmNsdWRlKGRlYnVnTXNnKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc2VuZCBlcnJvciBhbmQgaW5mbyB3aGVuIGxvZ2xldmVsIGlzIGluZm8nLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbG9nc2lua0luaXQoe2xvZ2xldmVsOiAnaW5mbyd9KTtcblxuICAgIGRvTG9nZ2luZygpO1xuXG4gICAgc3RkZXJyU3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMSk7XG4gICAgc3RkZXJyU3B5LmFyZ3NbMF1bMF0uc2hvdWxkLmluY2x1ZGUoZXJyb3JNc2cpO1xuXG4gICAgc3Rkb3V0U3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMSk7XG4gICAgc3Rkb3V0U3B5LmFyZ3NbMF1bMF0uc2hvdWxkLmluY2x1ZGUod2Fybk1zZyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHNlbmQgZXJyb3Igd2hlbiBsb2dsZXZlbCBpcyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBsb2dzaW5rSW5pdCh7bG9nbGV2ZWw6ICdlcnJvcid9KTtcblxuICAgIGRvTG9nZ2luZygpO1xuXG4gICAgc3RkZXJyU3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMSk7XG4gICAgc3RkZXJyU3B5LmFyZ3NbMF1bMF0uc2hvdWxkLmluY2x1ZGUoZXJyb3JNc2cpO1xuXG4gICAgc3Rkb3V0U3B5LmNhbGxDb3VudC5zaG91bGQuZXF1YWwoMCk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
