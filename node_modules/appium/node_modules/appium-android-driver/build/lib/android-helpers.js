'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _teen_process = require('teen_process');

var _asyncbox = require('asyncbox');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumSupport = require('appium-support');

var _appiumAndroidIme = require('appium-android-ime');

var _ioAppiumSettings = require('io.appium.settings');

var _appiumUnlock = require('appium-unlock');

var _appiumAndroidBootstrap = require('appium-android-bootstrap');

var _appiumAndroidBootstrap2 = _interopRequireDefault(_appiumAndroidBootstrap);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _unlockHelpers = require('./unlock-helpers');

var _unlockHelpers2 = _interopRequireDefault(_unlockHelpers);

var REMOTE_TEMP_PATH = "/data/local/tmp";
var REMOTE_INSTALL_TIMEOUT = 90000; // milliseconds
var CHROME_BROWSERS = ["Chrome", "Chromium", "Chromebeta", "Browser", "chrome", "chromium", "chromebeta", "browser", "chromium-browser", "chromium-webview"];
var SETTINGS_HELPER_PKG_ID = 'io.appium.settings';

var helpers = {};

helpers.parseJavaVersion = function (stderr) {
  var lines = stderr.split("\n");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      if (new RegExp(/(java|openjdk) version/).test(line)) {
        return line.split(" ")[2].replace(/"/g, '');
      }
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

  return null;
};

helpers.getJavaVersion = function callee$0$0() {
  var _ref, stderr, javaVer;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Getting Java version");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('java', ['-version']));

      case 3:
        _ref = context$1$0.sent;
        stderr = _ref.stderr;
        javaVer = helpers.parseJavaVersion(stderr);

        if (!(javaVer === null)) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Could not get the Java version. Is Java installed?");

      case 8:
        _logger2['default'].info('Java version is: ' + javaVer);
        return context$1$0.abrupt('return', javaVer);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareEmulator = function callee$0$0(adb, opts) {
  var avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout, avdName, runningAVD;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        avd = opts.avd;
        avdArgs = opts.avdArgs;
        language = opts.language;
        locale = opts.locale;
        avdLaunchTimeout = opts.avdLaunchTimeout;
        avdReadyTimeout = opts.avdReadyTimeout;

        if (avd) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Cannot launch AVD without AVD name");

      case 8:
        avdName = avd.replace('@', '');
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getRunningAVD(avdName));

      case 11:
        runningAVD = context$1$0.sent;

        if (!(runningAVD !== null)) {
          context$1$0.next = 21;
          break;
        }

        if (!(avdArgs && avdArgs.toLowerCase().indexOf("-wipe-data") > -1)) {
          context$1$0.next = 19;
          break;
        }

        _logger2['default'].debug('Killing \'' + avdName + '\' because it needs to be wiped at start.');
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.killEmulator(avdName));

      case 17:
        context$1$0.next = 21;
        break;

      case 19:
        _logger2['default'].debug("Not launching AVD because it is already running.");
        return context$1$0.abrupt('return');

      case 21:
        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(adb.launchAVD(avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout));

      case 23:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.ensureDeviceLocale = function callee$0$0(adb, language, country) {
  var haveLanguage, haveCountry, changed, curLanguage, curCountry, curLocale, locale;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        haveLanguage = language && typeof language === "string";
        haveCountry = country && typeof country === "string";

        if (!(!haveLanguage && !haveCountry)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return');

      case 4:
        changed = false;
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.getApiLevel());

      case 7:
        context$1$0.t0 = context$1$0.sent;

        if (!(context$1$0.t0 < 23)) {
          context$1$0.next = 25;
          break;
        }

        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getDeviceLanguage());

      case 11:
        curLanguage = context$1$0.sent;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.getDeviceCountry());

      case 14:
        curCountry = context$1$0.sent;

        if (!(haveLanguage && language !== curLanguage)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(adb.setDeviceLanguage(language));

      case 18:
        changed = true;

      case 19:
        if (!(haveCountry && country !== curCountry)) {
          context$1$0.next = 23;
          break;
        }

        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.setDeviceCountry(country));

      case 22:
        changed = true;

      case 23:
        context$1$0.next = 34;
        break;

      case 25:
        context$1$0.next = 27;
        return _regeneratorRuntime.awrap(adb.getDeviceLocale());

      case 27:
        curLocale = context$1$0.sent;
        locale = undefined;

        if (!haveCountry) {
          locale = language.toLowerCase();
        } else if (!haveLanguage) {
          locale = country;
        } else {
          locale = language.toLowerCase() + '-' + country.toUpperCase();
        }

        if (!(locale !== curLocale)) {
          context$1$0.next = 34;
          break;
        }

        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(adb.setDeviceLocale(locale));

      case 33:
        changed = true;

      case 34:
        if (!changed) {
          context$1$0.next = 37;
          break;
        }

        context$1$0.next = 37;
        return _regeneratorRuntime.awrap(adb.reboot());

      case 37:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getDeviceInfoFromCaps = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var adb, udid, emPort, devices, availDevicesStr, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, device, deviceOS;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({
          javaVersion: opts.javaVersion,
          adbPort: opts.adbPort
        }));

      case 2:
        adb = context$1$0.sent;
        udid = opts.udid;
        emPort = null;

        if (!opts.avd) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(helpers.prepareEmulator(adb, opts));

      case 8:
        udid = adb.curDeviceId;
        emPort = adb.emulatorPort;
        context$1$0.next = 63;
        break;

      case 12:
        // no avd given. lets try whatever's plugged in devices/emulators
        _logger2['default'].info("Retrieving device list");
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(adb.getDevicesWithRetry());

      case 15:
        devices = context$1$0.sent;

        if (!udid) {
          context$1$0.next = 21;
          break;
        }

        if (!_lodash2['default'].contains(_lodash2['default'].pluck(devices, 'udid'), udid)) {
          _logger2['default'].errorAndThrow('Device ' + udid + ' was not in the list ' + 'of connected devices');
        }
        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 63;
        break;

      case 21:
        if (!opts.platformVersion) {
          context$1$0.next = 61;
          break;
        }

        // a platform version was given. lets try to find a device with the same os
        _logger2['default'].info('Looking for a device with Android \'' + opts.platformVersion + '\'');

        // in case we fail to find something, give the user a useful log that has
        // the device udids and os versions so they know what's available
        availDevicesStr = [];
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 27;
        _iterator2 = _getIterator(devices);

      case 29:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 43;
          break;
        }

        device = _step2.value;
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(adb.setDeviceId(device.udid));

      case 33:
        context$1$0.next = 35;
        return _regeneratorRuntime.awrap(adb.getPlatformVersion());

      case 35:
        deviceOS = context$1$0.sent;

        // build up our info string of available devices as we iterate
        availDevicesStr.push(device.udid + ' (' + deviceOS + ')');

        // we do a begins with check for implied wildcard matching
        // eg: 4 matches 4.1, 4.0, 4.1.3-samsung, etc

        if (!(deviceOS.indexOf(opts.platformVersion) === 0)) {
          context$1$0.next = 40;
          break;
        }

        udid = device.udid;
        return context$1$0.abrupt('break', 43);

      case 40:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 29;
        break;

      case 43:
        context$1$0.next = 49;
        break;

      case 45:
        context$1$0.prev = 45;
        context$1$0.t0 = context$1$0['catch'](27);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 49:
        context$1$0.prev = 49;
        context$1$0.prev = 50;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 52:
        context$1$0.prev = 52;

        if (!_didIteratorError2) {
          context$1$0.next = 55;
          break;
        }

        throw _iteratorError2;

      case 55:
        return context$1$0.finish(52);

      case 56:
        return context$1$0.finish(49);

      case 57:

        // we couldn't find anything! quit
        if (!udid) {
          _logger2['default'].errorAndThrow('Unable to find an active device or emulator ' + ('with OS ' + opts.platformVersion + '. The following ') + 'are available: ' + availDevicesStr.join(', '));
        }

        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 63;
        break;

      case 61:
        // a udid was not given, grab the first device we see
        udid = devices[0].udid;
        emPort = adb.getPortFromEmulatorString(udid);

      case 63:

        _logger2['default'].info('Using device: ' + udid);
        return context$1$0.abrupt('return', { udid: udid, emPort: emPort });

      case 65:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[27, 45, 49, 57], [50,, 52, 56]]);
};

// returns a new adb instance with deviceId set
helpers.createADB = function callee$0$0(javaVersion, udid, emPort, adbPort, suppressKillServer) {
  var adb;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({ javaVersion: javaVersion, adbPort: adbPort, suppressKillServer: suppressKillServer }));

      case 2:
        adb = context$1$0.sent;

        adb.setDeviceId(udid);
        if (emPort) {
          adb.setEmulatorPort(emPort);
        }

        return context$1$0.abrupt('return', adb);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getLaunchInfo = function callee$0$0(adb, opts) {
  var app, appPackage, appActivity, appWaitPackage, appWaitActivity, _ref2, apkPackage, apkActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        appActivity = opts.appActivity;
        appWaitPackage = opts.appWaitPackage;
        appWaitActivity = opts.appWaitActivity;

        if (app) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].warn("No app sent in, not parsing package/activity");
        return context$1$0.abrupt('return');

      case 8:
        if (!(appPackage && appActivity)) {
          context$1$0.next = 10;
          break;
        }

        return context$1$0.abrupt('return');

      case 10:

        _logger2['default'].debug("Parsing package and activity from app manifest");
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(adb.packageAndLaunchActivityFromManifest(app));

      case 13:
        _ref2 = context$1$0.sent;
        apkPackage = _ref2.apkPackage;
        apkActivity = _ref2.apkActivity;

        if (apkPackage && !appPackage) {
          appPackage = apkPackage;
        }
        if (!appWaitPackage) {
          appWaitPackage = appPackage;
        }
        if (apkActivity && !appActivity) {
          appActivity = apkActivity;
        }
        if (!appWaitActivity) {
          appWaitActivity = appActivity;
        }
        _logger2['default'].debug('Parsed package and activity are: ' + apkPackage + '/' + apkActivity);
        return context$1$0.abrupt('return', { appPackage: appPackage, appWaitPackage: appWaitPackage, appActivity: appActivity, appWaitActivity: appWaitActivity });

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getRemoteApkPath = function (localApkMd5, androidInstallPath) {
  var remotePath = _path2['default'].posix.join(androidInstallPath || REMOTE_TEMP_PATH, localApkMd5 + '.apk');
  _logger2['default'].info('Remote apk path is ' + remotePath);
  return remotePath;
};

helpers.resetApp = function callee$0$0(adb, localApkPath, pkg, fastReset) {
  var androidInstallTimeout = arguments.length <= 4 || arguments[4] === undefined ? REMOTE_INSTALL_TIMEOUT : arguments[4];
  var androidInstallPath = arguments.length <= 5 || arguments[5] === undefined ? REMOTE_TEMP_PATH : arguments[5];
  var apkMd5, remotePath;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!fastReset) {
          context$1$0.next = 6;
          break;
        }

        _logger2['default'].debug("Running fast reset (stop and clear)");
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.stopAndClear(pkg));

      case 4:
        context$1$0.next = 17;
        break;

      case 6:
        _logger2['default'].debug("Running old fashion reset (reinstall)");
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.md5(localApkPath));

      case 9:
        apkMd5 = context$1$0.sent;
        remotePath = helpers.getRemoteApkPath(apkMd5, androidInstallPath);
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(adb.fileExists(remotePath));

      case 13:
        if (context$1$0.sent) {
          context$1$0.next = 15;
          break;
        }

        throw new Error("Can't run slow reset without a remote apk!");

      case 15:
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(helpers.reinstallRemoteApk(adb, localApkPath, pkg, remotePath, androidInstallTimeout));

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.reinstallRemoteApk = function callee$0$0(adb, localApkPath, pkg, remotePath, androidInstallTimeout) {
  var tries = arguments.length <= 5 || arguments[5] === undefined ? 2 : arguments[5];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retry)(tries, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(adb.uninstallApk(pkg));

              case 3:
                context$2$0.next = 8;
                break;

              case 5:
                context$2$0.prev = 5;
                context$2$0.t0 = context$2$0['catch'](0);

                _logger2['default'].warn("Uninstalling remote APK failed, maybe it wasn't installed");

              case 8:
                context$2$0.prev = 8;
                context$2$0.next = 11;
                return _regeneratorRuntime.awrap(adb.installFromDevicePath(remotePath, { timeout: androidInstallTimeout }));

              case 11:
                context$2$0.next = 21;
                break;

              case 13:
                context$2$0.prev = 13;
                context$2$0.t1 = context$2$0['catch'](8);

                _logger2['default'].warn("Installing remote APK failed, going to uninstall and try " + "again");
                // if remote install failed, remove ALL the apks and re-push ours
                // to the remote cache
                context$2$0.next = 18;
                return _regeneratorRuntime.awrap(helpers.removeRemoteApks(adb));

              case 18:
                context$2$0.next = 20;
                return _regeneratorRuntime.awrap(adb.push(localApkPath, remotePath));

              case 20:
                throw context$2$0.t1;

              case 21:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this, [[0, 5], [8, 13]]);
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// throw an error to trigger the retry
helpers.installApkRemotely = function callee$0$0(adb, opts) {
  var app, appPackage, fastReset, androidInstallTimeout, apkMd5, remotePath, remoteApkExists, installed;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        androidInstallTimeout = opts.androidInstallTimeout;

        if (!(!app || !appPackage)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error("'app' and 'appPackage' options are required");

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.md5(app));

      case 8:
        apkMd5 = context$1$0.sent;
        remotePath = helpers.getRemoteApkPath(apkMd5, opts.androidInstallPath);
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.fileExists(remotePath));

      case 12:
        remoteApkExists = context$1$0.sent;

        _logger2['default'].debug("Checking if app is installed");
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 16:
        installed = context$1$0.sent;

        if (!(installed && remoteApkExists && fastReset)) {
          context$1$0.next = 23;
          break;
        }

        _logger2['default'].info("Apk is already on remote and installed, resetting");
        context$1$0.next = 21;
        return _regeneratorRuntime.awrap(helpers.resetApp(adb, app, appPackage, fastReset, androidInstallTimeout));

      case 21:
        context$1$0.next = 37;
        break;

      case 23:
        if (!(!installed || !remoteApkExists && fastReset)) {
          context$1$0.next = 37;
          break;
        }

        if (!installed) {
          _logger2['default'].info("Apk is not yet installed");
        } else {
          _logger2['default'].info("Apk was already installed but not from our remote path");
        }
        _logger2['default'].info((installed ? 'Re' : '') + 'installing apk from remote');
        context$1$0.next = 28;
        return _regeneratorRuntime.awrap(adb.mkdir(REMOTE_TEMP_PATH));

      case 28:
        _logger2['default'].info("Clearing out any existing remote apks with the same hash");
        context$1$0.next = 31;
        return _regeneratorRuntime.awrap(helpers.removeRemoteApks(adb, [apkMd5]));

      case 31:
        if (remoteApkExists) {
          context$1$0.next = 35;
          break;
        }

        // push from local to remote
        _logger2['default'].info('Pushing ' + appPackage + ' to device. Will wait up to ' + androidInstallTimeout + ' ' + 'milliseconds before aborting');
        context$1$0.next = 35;
        return _regeneratorRuntime.awrap(adb.push(app, remotePath, { timeout: androidInstallTimeout }));

      case 35:
        context$1$0.next = 37;
        return _regeneratorRuntime.awrap(helpers.reinstallRemoteApk(adb, app, appPackage, remotePath, androidInstallTimeout));

      case 37:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeRemoteApks = function callee$0$0(adb) {
  var exceptMd5s = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var apks, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, apk;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Removing any old apks");
        if (exceptMd5s) {
          _logger2['default'].debug('Except ' + JSON.stringify(exceptMd5s));
        } else {
          exceptMd5s = [];
        }
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.ls(REMOTE_TEMP_PATH + '/*.apk'));

      case 4:
        apks = context$1$0.sent;

        if (!(apks.length < 1)) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].debug("No apks to examine");
        return context$1$0.abrupt('return');

      case 8:
        apks = apks.filter(function (apk) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = _getIterator(exceptMd5s), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var md5 = _step3.value;

              return apk.indexOf(md5) === -1;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                _iterator3['return']();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        });
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 12;
        _iterator4 = _getIterator(apks);

      case 14:
        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
          context$1$0.next = 22;
          break;
        }

        apk = _step4.value;

        _logger2['default'].info('Will remove ' + apk);
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(adb.shell(['rm', '-f', apk]));

      case 19:
        _iteratorNormalCompletion4 = true;
        context$1$0.next = 14;
        break;

      case 22:
        context$1$0.next = 28;
        break;

      case 24:
        context$1$0.prev = 24;
        context$1$0.t0 = context$1$0['catch'](12);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t0;

      case 28:
        context$1$0.prev = 28;
        context$1$0.prev = 29;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 31:
        context$1$0.prev = 31;

        if (!_didIteratorError4) {
          context$1$0.next = 34;
          break;
        }

        throw _iteratorError4;

      case 34:
        return context$1$0.finish(31);

      case 35:
        return context$1$0.finish(28);

      case 36:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[12, 24, 28, 36], [29,, 31, 35]]);
};

helpers.initUnicodeKeyboard = function callee$0$0(adb) {
  var defaultIME, appiumIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Enabling Unicode keyboard support');
        _logger2['default'].debug("Pushing unicode ime to device...");
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.install(_appiumAndroidIme.path, false));

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.defaultIME());

      case 6:
        defaultIME = context$1$0.sent;

        _logger2['default'].debug('Unsetting previous IME ' + defaultIME);
        appiumIME = 'io.appium.android.ime/.UnicodeIME';

        _logger2['default'].debug('Setting IME to \'' + appiumIME + '\'');
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.enableIME(appiumIME));

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.setIME(appiumIME));

      case 14:
        return context$1$0.abrupt('return', defaultIME);

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.setMockLocationApp = function callee$0$0(adb, app) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.getApiLevel());

      case 2:
        context$1$0.t0 = context$1$0.sent;
        context$1$0.t1 = parseInt(context$1$0.t0, 10);

        if (!(context$1$0.t1 < 23)) {
          context$1$0.next = 9;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.shell(['settings', 'put', 'secure', 'mock_location', '1']));

      case 7:
        context$1$0.next = 11;
        break;

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.shell(['appops', 'set', app, 'android:mock_location', 'allow']));

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.pushSettingsApp = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing settings apk to device...");
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.installOrUpgrade(_ioAppiumSettings.path, SETTINGS_HELPER_PKG_ID));

      case 4:
        context$1$0.next = 9;
        break;

      case 6:
        context$1$0.prev = 6;
        context$1$0.t0 = context$1$0['catch'](1);

        _logger2['default'].warn('Ignored error while installing Appium Settings helper: "' + context$1$0.t0.message + '". ' + 'Expect some Appium features may not work as expected unless this problem is fixed.');

      case 9:
        context$1$0.prev = 9;
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.grantAllPermissions(SETTINGS_HELPER_PKG_ID));

      case 12:
        context$1$0.next = 16;
        break;

      case 14:
        context$1$0.prev = 14;
        context$1$0.t1 = context$1$0['catch'](9);

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 6], [9, 14]]);
};

// errors are expected there, since the app contains non-changeable permissons
helpers.pushUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing unlock helper app to device...");
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.install(_appiumUnlock.path, false));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

// pushStrings method extracts string.xml and converts it to string.json and pushes
// it to /data/local/tmp/string.json on for use of bootstrap
// if app is not present to extract string.xml it deletes remote strings.json
// if app does not have strings.xml we push an empty json object to remote
helpers.pushStrings = function callee$0$0(language, adb, opts) {
  var remotePath, stringsJson, stringsTmpDir, _ref3, apkStrings, localPath, remoteFile;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        remotePath = '/data/local/tmp';
        stringsJson = 'strings.json';
        stringsTmpDir = _path2['default'].resolve(opts.tmpDir, opts.appPackage);
        context$1$0.prev = 3;

        _logger2['default'].debug('Extracting strings from apk', opts.app, language, stringsTmpDir);
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.extractStringsFromApk(opts.app, language, stringsTmpDir));

      case 7:
        _ref3 = context$1$0.sent;
        apkStrings = _ref3.apkStrings;
        localPath = _ref3.localPath;
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.push(localPath, remotePath));

      case 12:
        return context$1$0.abrupt('return', apkStrings);

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](3);
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(opts.app));

      case 19:
        if (context$1$0.sent) {
          context$1$0.next = 24;
          break;
        }

        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.rimraf(remotePath + '/' + stringsJson));

      case 22:
        context$1$0.next = 28;
        break;

      case 24:
        _logger2['default'].warn("Could not get strings, continuing anyway");
        remoteFile = remotePath + '/' + stringsJson;
        context$1$0.next = 28;
        return _regeneratorRuntime.awrap(adb.shell('echo', ['\'{}\' > ' + remoteFile]));

      case 28:
        return context$1$0.abrupt('return', {});

      case 29:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3, 15]]);
};

helpers.unlockWithUIAutomation = function callee$0$0(driver, adb, unlockCapabilities) {
  var _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType;

  var unlockType, unlockKey, unlockMethod;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        unlockType = unlockCapabilities.unlockType;

        if (_unlockHelpers2['default'].isValidUnlockType(unlockType)) {
          context$1$0.next = 3;
          break;
        }

        throw new Error('Invalid unlock type ' + unlockType);

      case 3:
        unlockKey = unlockCapabilities.unlockKey;

        if (_unlockHelpers2['default'].isValidKey(unlockType, unlockKey)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error('Missing unlockKey ' + unlockKey + ' capability for unlockType ' + unlockType);

      case 6:
        unlockMethod = (_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType = {}, _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PIN_UNLOCK, _unlockHelpers2['default'].pinUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PASSWORD_UNLOCK, _unlockHelpers2['default'].passwordUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PATTERN_UNLOCK, _unlockHelpers2['default'].patternUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.FINGERPRINT_UNLOCK, _unlockHelpers2['default'].fingerprintUnlock), _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType)[unlockType];
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(unlockMethod(adb, driver, unlockCapabilities));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.unlockWithHelperApp = function callee$0$0(adb) {
  var startOpts;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].info("Unlocking screen");
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.forceStop('io.appium.unlock'));

      case 3:
        startOpts = {
          pkg: "io.appium.unlock",
          activity: ".Unlock",
          action: "android.intent.action.MAIN",
          category: "android.intent.category.LAUNCHER",
          flags: "0x10200000",
          stopApp: false
        };
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.startApp(startOpts));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(adb.startApp(startOpts));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.unlock = function callee$0$0(driver, adb, capabilities) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.isScreenLocked());

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 5;
          break;
        }

        _logger2['default'].info("Screen already unlocked, doing nothing");
        return context$1$0.abrupt('return');

      case 5:
        if (!_lodash2['default'].isUndefined(capabilities.unlockType)) {
          context$1$0.next = 10;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(10, 1000, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].debug("Screen is locked, trying to unlock");
                // check if it worked, twice
                _logger2['default'].warn("Using app unlock, this is going to be deprecated!");
                context$2$0.next = 4;
                return _regeneratorRuntime.awrap(helpers.unlockWithHelperApp(adb));

              case 4:
                context$2$0.next = 6;
                return _regeneratorRuntime.awrap(helpers.verifyUnlock(adb));

              case 6:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2);
        }));

      case 8:
        context$1$0.next = 14;
        break;

      case 10:
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(helpers.unlockWithUIAutomation(driver, adb, { unlockType: capabilities.unlockType, unlockKey: capabilities.unlockKey }));

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(helpers.verifyUnlock(adb));

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.verifyUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this3 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(2, 1000, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(adb.isScreenLocked());

              case 2:
                if (!context$2$0.sent) {
                  context$2$0.next = 4;
                  break;
                }

                throw new Error("Screen did not unlock successfully, retrying");

              case 4:
                _logger2['default'].debug("Screen unlocked successfully");

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this3);
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initDevice = function callee$0$0(adb, opts) {
  var defaultIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.waitForDevice());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(helpers.ensureDeviceLocale(adb, opts.language, opts.locale));

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.startLogcat());

      case 6:
        defaultIME = undefined;

        if (!opts.unicodeKeyboard) {
          context$1$0.next = 11;
          break;
        }

        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(helpers.initUnicodeKeyboard(adb));

      case 10:
        defaultIME = context$1$0.sent;

      case 11:
        if (opts.avd) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(helpers.pushSettingsApp(adb));

      case 14:
        if (!_lodash2['default'].isUndefined(opts.unlockType)) {
          context$1$0.next = 17;
          break;
        }

        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(helpers.pushUnlock(adb));

      case 17:
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(helpers.setMockLocationApp(adb, 'io.appium.settings'));

      case 19:
        return context$1$0.abrupt('return', defaultIME);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeNullProperties = function (obj) {
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = _getIterator(_lodash2['default'].keys(obj)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var key = _step5.value;

      if (_lodash2['default'].isNull(obj[key]) || _lodash2['default'].isUndefined(obj[key])) {
        delete obj[key];
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5['return']) {
        _iterator5['return']();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
};

helpers.truncateDecimals = function (number, digits) {
  var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

helpers.isChromeBrowser = function (browser) {
  return _lodash2['default'].contains(CHROME_BROWSERS, browser);
};

helpers.getChromePkg = function (browser) {
  var pkg = undefined,
      activity = undefined;

  browser = browser.toLowerCase();
  if (browser === "chromium") {
    pkg = "org.chromium.chrome.shell";
    activity = ".ChromeShellActivity";
  } else if (browser === "chromebeta") {
    pkg = "com.chrome.beta";
    activity = "com.google.android.apps.chrome.Main";
  } else if (browser === "browser") {
    pkg = "com.android.browser";
    activity = "com.android.browser.BrowserActivity";
  } else if (browser === "chromium-browser") {
    pkg = "org.chromium.chrome";
    activity = "com.google.android.apps.chrome.Main";
  } else if (browser === "chromium-webview") {
    pkg = "org.chromium.webview_shell";
    activity = "org.chromium.webview_shell.WebViewBrowserActivity";
  } else {
    pkg = "com.android.chrome";
    activity = "com.google.android.apps.chrome.Main";
  }
  return { pkg: pkg, activity: activity };
};

helpers.bootstrap = _appiumAndroidBootstrap2['default'];
helpers.unlocker = _unlockHelpers2['default'];

exports['default'] = helpers;
exports.CHROME_BROWSERS = CHROME_BROWSERS;
//API >= 23

// we can create a throwaway ADB instance here, so there is no dependency
// on instantiating on earlier (at this point, we have no udid)
// we can only use this ADB object for commands that would not be confused
// if multiple devices are connected

// a specific avd name was given. try to initialize with that

// udid was given, lets try to init with that device

// first try started devices/emulators

// direct adb calls to the specific device

// first do an uninstall of the package to make sure it's not there

// Next, install from the remote path. This can be flakey. If it doesn't
// work, clear out any cached apks, re-push from local, and try again

// get the default IME so we can return back to it later if we want

// delete remote string.json if present

// then start the app twice, as once is flakey

// Leave the old unlock to avoid breaking existing tests
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hbmRyb2lkLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztvQkFDTCxNQUFNOzs7OzRCQUNGLGNBQWM7O3dCQUNFLFVBQVU7O3NCQUM1QixVQUFVOzs7OzZCQUNWLGdCQUFnQjs7Z0NBQ0ksb0JBQW9COztnQ0FDbkIsb0JBQW9COzs0QkFDdEIsZUFBZTs7c0NBQy9CLDBCQUEwQjs7Ozt5QkFDaEMsWUFBWTs7Ozs2QkFDeUUsa0JBQWtCOzs7O0FBRXZILElBQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7QUFDM0MsSUFBTSxzQkFBc0IsR0FBRyxLQUFLLENBQUM7QUFDckMsSUFBTSxlQUFlLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQzdDLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFDN0Msa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNqRSxJQUFNLHNCQUFzQixHQUFHLG9CQUFvQixDQUFDOztBQUVwRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUMzQyxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFDL0Isc0NBQWlCLEtBQUssNEdBQUU7VUFBZixJQUFJOztBQUNYLFVBQUksSUFBSSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkQsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDN0M7S0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7QUFFRixPQUFP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USxHQUFHLHNCQUFzQixDQUFDO0dBQ25DLE1BQU0sSUFBSSxPQUFPLEtBQUssWUFBWSxFQUFFO0FBQ25DLE9BQUcsR0FBRyxpQkFBaUIsQ0FBQztBQUN4QixZQUFRLEdBQUcscUNBQXFDLENBQUM7R0FDbEQsTUFBTSxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDaEMsT0FBRyxHQUFHLHFCQUFxQixDQUFDO0FBQzVCLFlBQVEsR0FBRyxxQ0FBcUMsQ0FBQztHQUNsRCxNQUFNLElBQUksT0FBTyxLQUFLLGtCQUFrQixFQUFFO0FBQ3pDLE9BQUcsR0FBRyxxQkFBcUIsQ0FBQztBQUM1QixZQUFRLEdBQUcscUNBQXFDLENBQUM7R0FDbEQsTUFBTSxJQUFJLE9BQU8sS0FBSyxrQkFBa0IsRUFBRTtBQUN6QyxPQUFHLEdBQUcsNEJBQTRCLENBQUM7QUFDbkMsWUFBUSxHQUFHLG1EQUFtRCxDQUFDO0dBQ2hFLE1BQU07QUFDTCxPQUFHLEdBQUcsb0JBQW9CLENBQUM7QUFDM0IsWUFBUSxHQUFHLHFDQUFxQyxDQUFDO0dBQ2xEO0FBQ0QsU0FBTyxFQUFDLEdBQUcsRUFBSCxHQUFHLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBQyxDQUFDO0NBQ3hCLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsc0NBQVksQ0FBQztBQUM5QixPQUFPLENBQUMsUUFBUSw2QkFBVyxDQUFDOztxQkFFYixPQUFPO1FBQ2IsZUFBZSxHQUFmLGVBQWUiLCJmaWxlIjoibGliL2FuZHJvaWQtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcmV0cnksIHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IHsgcGF0aCBhcyB1bmljb2RlSU1FUGF0aCB9IGZyb20gJ2FwcGl1bS1hbmRyb2lkLWltZSc7XG5pbXBvcnQgeyBwYXRoIGFzIHNldHRpbmdzQXBrUGF0aCB9IGZyb20gJ2lvLmFwcGl1bS5zZXR0aW5ncyc7XG5pbXBvcnQgeyBwYXRoIGFzIHVubG9ja0Fwa1BhdGggfSBmcm9tICdhcHBpdW0tdW5sb2NrJztcbmltcG9ydCBCb290c3RyYXAgZnJvbSAnYXBwaXVtLWFuZHJvaWQtYm9vdHN0cmFwJztcbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIHVubG9ja2VyLCBQSU5fVU5MT0NLLCBQQVNTV09SRF9VTkxPQ0ssIFBBVFRFUk5fVU5MT0NLLCBGSU5HRVJQUklOVF9VTkxPQ0sgfSBmcm9tICcuL3VubG9jay1oZWxwZXJzJztcblxuY29uc3QgUkVNT1RFX1RFTVBfUEFUSCA9IFwiL2RhdGEvbG9jYWwvdG1wXCI7XG5jb25zdCBSRU1PVEVfSU5TVEFMTF9USU1FT1VUID0gOTAwMDA7IC8vIG1pbGxpc2Vjb25kc1xuY29uc3QgQ0hST01FX0JST1dTRVJTID0gW1wiQ2hyb21lXCIsIFwiQ2hyb21pdW1cIiwgXCJDaHJvbWViZXRhXCIsIFwiQnJvd3NlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2hyb21lXCIsIFwiY2hyb21pdW1cIiwgXCJjaHJvbWViZXRhXCIsIFwiYnJvd3NlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2hyb21pdW0tYnJvd3NlclwiLCBcImNocm9taXVtLXdlYnZpZXdcIl07XG5jb25zdCBTRVRUSU5HU19IRUxQRVJfUEtHX0lEID0gJ2lvLmFwcGl1bS5zZXR0aW5ncyc7XG5cbmxldCBoZWxwZXJzID0ge307XG5cbmhlbHBlcnMucGFyc2VKYXZhVmVyc2lvbiA9IGZ1bmN0aW9uIChzdGRlcnIpIHtcbiAgbGV0IGxpbmVzID0gc3RkZXJyLnNwbGl0KFwiXFxuXCIpO1xuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoLyhqYXZhfG9wZW5qZGspIHZlcnNpb24vKS50ZXN0KGxpbmUpKSB7XG4gICAgICByZXR1cm4gbGluZS5zcGxpdChcIiBcIilbMl0ucmVwbGFjZSgvXCIvZywgJycpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmhlbHBlcnMuZ2V0SmF2YVZlcnNpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGxvZ2dlci5kZWJ1ZyhcIkdldHRpbmcgSmF2YSB2ZXJzaW9uXCIpO1xuXG4gIGxldCB7c3RkZXJyfSA9IGF3YWl0IGV4ZWMoJ2phdmEnLCBbJy12ZXJzaW9uJ10pO1xuICBsZXQgamF2YVZlciA9IGhlbHBlcnMucGFyc2VKYXZhVmVyc2lvbihzdGRlcnIpO1xuICBpZiAoamF2YVZlciA9PT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBnZXQgdGhlIEphdmEgdmVyc2lvbi4gSXMgSmF2YSBpbnN0YWxsZWQ/XCIpO1xuICB9XG4gIGxvZ2dlci5pbmZvKGBKYXZhIHZlcnNpb24gaXM6ICR7amF2YVZlcn1gKTtcbiAgcmV0dXJuIGphdmFWZXI7XG59O1xuXG5oZWxwZXJzLnByZXBhcmVFbXVsYXRvciA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMpIHtcbiAgbGV0IHthdmQsIGF2ZEFyZ3MsIGxhbmd1YWdlLCBsb2NhbGUsIGF2ZExhdW5jaFRpbWVvdXQsXG4gICAgICAgYXZkUmVhZHlUaW1lb3V0fSA9IG9wdHM7XG4gIGlmICghYXZkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGxhdW5jaCBBVkQgd2l0aG91dCBBVkQgbmFtZVwiKTtcbiAgfVxuICBsZXQgYXZkTmFtZSA9IGF2ZC5yZXBsYWNlKCdAJywgJycpO1xuICBsZXQgcnVubmluZ0FWRCA9IGF3YWl0IGFkYi5nZXRSdW5uaW5nQVZEKGF2ZE5hbWUpO1xuICBpZiAocnVubmluZ0FWRCAhPT0gbnVsbCkge1xuICAgIGlmIChhdmRBcmdzICYmIGF2ZEFyZ3MudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiLXdpcGUtZGF0YVwiKSA+IC0xKSB7XG4gICAgICBsb2dnZXIuZGVidWcoYEtpbGxpbmcgJyR7YXZkTmFtZX0nIGJlY2F1c2UgaXQgbmVlZHMgdG8gYmUgd2lwZWQgYXQgc3RhcnQuYCk7XG4gICAgICBhd2FpdCBhZGIua2lsbEVtdWxhdG9yKGF2ZE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJOb3QgbGF1bmNoaW5nIEFWRCBiZWNhdXNlIGl0IGlzIGFscmVhZHkgcnVubmluZy5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGF3YWl0IGFkYi5sYXVuY2hBVkQoYXZkLCBhdmRBcmdzLCBsYW5ndWFnZSwgbG9jYWxlLCBhdmRMYXVuY2hUaW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgIGF2ZFJlYWR5VGltZW91dCk7XG59O1xuXG5oZWxwZXJzLmVuc3VyZURldmljZUxvY2FsZSA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIGxhbmd1YWdlLCBjb3VudHJ5KSB7XG4gIGxldCBoYXZlTGFuZ3VhZ2UgPSBsYW5ndWFnZSAmJiB0eXBlb2YgbGFuZ3VhZ2UgPT09IFwic3RyaW5nXCI7XG4gIGxldCBoYXZlQ291bnRyeSA9IGNvdW50cnkgJiYgdHlwZW9mIGNvdW50cnkgPT09IFwic3RyaW5nXCI7XG4gIGlmICghaGF2ZUxhbmd1YWdlICYmICFoYXZlQ291bnRyeSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBpZiAoYXdhaXQgYWRiLmdldEFwaUxldmVsKCkgPCAyMykge1xuICAgIGxldCBjdXJMYW5ndWFnZSA9IGF3YWl0IGFkYi5nZXREZXZpY2VMYW5ndWFnZSgpO1xuICAgIGxldCBjdXJDb3VudHJ5ID0gYXdhaXQgYWRiLmdldERldmljZUNvdW50cnkoKTtcbiAgICBpZiAoaGF2ZUxhbmd1YWdlICYmIGxhbmd1YWdlICE9PSBjdXJMYW5ndWFnZSkge1xuICAgICAgYXdhaXQgYWRiLnNldERldmljZUxhbmd1YWdlKGxhbmd1YWdlKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaGF2ZUNvdW50cnkgJiYgY291bnRyeSAhPT0gY3VyQ291bnRyeSkge1xuICAgICAgYXdhaXQgYWRiLnNldERldmljZUNvdW50cnkoY291bnRyeSk7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vQVBJID49IDIzXG4gICAgbGV0IGN1ckxvY2FsZSA9IGF3YWl0IGFkYi5nZXREZXZpY2VMb2NhbGUoKTtcbiAgICBsZXQgbG9jYWxlO1xuICAgIGlmICghaGF2ZUNvdW50cnkpIHtcbiAgICAgIGxvY2FsZSA9IGxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICghaGF2ZUxhbmd1YWdlKSB7XG4gICAgICBsb2NhbGUgPSBjb3VudHJ5O1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBgJHtsYW5ndWFnZS50b0xvd2VyQ2FzZSgpfS0ke2NvdW50cnkudG9VcHBlckNhc2UoKX1gO1xuICAgIH1cbiAgICBpZiAobG9jYWxlICE9PSBjdXJMb2NhbGUpIHtcbiAgICAgIGF3YWl0IGFkYi5zZXREZXZpY2VMb2NhbGUobG9jYWxlKTtcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBpZiAoY2hhbmdlZCkge1xuICAgIGF3YWl0IGFkYi5yZWJvb3QoKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXREZXZpY2VJbmZvRnJvbUNhcHMgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIC8vIHdlIGNhbiBjcmVhdGUgYSB0aHJvd2F3YXkgQURCIGluc3RhbmNlIGhlcmUsIHNvIHRoZXJlIGlzIG5vIGRlcGVuZGVuY3lcbiAgLy8gb24gaW5zdGFudGlhdGluZyBvbiBlYXJsaWVyIChhdCB0aGlzIHBvaW50LCB3ZSBoYXZlIG5vIHVkaWQpXG4gIC8vIHdlIGNhbiBvbmx5IHVzZSB0aGlzIEFEQiBvYmplY3QgZm9yIGNvbW1hbmRzIHRoYXQgd291bGQgbm90IGJlIGNvbmZ1c2VkXG4gIC8vIGlmIG11bHRpcGxlIGRldmljZXMgYXJlIGNvbm5lY3RlZFxuICBsZXQgYWRiID0gYXdhaXQgQURCLmNyZWF0ZUFEQih7XG4gICAgamF2YVZlcnNpb246IG9wdHMuamF2YVZlcnNpb24sXG4gICAgYWRiUG9ydDogb3B0cy5hZGJQb3J0XG4gIH0pO1xuICBsZXQgdWRpZCA9IG9wdHMudWRpZDtcbiAgbGV0IGVtUG9ydCA9IG51bGw7XG5cbiAgLy8gYSBzcGVjaWZpYyBhdmQgbmFtZSB3YXMgZ2l2ZW4uIHRyeSB0byBpbml0aWFsaXplIHdpdGggdGhhdFxuICBpZiAob3B0cy5hdmQpIHtcbiAgICBhd2FpdCBoZWxwZXJzLnByZXBhcmVFbXVsYXRvcihhZGIsIG9wdHMpO1xuICAgIHVkaWQgPSBhZGIuY3VyRGV2aWNlSWQ7XG4gICAgZW1Qb3J0ID0gYWRiLmVtdWxhdG9yUG9ydDtcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBhdmQgZ2l2ZW4uIGxldHMgdHJ5IHdoYXRldmVyJ3MgcGx1Z2dlZCBpbiBkZXZpY2VzL2VtdWxhdG9yc1xuICAgIGxvZ2dlci5pbmZvKFwiUmV0cmlldmluZyBkZXZpY2UgbGlzdFwiKTtcbiAgICBsZXQgZGV2aWNlcyA9IGF3YWl0IGFkYi5nZXREZXZpY2VzV2l0aFJldHJ5KCk7XG5cbiAgICAvLyB1ZGlkIHdhcyBnaXZlbiwgbGV0cyB0cnkgdG8gaW5pdCB3aXRoIHRoYXQgZGV2aWNlXG4gICAgaWYgKHVkaWQpIHtcbiAgICAgIGlmICghXy5jb250YWlucyhfLnBsdWNrKGRldmljZXMsICd1ZGlkJyksIHVkaWQpKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvckFuZFRocm93KGBEZXZpY2UgJHt1ZGlkfSB3YXMgbm90IGluIHRoZSBsaXN0IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgb2YgY29ubmVjdGVkIGRldmljZXNgKTtcbiAgICAgIH1cbiAgICAgIGVtUG9ydCA9IGFkYi5nZXRQb3J0RnJvbUVtdWxhdG9yU3RyaW5nKHVkaWQpO1xuICAgIH0gZWxzZSBpZiAob3B0cy5wbGF0Zm9ybVZlcnNpb24pIHtcbiAgICAgIC8vIGEgcGxhdGZvcm0gdmVyc2lvbiB3YXMgZ2l2ZW4uIGxldHMgdHJ5IHRvIGZpbmQgYSBkZXZpY2Ugd2l0aCB0aGUgc2FtZSBvc1xuICAgICAgbG9nZ2VyLmluZm8oYExvb2tpbmcgZm9yIGEgZGV2aWNlIHdpdGggQW5kcm9pZCAnJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0nYCk7XG5cbiAgICAgIC8vIGluIGNhc2Ugd2UgZmFpbCB0byBmaW5kIHNvbWV0aGluZywgZ2l2ZSB0aGUgdXNlciBhIHVzZWZ1bCBsb2cgdGhhdCBoYXNcbiAgICAgIC8vIHRoZSBkZXZpY2UgdWRpZHMgYW5kIG9zIHZlcnNpb25zIHNvIHRoZXkga25vdyB3aGF0J3MgYXZhaWxhYmxlXG4gICAgICBsZXQgYXZhaWxEZXZpY2VzU3RyID0gW107XG5cbiAgICAgIC8vIGZpcnN0IHRyeSBzdGFydGVkIGRldmljZXMvZW11bGF0b3JzXG4gICAgICBmb3IgKGxldCBkZXZpY2Ugb2YgZGV2aWNlcykge1xuICAgICAgICAvLyBkaXJlY3QgYWRiIGNhbGxzIHRvIHRoZSBzcGVjaWZpYyBkZXZpY2VcbiAgICAgICAgYXdhaXQgYWRiLnNldERldmljZUlkKGRldmljZS51ZGlkKTtcbiAgICAgICAgbGV0IGRldmljZU9TID0gYXdhaXQgYWRiLmdldFBsYXRmb3JtVmVyc2lvbigpO1xuXG4gICAgICAgIC8vIGJ1aWxkIHVwIG91ciBpbmZvIHN0cmluZyBvZiBhdmFpbGFibGUgZGV2aWNlcyBhcyB3ZSBpdGVyYXRlXG4gICAgICAgIGF2YWlsRGV2aWNlc1N0ci5wdXNoKGAke2RldmljZS51ZGlkfSAoJHtkZXZpY2VPU30pYCk7XG5cbiAgICAgICAgLy8gd2UgZG8gYSBiZWdpbnMgd2l0aCBjaGVjayBmb3IgaW1wbGllZCB3aWxkY2FyZCBtYXRjaGluZ1xuICAgICAgICAvLyBlZzogNCBtYXRjaGVzIDQuMSwgNC4wLCA0LjEuMy1zYW1zdW5nLCBldGNcbiAgICAgICAgaWYgKGRldmljZU9TLmluZGV4T2Yob3B0cy5wbGF0Zm9ybVZlcnNpb24pID09PSAwKSB7XG4gICAgICAgICAgdWRpZCA9IGRldmljZS51ZGlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGNvdWxkbid0IGZpbmQgYW55dGhpbmchIHF1aXRcbiAgICAgIGlmICghdWRpZCkge1xuICAgICAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdyhgVW5hYmxlIHRvIGZpbmQgYW4gYWN0aXZlIGRldmljZSBvciBlbXVsYXRvciBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHdpdGggT1MgJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0uIFRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcmUgYXZhaWxhYmxlOiBgICsgYXZhaWxEZXZpY2VzU3RyLmpvaW4oJywgJykpO1xuICAgICAgfVxuXG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYSB1ZGlkIHdhcyBub3QgZ2l2ZW4sIGdyYWIgdGhlIGZpcnN0IGRldmljZSB3ZSBzZWVcbiAgICAgIHVkaWQgPSBkZXZpY2VzWzBdLnVkaWQ7XG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9XG4gIH1cblxuICBsb2dnZXIuaW5mbyhgVXNpbmcgZGV2aWNlOiAke3VkaWR9YCk7XG4gIHJldHVybiB7dWRpZCwgZW1Qb3J0fTtcbn07XG5cbi8vIHJldHVybnMgYSBuZXcgYWRiIGluc3RhbmNlIHdpdGggZGV2aWNlSWQgc2V0XG5oZWxwZXJzLmNyZWF0ZUFEQiA9IGFzeW5jIGZ1bmN0aW9uIChqYXZhVmVyc2lvbiwgdWRpZCwgZW1Qb3J0LCBhZGJQb3J0LCBzdXBwcmVzc0tpbGxTZXJ2ZXIpIHtcbiAgbGV0IGFkYiA9IGF3YWl0IEFEQi5jcmVhdGVBREIoe2phdmFWZXJzaW9uLCBhZGJQb3J0LCBzdXBwcmVzc0tpbGxTZXJ2ZXJ9KTtcblxuICBhZGIuc2V0RGV2aWNlSWQodWRpZCk7XG4gIGlmIChlbVBvcnQpIHtcbiAgICBhZGIuc2V0RW11bGF0b3JQb3J0KGVtUG9ydCk7XG4gIH1cblxuICByZXR1cm4gYWRiO1xufTtcblxuaGVscGVycy5nZXRMYXVuY2hJbmZvID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBsZXQge2FwcCwgYXBwUGFja2FnZSwgYXBwQWN0aXZpdHksIGFwcFdhaXRQYWNrYWdlLCBhcHBXYWl0QWN0aXZpdHl9ID0gb3B0cztcbiAgaWYgKCFhcHApIHtcbiAgICBsb2dnZXIud2FybihcIk5vIGFwcCBzZW50IGluLCBub3QgcGFyc2luZyBwYWNrYWdlL2FjdGl2aXR5XCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYXBwUGFja2FnZSAmJiBhcHBBY3Rpdml0eSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5kZWJ1ZyhcIlBhcnNpbmcgcGFja2FnZSBhbmQgYWN0aXZpdHkgZnJvbSBhcHAgbWFuaWZlc3RcIik7XG4gIGxldCB7YXBrUGFja2FnZSwgYXBrQWN0aXZpdHl9ID1cbiAgICBhd2FpdCBhZGIucGFja2FnZUFuZExhdW5jaEFjdGl2aXR5RnJvbU1hbmlmZXN0KGFwcCk7XG4gIGlmIChhcGtQYWNrYWdlICYmICFhcHBQYWNrYWdlKSB7XG4gICAgYXBwUGFja2FnZSA9IGFwa1BhY2thZ2U7XG4gIH1cbiAgaWYgKCFhcHBXYWl0UGFja2FnZSkge1xuICAgIGFwcFdhaXRQYWNrYWdlID0gYXBwUGFja2FnZTtcbiAgfVxuICBpZiAoYXBrQWN0aXZpdHkgJiYgIWFwcEFjdGl2aXR5KSB7XG4gICAgYXBwQWN0aXZpdHkgPSBhcGtBY3Rpdml0eTtcbiAgfVxuICBpZiAoIWFwcFdhaXRBY3Rpdml0eSkge1xuICAgIGFwcFdhaXRBY3Rpdml0eSA9IGFwcEFjdGl2aXR5O1xuICB9XG4gIGxvZ2dlci5kZWJ1ZyhgUGFyc2VkIHBhY2thZ2UgYW5kIGFjdGl2aXR5IGFyZTogJHthcGtQYWNrYWdlfS8ke2Fwa0FjdGl2aXR5fWApO1xuICByZXR1cm4ge2FwcFBhY2thZ2UsIGFwcFdhaXRQYWNrYWdlLCBhcHBBY3Rpdml0eSwgYXBwV2FpdEFjdGl2aXR5fTtcbn07XG5cbmhlbHBlcnMuZ2V0UmVtb3RlQXBrUGF0aCA9IGZ1bmN0aW9uIChsb2NhbEFwa01kNSwgYW5kcm9pZEluc3RhbGxQYXRoKSB7XG4gIGxldCByZW1vdGVQYXRoID0gcGF0aC5wb3NpeC5qb2luKGFuZHJvaWRJbnN0YWxsUGF0aCB8fCBSRU1PVEVfVEVNUF9QQVRILCBgJHtsb2NhbEFwa01kNX0uYXBrYCk7XG4gIGxvZ2dlci5pbmZvKGBSZW1vdGUgYXBrIHBhdGggaXMgJHtyZW1vdGVQYXRofWApO1xuICByZXR1cm4gcmVtb3RlUGF0aDtcbn07XG5cbmhlbHBlcnMucmVzZXRBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBsb2NhbEFwa1BhdGgsIHBrZywgZmFzdFJlc2V0LFxuICBhbmRyb2lkSW5zdGFsbFRpbWVvdXQgPSBSRU1PVEVfSU5TVEFMTF9USU1FT1VULCBhbmRyb2lkSW5zdGFsbFBhdGggPSBSRU1PVEVfVEVNUF9QQVRIKSB7XG4gIGlmIChmYXN0UmVzZXQpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJSdW5uaW5nIGZhc3QgcmVzZXQgKHN0b3AgYW5kIGNsZWFyKVwiKTtcbiAgICBhd2FpdCBhZGIuc3RvcEFuZENsZWFyKHBrZyk7XG4gIH0gZWxzZSB7XG4gICAgbG9nZ2VyLmRlYnVnKFwiUnVubmluZyBvbGQgZmFzaGlvbiByZXNldCAocmVpbnN0YWxsKVwiKTtcbiAgICBsZXQgYXBrTWQ1ID0gYXdhaXQgZnMubWQ1KGxvY2FsQXBrUGF0aCk7XG4gICAgbGV0IHJlbW90ZVBhdGggPSBoZWxwZXJzLmdldFJlbW90ZUFwa1BhdGgoYXBrTWQ1LCBhbmRyb2lkSW5zdGFsbFBhdGgpO1xuICAgIGlmICghYXdhaXQgYWRiLmZpbGVFeGlzdHMocmVtb3RlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJ1biBzbG93IHJlc2V0IHdpdGhvdXQgYSByZW1vdGUgYXBrIVwiKTtcbiAgICB9XG4gICAgYXdhaXQgaGVscGVycy5yZWluc3RhbGxSZW1vdGVBcGsoYWRiLCBsb2NhbEFwa1BhdGgsIHBrZywgcmVtb3RlUGF0aCwgYW5kcm9pZEluc3RhbGxUaW1lb3V0KTtcbiAgfVxufTtcblxuaGVscGVycy5yZWluc3RhbGxSZW1vdGVBcGsgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBsb2NhbEFwa1BhdGgsIHBrZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW90ZVBhdGgsIGFuZHJvaWRJbnN0YWxsVGltZW91dCwgdHJpZXMgPSAyKSB7XG4gIGF3YWl0IHJldHJ5KHRyaWVzLCBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGZpcnN0IGRvIGFuIHVuaW5zdGFsbCBvZiB0aGUgcGFja2FnZSB0byBtYWtlIHN1cmUgaXQncyBub3QgdGhlcmVcbiAgICAgIGF3YWl0IGFkYi51bmluc3RhbGxBcGsocGtnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIud2FybihcIlVuaW5zdGFsbGluZyByZW1vdGUgQVBLIGZhaWxlZCwgbWF5YmUgaXQgd2Fzbid0IGluc3RhbGxlZFwiKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFkYi5pbnN0YWxsRnJvbURldmljZVBhdGgocmVtb3RlUGF0aCwge3RpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci53YXJuKFwiSW5zdGFsbGluZyByZW1vdGUgQVBLIGZhaWxlZCwgZ29pbmcgdG8gdW5pbnN0YWxsIGFuZCB0cnkgXCIgK1xuICAgICAgICAgICAgICAgICAgXCJhZ2FpblwiKTtcbiAgICAgIC8vIGlmIHJlbW90ZSBpbnN0YWxsIGZhaWxlZCwgcmVtb3ZlIEFMTCB0aGUgYXBrcyBhbmQgcmUtcHVzaCBvdXJzXG4gICAgICAvLyB0byB0aGUgcmVtb3RlIGNhY2hlXG4gICAgICBhd2FpdCBoZWxwZXJzLnJlbW92ZVJlbW90ZUFwa3MoYWRiKTtcbiAgICAgIGF3YWl0IGFkYi5wdXNoKGxvY2FsQXBrUGF0aCwgcmVtb3RlUGF0aCk7XG4gICAgICB0aHJvdyBlOyAvLyB0aHJvdyBhbiBlcnJvciB0byB0cmlnZ2VyIHRoZSByZXRyeVxuICAgIH1cbiAgfSk7XG59O1xuXG5oZWxwZXJzLmluc3RhbGxBcGtSZW1vdGVseSA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMpIHtcbiAgbGV0IHthcHAsIGFwcFBhY2thZ2UsIGZhc3RSZXNldCwgYW5kcm9pZEluc3RhbGxUaW1lb3V0fSA9IG9wdHM7XG5cbiAgaWYgKCFhcHAgfHwgIWFwcFBhY2thZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXBwJyBhbmQgJ2FwcFBhY2thZ2UnIG9wdGlvbnMgYXJlIHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgbGV0IGFwa01kNSA9IGF3YWl0IGZzLm1kNShhcHApO1xuICBsZXQgcmVtb3RlUGF0aCA9IGhlbHBlcnMuZ2V0UmVtb3RlQXBrUGF0aChhcGtNZDUsIG9wdHMuYW5kcm9pZEluc3RhbGxQYXRoKTtcbiAgbGV0IHJlbW90ZUFwa0V4aXN0cyA9IGF3YWl0IGFkYi5maWxlRXhpc3RzKHJlbW90ZVBhdGgpO1xuICBsb2dnZXIuZGVidWcoXCJDaGVja2luZyBpZiBhcHAgaXMgaW5zdGFsbGVkXCIpO1xuICBsZXQgaW5zdGFsbGVkID0gYXdhaXQgYWRiLmlzQXBwSW5zdGFsbGVkKGFwcFBhY2thZ2UpO1xuXG4gIGlmIChpbnN0YWxsZWQgJiYgcmVtb3RlQXBrRXhpc3RzICYmIGZhc3RSZXNldCkge1xuICAgIGxvZ2dlci5pbmZvKFwiQXBrIGlzIGFscmVhZHkgb24gcmVtb3RlIGFuZCBpbnN0YWxsZWQsIHJlc2V0dGluZ1wiKTtcbiAgICBhd2FpdCBoZWxwZXJzLnJlc2V0QXBwKGFkYiwgYXBwLCBhcHBQYWNrYWdlLCBmYXN0UmVzZXQsIGFuZHJvaWRJbnN0YWxsVGltZW91dCk7XG4gIH0gZWxzZSBpZiAoIWluc3RhbGxlZCB8fCAoIXJlbW90ZUFwa0V4aXN0cyAmJiBmYXN0UmVzZXQpKSB7XG4gICAgaWYgKCFpbnN0YWxsZWQpIHtcbiAgICAgIGxvZ2dlci5pbmZvKFwiQXBrIGlzIG5vdCB5ZXQgaW5zdGFsbGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuaW5mbyhcIkFwayB3YXMgYWxyZWFkeSBpbnN0YWxsZWQgYnV0IG5vdCBmcm9tIG91ciByZW1vdGUgcGF0aFwiKTtcbiAgICB9XG4gICAgbG9nZ2VyLmluZm8oYCR7aW5zdGFsbGVkID8gJ1JlJyA6ICcnfWluc3RhbGxpbmcgYXBrIGZyb20gcmVtb3RlYCk7XG4gICAgYXdhaXQgYWRiLm1rZGlyKFJFTU9URV9URU1QX1BBVEgpO1xuICAgIGxvZ2dlci5pbmZvKFwiQ2xlYXJpbmcgb3V0IGFueSBleGlzdGluZyByZW1vdGUgYXBrcyB3aXRoIHRoZSBzYW1lIGhhc2hcIik7XG4gICAgYXdhaXQgaGVscGVycy5yZW1vdmVSZW1vdGVBcGtzKGFkYiwgW2Fwa01kNV0pO1xuICAgIGlmICghcmVtb3RlQXBrRXhpc3RzKSB7XG4gICAgICAvLyBwdXNoIGZyb20gbG9jYWwgdG8gcmVtb3RlXG4gICAgICBsb2dnZXIuaW5mbyhgUHVzaGluZyAke2FwcFBhY2thZ2V9IHRvIGRldmljZS4gV2lsbCB3YWl0IHVwIHRvICR7YW5kcm9pZEluc3RhbGxUaW1lb3V0fSBgICtcbiAgICAgICAgICAgICAgICAgIGBtaWxsaXNlY29uZHMgYmVmb3JlIGFib3J0aW5nYCk7XG4gICAgICBhd2FpdCBhZGIucHVzaChhcHAsIHJlbW90ZVBhdGgsIHt0aW1lb3V0OiBhbmRyb2lkSW5zdGFsbFRpbWVvdXR9KTtcbiAgICB9XG5cbiAgICAvLyBOZXh0LCBpbnN0YWxsIGZyb20gdGhlIHJlbW90ZSBwYXRoLiBUaGlzIGNhbiBiZSBmbGFrZXkuIElmIGl0IGRvZXNuJ3RcbiAgICAvLyB3b3JrLCBjbGVhciBvdXQgYW55IGNhY2hlZCBhcGtzLCByZS1wdXNoIGZyb20gbG9jYWwsIGFuZCB0cnkgYWdhaW5cbiAgICBhd2FpdCBoZWxwZXJzLnJlaW5zdGFsbFJlbW90ZUFwayhhZGIsIGFwcCwgYXBwUGFja2FnZSwgcmVtb3RlUGF0aCwgYW5kcm9pZEluc3RhbGxUaW1lb3V0KTtcbiAgfVxufTtcblxuaGVscGVycy5yZW1vdmVSZW1vdGVBcGtzID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgZXhjZXB0TWQ1cyA9IG51bGwpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiUmVtb3ZpbmcgYW55IG9sZCBhcGtzXCIpO1xuICBpZiAoZXhjZXB0TWQ1cykge1xuICAgIGxvZ2dlci5kZWJ1ZyhgRXhjZXB0ICR7SlNPTi5zdHJpbmdpZnkoZXhjZXB0TWQ1cyl9YCk7XG4gIH0gZWxzZSB7XG4gICAgZXhjZXB0TWQ1cyA9IFtdO1xuICB9XG4gIGxldCBhcGtzID0gYXdhaXQgYWRiLmxzKGAke1JFTU9URV9URU1QX1BBVEh9LyouYXBrYCk7XG4gIGlmIChhcGtzLmxlbmd0aCA8IDEpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJObyBhcGtzIHRvIGV4YW1pbmVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFwa3MgPSBhcGtzLmZpbHRlcigoYXBrKSA9PiB7XG4gICAgZm9yIChsZXQgbWQ1IG9mIGV4Y2VwdE1kNXMpIHtcbiAgICAgIHJldHVybiBhcGsuaW5kZXhPZihtZDUpID09PSAtMTtcbiAgICB9XG4gIH0pO1xuICBmb3IgKGxldCBhcGsgb2YgYXBrcykge1xuICAgIGxvZ2dlci5pbmZvKGBXaWxsIHJlbW92ZSAke2Fwa31gKTtcbiAgICBhd2FpdCBhZGIuc2hlbGwoWydybScsICctZicsIGFwa10pO1xuICB9XG59O1xuXG5oZWxwZXJzLmluaXRVbmljb2RlS2V5Ym9hcmQgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5kZWJ1ZygnRW5hYmxpbmcgVW5pY29kZSBrZXlib2FyZCBzdXBwb3J0Jyk7XG4gIGxvZ2dlci5kZWJ1ZyhcIlB1c2hpbmcgdW5pY29kZSBpbWUgdG8gZGV2aWNlLi4uXCIpO1xuICBhd2FpdCBhZGIuaW5zdGFsbCh1bmljb2RlSU1FUGF0aCwgZmFsc2UpO1xuXG4gIC8vIGdldCB0aGUgZGVmYXVsdCBJTUUgc28gd2UgY2FuIHJldHVybiBiYWNrIHRvIGl0IGxhdGVyIGlmIHdlIHdhbnRcbiAgbGV0IGRlZmF1bHRJTUUgPSBhd2FpdCBhZGIuZGVmYXVsdElNRSgpO1xuXG4gIGxvZ2dlci5kZWJ1ZyhgVW5zZXR0aW5nIHByZXZpb3VzIElNRSAke2RlZmF1bHRJTUV9YCk7XG4gIGNvbnN0IGFwcGl1bUlNRSA9ICdpby5hcHBpdW0uYW5kcm9pZC5pbWUvLlVuaWNvZGVJTUUnO1xuICBsb2dnZXIuZGVidWcoYFNldHRpbmcgSU1FIHRvICcke2FwcGl1bUlNRX0nYCk7XG4gIGF3YWl0IGFkYi5lbmFibGVJTUUoYXBwaXVtSU1FKTtcbiAgYXdhaXQgYWRiLnNldElNRShhcHBpdW1JTUUpO1xuICByZXR1cm4gZGVmYXVsdElNRTtcbn07XG5cbmhlbHBlcnMuc2V0TW9ja0xvY2F0aW9uQXBwID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgYXBwKSB7XG4gIGlmIChwYXJzZUludChhd2FpdCBhZGIuZ2V0QXBpTGV2ZWwoKSwgMTApIDwgMjMpIHtcbiAgICBhd2FpdCBhZGIuc2hlbGwoWydzZXR0aW5ncycsICdwdXQnLCAnc2VjdXJlJywgJ21vY2tfbG9jYXRpb24nLCAnMSddKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBhZGIuc2hlbGwoWydhcHBvcHMnLCAnc2V0JywgYXBwLCAnYW5kcm9pZDptb2NrX2xvY2F0aW9uJywgJ2FsbG93J10pO1xuICB9XG59O1xuXG5oZWxwZXJzLnB1c2hTZXR0aW5nc0FwcCA9IGFzeW5jIGZ1bmN0aW9uIChhZGIpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiUHVzaGluZyBzZXR0aW5ncyBhcGsgdG8gZGV2aWNlLi4uXCIpO1xuICB0cnkge1xuICAgIGF3YWl0IGFkYi5pbnN0YWxsT3JVcGdyYWRlKHNldHRpbmdzQXBrUGF0aCwgU0VUVElOR1NfSEVMUEVSX1BLR19JRCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZ2dlci53YXJuKGBJZ25vcmVkIGVycm9yIHdoaWxlIGluc3RhbGxpbmcgQXBwaXVtIFNldHRpbmdzIGhlbHBlcjogXCIke2Vyci5tZXNzYWdlfVwiLiBgICtcbiAgICAgICAgICAgICAgICBgRXhwZWN0IHNvbWUgQXBwaXVtIGZlYXR1cmVzIG1heSBub3Qgd29yayBhcyBleHBlY3RlZCB1bmxlc3MgdGhpcyBwcm9ibGVtIGlzIGZpeGVkLmApO1xuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgYWRiLmdyYW50QWxsUGVybWlzc2lvbnMoU0VUVElOR1NfSEVMUEVSX1BLR19JRCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIGVycm9ycyBhcmUgZXhwZWN0ZWQgdGhlcmUsIHNpbmNlIHRoZSBhcHAgY29udGFpbnMgbm9uLWNoYW5nZWFibGUgcGVybWlzc29uc1xuICB9XG59O1xuXG5oZWxwZXJzLnB1c2hVbmxvY2sgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5kZWJ1ZyhcIlB1c2hpbmcgdW5sb2NrIGhlbHBlciBhcHAgdG8gZGV2aWNlLi4uXCIpO1xuICBhd2FpdCBhZGIuaW5zdGFsbCh1bmxvY2tBcGtQYXRoLCBmYWxzZSk7XG59O1xuXG4vLyBwdXNoU3RyaW5ncyBtZXRob2QgZXh0cmFjdHMgc3RyaW5nLnhtbCBhbmQgY29udmVydHMgaXQgdG8gc3RyaW5nLmpzb24gYW5kIHB1c2hlc1xuLy8gaXQgdG8gL2RhdGEvbG9jYWwvdG1wL3N0cmluZy5qc29uIG9uIGZvciB1c2Ugb2YgYm9vdHN0cmFwXG4vLyBpZiBhcHAgaXMgbm90IHByZXNlbnQgdG8gZXh0cmFjdCBzdHJpbmcueG1sIGl0IGRlbGV0ZXMgcmVtb3RlIHN0cmluZ3MuanNvblxuLy8gaWYgYXBwIGRvZXMgbm90IGhhdmUgc3RyaW5ncy54bWwgd2UgcHVzaCBhbiBlbXB0eSBqc29uIG9iamVjdCB0byByZW1vdGVcbmhlbHBlcnMucHVzaFN0cmluZ3MgPSBhc3luYyBmdW5jdGlvbiAobGFuZ3VhZ2UsIGFkYiwgb3B0cykge1xuICBsZXQgcmVtb3RlUGF0aCA9ICcvZGF0YS9sb2NhbC90bXAnO1xuICBsZXQgc3RyaW5nc0pzb24gPSAnc3RyaW5ncy5qc29uJztcbiAgbGV0IHN0cmluZ3NUbXBEaXIgPSBwYXRoLnJlc29sdmUob3B0cy50bXBEaXIsIG9wdHMuYXBwUGFja2FnZSk7XG4gIHRyeSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdFeHRyYWN0aW5nIHN0cmluZ3MgZnJvbSBhcGsnLCBvcHRzLmFwcCwgbGFuZ3VhZ2UsIHN0cmluZ3NUbXBEaXIpO1xuICAgIGxldCB7YXBrU3RyaW5ncywgbG9jYWxQYXRofSA9IGF3YWl0IGFkYi5leHRyYWN0U3RyaW5nc0Zyb21BcGsoXG4gICAgICAgICAgb3B0cy5hcHAsIGxhbmd1YWdlLCBzdHJpbmdzVG1wRGlyKTtcbiAgICBhd2FpdCBhZGIucHVzaChsb2NhbFBhdGgsIHJlbW90ZVBhdGgpO1xuICAgIHJldHVybiBhcGtTdHJpbmdzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoIShhd2FpdCBmcy5leGlzdHMob3B0cy5hcHApKSkge1xuICAgICAgLy8gZGVsZXRlIHJlbW90ZSBzdHJpbmcuanNvbiBpZiBwcmVzZW50XG4gICAgICBhd2FpdCBhZGIucmltcmFmKGAke3JlbW90ZVBhdGh9LyR7c3RyaW5nc0pzb259YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci53YXJuKFwiQ291bGQgbm90IGdldCBzdHJpbmdzLCBjb250aW51aW5nIGFueXdheVwiKTtcbiAgICAgIGxldCByZW1vdGVGaWxlID0gYCR7cmVtb3RlUGF0aH0vJHtzdHJpbmdzSnNvbn1gO1xuICAgICAgYXdhaXQgYWRiLnNoZWxsKCdlY2hvJywgW2Ane30nID4gJHtyZW1vdGVGaWxlfWBdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuaGVscGVycy51bmxvY2tXaXRoVUlBdXRvbWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGRyaXZlciwgYWRiLCB1bmxvY2tDYXBhYmlsaXRpZXMpIHtcbiAgbGV0IHVubG9ja1R5cGUgPSB1bmxvY2tDYXBhYmlsaXRpZXMudW5sb2NrVHlwZTtcbiAgaWYgKCF1bmxvY2tlci5pc1ZhbGlkVW5sb2NrVHlwZSh1bmxvY2tUeXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmxvY2sgdHlwZSAke3VubG9ja1R5cGV9YCk7XG4gIH1cbiAgbGV0IHVubG9ja0tleSA9IHVubG9ja0NhcGFiaWxpdGllcy51bmxvY2tLZXk7XG4gIGlmICghdW5sb2NrZXIuaXNWYWxpZEtleSh1bmxvY2tUeXBlLCB1bmxvY2tLZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIHVubG9ja0tleSAke3VubG9ja0tleX0gY2FwYWJpbGl0eSBmb3IgdW5sb2NrVHlwZSAke3VubG9ja1R5cGV9YCk7XG4gIH1cbiAgY29uc3QgdW5sb2NrTWV0aG9kID0ge1xuICAgIFtQSU5fVU5MT0NLXTogdW5sb2NrZXIucGluVW5sb2NrLFxuICAgIFtQQVNTV09SRF9VTkxPQ0tdOiB1bmxvY2tlci5wYXNzd29yZFVubG9jayxcbiAgICBbUEFUVEVSTl9VTkxPQ0tdOiB1bmxvY2tlci5wYXR0ZXJuVW5sb2NrLFxuICAgIFtGSU5HRVJQUklOVF9VTkxPQ0tdOiB1bmxvY2tlci5maW5nZXJwcmludFVubG9ja1xuICB9W3VubG9ja1R5cGVdO1xuICBhd2FpdCB1bmxvY2tNZXRob2QoYWRiLCBkcml2ZXIsIHVubG9ja0NhcGFiaWxpdGllcyk7XG59O1xuXG5oZWxwZXJzLnVubG9ja1dpdGhIZWxwZXJBcHAgPSBhc3luYyBmdW5jdGlvbihhZGIpIHtcbiAgbG9nZ2VyLmluZm8oXCJVbmxvY2tpbmcgc2NyZWVuXCIpO1xuICBhd2FpdCBhZGIuZm9yY2VTdG9wKCdpby5hcHBpdW0udW5sb2NrJyk7XG4gIC8vIHRoZW4gc3RhcnQgdGhlIGFwcCB0d2ljZSwgYXMgb25jZSBpcyBmbGFrZXlcbiAgbGV0IHN0YXJ0T3B0cyA9IHtcbiAgICBwa2c6IFwiaW8uYXBwaXVtLnVubG9ja1wiLFxuICAgIGFjdGl2aXR5OiBcIi5VbmxvY2tcIixcbiAgICBhY3Rpb246IFwiYW5kcm9pZC5pbnRlbnQuYWN0aW9uLk1BSU5cIixcbiAgICBjYXRlZ29yeTogXCJhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUlwiLFxuICAgIGZsYWdzOiBcIjB4MTAyMDAwMDBcIixcbiAgICBzdG9wQXBwOiBmYWxzZVxuICB9O1xuICBhd2FpdCBhZGIuc3RhcnRBcHAoc3RhcnRPcHRzKTtcbiAgYXdhaXQgYWRiLnN0YXJ0QXBwKHN0YXJ0T3B0cyk7XG59O1xuXG5oZWxwZXJzLnVubG9jayA9IGFzeW5jIGZ1bmN0aW9uIChkcml2ZXIsIGFkYiwgY2FwYWJpbGl0aWVzKSB7XG4gIGlmICghKGF3YWl0IGFkYi5pc1NjcmVlbkxvY2tlZCgpKSkge1xuICAgIGxvZ2dlci5pbmZvKFwiU2NyZWVuIGFscmVhZHkgdW5sb2NrZWQsIGRvaW5nIG5vdGhpbmdcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChfLmlzVW5kZWZpbmVkKGNhcGFiaWxpdGllcy51bmxvY2tUeXBlKSkge1xuICAgIC8vIExlYXZlIHRoZSBvbGQgdW5sb2NrIHRvIGF2b2lkIGJyZWFraW5nIGV4aXN0aW5nIHRlc3RzXG4gICAgYXdhaXQgcmV0cnlJbnRlcnZhbCgxMCwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgICAgbG9nZ2VyLmRlYnVnKFwiU2NyZWVuIGlzIGxvY2tlZCwgdHJ5aW5nIHRvIHVubG9ja1wiKTtcbiAgICAgIC8vIGNoZWNrIGlmIGl0IHdvcmtlZCwgdHdpY2VcbiAgICAgIGxvZ2dlci53YXJuKFwiVXNpbmcgYXBwIHVubG9jaywgdGhpcyBpcyBnb2luZyB0byBiZSBkZXByZWNhdGVkIVwiKTtcbiAgICAgIGF3YWl0IGhlbHBlcnMudW5sb2NrV2l0aEhlbHBlckFwcChhZGIpO1xuICAgICAgYXdhaXQgaGVscGVycy52ZXJpZnlVbmxvY2soYWRiKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBoZWxwZXJzLnVubG9ja1dpdGhVSUF1dG9tYXRpb24oZHJpdmVyLCBhZGIsIHt1bmxvY2tUeXBlOiBjYXBhYmlsaXRpZXMudW5sb2NrVHlwZSwgdW5sb2NrS2V5OiBjYXBhYmlsaXRpZXMudW5sb2NrS2V5fSk7XG4gICAgYXdhaXQgaGVscGVycy52ZXJpZnlVbmxvY2soYWRiKTtcbiAgfVxufTtcblxuaGVscGVycy52ZXJpZnlVbmxvY2sgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGF3YWl0IHJldHJ5SW50ZXJ2YWwoMiwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgIGlmIChhd2FpdCBhZGIuaXNTY3JlZW5Mb2NrZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NyZWVuIGRpZCBub3QgdW5sb2NrIHN1Y2Nlc3NmdWxseSwgcmV0cnlpbmdcIik7XG4gICAgfVxuICAgIGxvZ2dlci5kZWJ1ZyhcIlNjcmVlbiB1bmxvY2tlZCBzdWNjZXNzZnVsbHlcIik7XG4gIH0pO1xufTtcblxuaGVscGVycy5pbml0RGV2aWNlID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBhd2FpdCBhZGIud2FpdEZvckRldmljZSgpO1xuXG4gIGF3YWl0IGhlbHBlcnMuZW5zdXJlRGV2aWNlTG9jYWxlKGFkYiwgb3B0cy5sYW5ndWFnZSwgb3B0cy5sb2NhbGUpO1xuICBhd2FpdCBhZGIuc3RhcnRMb2djYXQoKTtcbiAgbGV0IGRlZmF1bHRJTUU7XG4gIGlmIChvcHRzLnVuaWNvZGVLZXlib2FyZCkge1xuICAgIGRlZmF1bHRJTUUgPSBhd2FpdCBoZWxwZXJzLmluaXRVbmljb2RlS2V5Ym9hcmQoYWRiKTtcbiAgfVxuICBpZiAoIW9wdHMuYXZkKSB7XG4gICAgYXdhaXQgaGVscGVycy5wdXNoU2V0dGluZ3NBcHAoYWRiKTtcbiAgfVxuICBpZiAoXy5pc1VuZGVmaW5lZChvcHRzLnVubG9ja1R5cGUpKSB7XG4gICAgYXdhaXQgaGVscGVycy5wdXNoVW5sb2NrKGFkYik7XG4gIH1cbiAgYXdhaXQgaGVscGVycy5zZXRNb2NrTG9jYXRpb25BcHAoYWRiLCAnaW8uYXBwaXVtLnNldHRpbmdzJyk7XG4gIHJldHVybiBkZWZhdWx0SU1FO1xufTtcblxuaGVscGVycy5yZW1vdmVOdWxsUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgZm9yIChsZXQga2V5IG9mIF8ua2V5cyhvYmopKSB7XG4gICAgaWYgKF8uaXNOdWxsKG9ialtrZXldKSB8fCBfLmlzVW5kZWZpbmVkKG9ialtrZXldKSkge1xuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH1cbiAgfVxufTtcblxuaGVscGVycy50cnVuY2F0ZURlY2ltYWxzID0gZnVuY3Rpb24gKG51bWJlciwgZGlnaXRzKSB7XG4gIGxldCBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIGRpZ2l0cyksXG4gICAgICBhZGp1c3RlZE51bSA9IG51bWJlciAqIG11bHRpcGxpZXIsXG4gICAgICB0cnVuY2F0ZWROdW0gPSBNYXRoW2FkanVzdGVkTnVtIDwgMCA/ICdjZWlsJyA6ICdmbG9vciddKGFkanVzdGVkTnVtKTtcblxuICByZXR1cm4gdHJ1bmNhdGVkTnVtIC8gbXVsdGlwbGllcjtcbn07XG5cbmhlbHBlcnMuaXNDaHJvbWVCcm93c2VyID0gZnVuY3Rpb24gKGJyb3dzZXIpIHtcbiAgcmV0dXJuIF8uY29udGFpbnMoQ0hST01FX0JST1dTRVJTLCBicm93c2VyKTtcbn07XG5cbmhlbHBlcnMuZ2V0Q2hyb21lUGtnID0gZnVuY3Rpb24gKGJyb3dzZXIpIHtcbiAgbGV0IHBrZywgYWN0aXZpdHk7XG5cbiAgYnJvd3NlciA9IGJyb3dzZXIudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGJyb3dzZXIgPT09IFwiY2hyb21pdW1cIikge1xuICAgIHBrZyA9IFwib3JnLmNocm9taXVtLmNocm9tZS5zaGVsbFwiO1xuICAgIGFjdGl2aXR5ID0gXCIuQ2hyb21lU2hlbGxBY3Rpdml0eVwiO1xuICB9IGVsc2UgaWYgKGJyb3dzZXIgPT09IFwiY2hyb21lYmV0YVwiKSB7XG4gICAgcGtnID0gXCJjb20uY2hyb21lLmJldGFcIjtcbiAgICBhY3Rpdml0eSA9IFwiY29tLmdvb2dsZS5hbmRyb2lkLmFwcHMuY2hyb21lLk1haW5cIjtcbiAgfSBlbHNlIGlmIChicm93c2VyID09PSBcImJyb3dzZXJcIikge1xuICAgIHBrZyA9IFwiY29tLmFuZHJvaWQuYnJvd3NlclwiO1xuICAgIGFjdGl2aXR5ID0gXCJjb20uYW5kcm9pZC5icm93c2VyLkJyb3dzZXJBY3Rpdml0eVwiO1xuICB9IGVsc2UgaWYgKGJyb3dzZXIgPT09IFwiY2hyb21pdW0tYnJvd3NlclwiKSB7XG4gICAgcGtnID0gXCJvcmcuY2hyb21pdW0uY2hyb21lXCI7XG4gICAgYWN0aXZpdHkgPSBcImNvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluXCI7XG4gIH0gZWxzZSBpZiAoYnJvd3NlciA9PT0gXCJjaHJvbWl1bS13ZWJ2aWV3XCIpIHtcbiAgICBwa2cgPSBcIm9yZy5jaHJvbWl1bS53ZWJ2aWV3X3NoZWxsXCI7XG4gICAgYWN0aXZpdHkgPSBcIm9yZy5jaHJvbWl1bS53ZWJ2aWV3X3NoZWxsLldlYlZpZXdCcm93c2VyQWN0aXZpdHlcIjtcbiAgfSBlbHNlIHtcbiAgICBwa2cgPSBcImNvbS5hbmRyb2lkLmNocm9tZVwiO1xuICAgIGFjdGl2aXR5ID0gXCJjb20uZ29vZ2xlLmFuZHJvaWQuYXBwcy5jaHJvbWUuTWFpblwiO1xuICB9XG4gIHJldHVybiB7cGtnLCBhY3Rpdml0eX07XG59O1xuXG5oZWxwZXJzLmJvb3RzdHJhcCA9IEJvb3RzdHJhcDtcbmhlbHBlcnMudW5sb2NrZXIgPSB1bmxvY2tlcjtcblxuZXhwb3J0IGRlZmF1bHQgaGVscGVycztcbmV4cG9ydCB7IENIUk9NRV9CUk9XU0VSUyB9O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
