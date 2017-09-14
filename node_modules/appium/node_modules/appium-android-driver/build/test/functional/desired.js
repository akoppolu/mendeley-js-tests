'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var app = require.resolve('android-apidemos');

var DEFAULT_CAPS = {
  app: app,
  deviceName: 'Android',
  platformName: 'Android'
};

var CONTACT_MANAGER_CAPS = _lodash2['default'].defaults({
  app: _path2['default'].resolve(__dirname, '..', '..', '..', 'test', 'assets', 'ContactManager.apk')
}, DEFAULT_CAPS);

var CHROME_CAPS = _lodash2['default'].defaults({
  browserName: 'chrome'
}, DEFAULT_CAPS);

exports.app = app;
exports.DEFAULT_CAPS = DEFAULT_CAPS;
exports.CONTACT_MANAGER_CAPS = CONTACT_MANAGER_CAPS;
exports.CHROME_CAPS = CHROME_CAPS;
exports['default'] = DEFAULT_CAPS;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZnVuY3Rpb25hbC9kZXNpcmVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUFpQixNQUFNOzs7O3NCQUNULFFBQVE7Ozs7QUFHdEIsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVoRCxJQUFNLFlBQVksR0FBRztBQUNuQixLQUFHLEVBQUgsR0FBRztBQUNILFlBQVUsRUFBRSxTQUFTO0FBQ3JCLGNBQVksRUFBRSxTQUFTO0NBQ3hCLENBQUM7O0FBRUYsSUFBTSxvQkFBb0IsR0FBRyxvQkFBRSxRQUFRLENBQUM7QUFDdEMsS0FBRyxFQUFFLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQztDQUN2RixFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUVqQixJQUFNLFdBQVcsR0FBRyxvQkFBRSxRQUFRLENBQUM7QUFDN0IsYUFBVyxFQUFFLFFBQVE7Q0FDdEIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7UUFFUixHQUFHLEdBQUgsR0FBRztRQUFFLFlBQVksR0FBWixZQUFZO1FBQUUsb0JBQW9CLEdBQXBCLG9CQUFvQjtRQUFFLFdBQVcsR0FBWCxXQUFXO3FCQUM5QyxZQUFZIiwiZmlsZSI6InRlc3QvZnVuY3Rpb25hbC9kZXNpcmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5cbmNvbnN0IGFwcCA9IHJlcXVpcmUucmVzb2x2ZSgnYW5kcm9pZC1hcGlkZW1vcycpO1xuXG5jb25zdCBERUZBVUxUX0NBUFMgPSB7XG4gIGFwcCxcbiAgZGV2aWNlTmFtZTogJ0FuZHJvaWQnLFxuICBwbGF0Zm9ybU5hbWU6ICdBbmRyb2lkJyxcbn07XG5cbmNvbnN0IENPTlRBQ1RfTUFOQUdFUl9DQVBTID0gXy5kZWZhdWx0cyh7XG4gIGFwcDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ3Rlc3QnLCAnYXNzZXRzJywgJ0NvbnRhY3RNYW5hZ2VyLmFwaycpLFxufSwgREVGQVVMVF9DQVBTKTtcblxuY29uc3QgQ0hST01FX0NBUFMgPSBfLmRlZmF1bHRzKHtcbiAgYnJvd3Nlck5hbWU6ICdjaHJvbWUnXG59LCBERUZBVUxUX0NBUFMpO1xuXG5leHBvcnQgeyBhcHAsIERFRkFVTFRfQ0FQUywgQ09OVEFDVF9NQU5BR0VSX0NBUFMsIENIUk9NRV9DQVBTIH07XG5leHBvcnQgZGVmYXVsdCBERUZBVUxUX0NBUFM7XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
