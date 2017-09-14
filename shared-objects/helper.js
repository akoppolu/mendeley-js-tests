'use strict';
var {By, until, Key} = require('selenium-webdriver');
module.exports ={

    loadPage:function (url) {
        return this.driver.get(url).then(function () {
            return this.driver.wait(until.elementLocated(By.css('body')),2000);

        });
    }
};