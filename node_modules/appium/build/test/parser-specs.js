require('source-map-support').install();

'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _libParser = require('../lib/parser');

var _libParser2 = _interopRequireDefault(_libParser);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var should = _chai2['default'].should();

describe('Parser', function () {
  var p = (0, _libParser2['default'])();
  p.debug = true; // throw instead of exit on error; pass as option instead?
  it('should return an arg parser', function () {
    should.exist(p.parseArgs);
    p.parseArgs([]).should.have.property('port');
  });
  it('should keep the raw server flags array', function () {
    should.exist(p.rawArgs);
  });
  it('should have help for every arg', function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(p.rawArgs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arg = _step.value;

        arg[1].should.have.property('help');
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
  });
  it('should throw an error with unknown argument', function () {
    (function () {
      p.parseArgs(['--apple']);
    }).should['throw']();
  });
  it('should parse default capabilities correctly from a string', function () {
    var defaultCapabilities = { a: 'b' };
    var args = p.parseArgs(['--default-capabilities', JSON.stringify(defaultCapabilities)]);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
  it('should parse default capabilities correctly from a file', function () {
    var defaultCapabilities = { a: 'b' };
    var args = p.parseArgs(['--default-capabilities', 'test/fixtures/caps.json']);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
  it('should throw an error with invalid arg to default capabilities', function () {
    (function () {
      p.parseArgs(['-dc', '42']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'false']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'null']);
    }).should['throw']();
    (function () {
      p.parseArgs(['-dc', 'does/not/exist.json']);
    }).should['throw']();
  });
  it('should parse args that are caps into default capabilities', function () {
    var defaultCapabilities = { localizableStringsDir: '/my/dir' };
    var args = p.parseArgs(['--localizable-strings-dir', '/my/dir']);
    args.defaultCapabilities.should.eql(defaultCapabilities);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvcGFyc2VyLXNwZWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3lCQUVzQixlQUFlOzs7O29CQUNwQixNQUFNOzs7O0FBRXZCLElBQU0sTUFBTSxHQUFHLGtCQUFLLE1BQU0sRUFBRSxDQUFDOztBQUU3QixRQUFRLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdkIsTUFBSSxDQUFDLEdBQUcsNkJBQVcsQ0FBQztBQUNwQixHQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNmLElBQUUsQ0FBQyw2QkFBNkIsRUFBRSxZQUFNO0FBQ3RDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFCLEtBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDOUMsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDakQsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDekIsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07Ozs7OztBQUN6Qyx3Q0FBZ0IsQ0FBQyxDQUFDLE9BQU8sNEdBQUU7WUFBbEIsR0FBRzs7QUFDVixXQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDckM7Ozs7Ozs7Ozs7Ozs7OztHQUNGLENBQUMsQ0FBQztBQUNILElBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFNO0FBQ3RELEtBQUMsWUFBTTtBQUFDLE9BQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQUMsQ0FBQSxDQUFFLE1BQU0sU0FBTSxFQUFFLENBQUM7R0FDcEQsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLDJEQUEyRCxFQUFFLFlBQU07QUFDcEUsUUFBSSxtQkFBbUIsR0FBRyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztBQUNuQyxRQUFJLElBQUksR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsd0JBQXdCLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUMxRCxDQUFDLENBQUM7QUFDSCxJQUFFLENBQUMseURBQXlELEVBQUUsWUFBTTtBQUNsRSxRQUFJLG1CQUFtQixHQUFHLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQ25DLFFBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyx3QkFBd0IsRUFDekIseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDMUQsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLGdFQUFnRSxFQUFFLFlBQU07QUFDekUsS0FBQyxZQUFNO0FBQUMsT0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQUMsQ0FBQSxDQUFFLE1BQU0sU0FBTSxFQUFFLENBQUM7QUFDckQsS0FBQyxZQUFNO0FBQUMsT0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQUMsQ0FBQSxDQUFFLE1BQU0sU0FBTSxFQUFFLENBQUM7QUFDeEQsS0FBQyxZQUFNO0FBQUMsT0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQUMsQ0FBQSxDQUFFLE1BQU0sU0FBTSxFQUFFLENBQUM7QUFDdkQsS0FBQyxZQUFNO0FBQUMsT0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7S0FBQyxDQUFBLENBQUUsTUFBTSxTQUFNLEVBQUUsQ0FBQztHQUN2RSxDQUFDLENBQUM7QUFDSCxJQUFFLENBQUMsMkRBQTJELEVBQUUsWUFBTTtBQUNwRSxRQUFJLG1CQUFtQixHQUFHLEVBQUMscUJBQXFCLEVBQUUsU0FBUyxFQUFDLENBQUM7QUFDN0QsUUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDakUsUUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUMxRCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9wYXJzZXItc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGU6bW9jaGFcblxuaW1wb3J0IGdldFBhcnNlciBmcm9tICcuLi9saWIvcGFyc2VyJztcbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuXG5jb25zdCBzaG91bGQgPSBjaGFpLnNob3VsZCgpO1xuXG5kZXNjcmliZSgnUGFyc2VyJywgKCkgPT4ge1xuICBsZXQgcCA9IGdldFBhcnNlcigpO1xuICBwLmRlYnVnID0gdHJ1ZTsgLy8gdGhyb3cgaW5zdGVhZCBvZiBleGl0IG9uIGVycm9yOyBwYXNzIGFzIG9wdGlvbiBpbnN0ZWFkP1xuICBpdCgnc2hvdWxkIHJldHVybiBhbiBhcmcgcGFyc2VyJywgKCkgPT4ge1xuICAgIHNob3VsZC5leGlzdChwLnBhcnNlQXJncyk7XG4gICAgcC5wYXJzZUFyZ3MoW10pLnNob3VsZC5oYXZlLnByb3BlcnR5KCdwb3J0Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGtlZXAgdGhlIHJhdyBzZXJ2ZXIgZmxhZ3MgYXJyYXknLCAoKSA9PiB7XG4gICAgc2hvdWxkLmV4aXN0KHAucmF3QXJncyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhdmUgaGVscCBmb3IgZXZlcnkgYXJnJywgKCkgPT4ge1xuICAgIGZvciAobGV0IGFyZyBvZiBwLnJhd0FyZ3MpIHtcbiAgICAgIGFyZ1sxXS5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnaGVscCcpO1xuICAgIH1cbiAgfSk7XG4gIGl0KCdzaG91bGQgdGhyb3cgYW4gZXJyb3Igd2l0aCB1bmtub3duIGFyZ3VtZW50JywgKCkgPT4ge1xuICAgICgoKSA9PiB7cC5wYXJzZUFyZ3MoWyctLWFwcGxlJ10pO30pLnNob3VsZC50aHJvdygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBwYXJzZSBkZWZhdWx0IGNhcGFiaWxpdGllcyBjb3JyZWN0bHkgZnJvbSBhIHN0cmluZycsICgpID0+IHtcbiAgICBsZXQgZGVmYXVsdENhcGFiaWxpdGllcyA9IHthOiAnYid9O1xuICAgIGxldCBhcmdzID0gcC5wYXJzZUFyZ3MoWyctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkZWZhdWx0Q2FwYWJpbGl0aWVzKV0pO1xuICAgIGFyZ3MuZGVmYXVsdENhcGFiaWxpdGllcy5zaG91bGQuZXFsKGRlZmF1bHRDYXBhYmlsaXRpZXMpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBwYXJzZSBkZWZhdWx0IGNhcGFiaWxpdGllcyBjb3JyZWN0bHkgZnJvbSBhIGZpbGUnLCAoKSA9PiB7XG4gICAgbGV0IGRlZmF1bHRDYXBhYmlsaXRpZXMgPSB7YTogJ2InfTtcbiAgICBsZXQgYXJncyA9IHAucGFyc2VBcmdzKFsnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAndGVzdC9maXh0dXJlcy9jYXBzLmpzb24nXSk7XG4gICAgYXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzLnNob3VsZC5lcWwoZGVmYXVsdENhcGFiaWxpdGllcyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHRocm93IGFuIGVycm9yIHdpdGggaW52YWxpZCBhcmcgdG8gZGVmYXVsdCBjYXBhYmlsaXRpZXMnLCAoKSA9PiB7XG4gICAgKCgpID0+IHtwLnBhcnNlQXJncyhbJy1kYycsICc0MiddKTt9KS5zaG91bGQudGhyb3coKTtcbiAgICAoKCkgPT4ge3AucGFyc2VBcmdzKFsnLWRjJywgJ2ZhbHNlJ10pO30pLnNob3VsZC50aHJvdygpO1xuICAgICgoKSA9PiB7cC5wYXJzZUFyZ3MoWyctZGMnLCAnbnVsbCddKTt9KS5zaG91bGQudGhyb3coKTtcbiAgICAoKCkgPT4ge3AucGFyc2VBcmdzKFsnLWRjJywgJ2RvZXMvbm90L2V4aXN0Lmpzb24nXSk7fSkuc2hvdWxkLnRocm93KCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHBhcnNlIGFyZ3MgdGhhdCBhcmUgY2FwcyBpbnRvIGRlZmF1bHQgY2FwYWJpbGl0aWVzJywgKCkgPT4ge1xuICAgIGxldCBkZWZhdWx0Q2FwYWJpbGl0aWVzID0ge2xvY2FsaXphYmxlU3RyaW5nc0RpcjogJy9teS9kaXInfTtcbiAgICBsZXQgYXJncyA9IHAucGFyc2VBcmdzKFsnLS1sb2NhbGl6YWJsZS1zdHJpbmdzLWRpcicsICcvbXkvZGlyJ10pO1xuICAgIGFyZ3MuZGVmYXVsdENhcGFiaWxpdGllcy5zaG91bGQuZXFsKGRlZmF1bHRDYXBhYmlsaXRpZXMpO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
