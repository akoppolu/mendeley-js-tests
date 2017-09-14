'use strict';
var {By, until, Key} = require('selenium-webdriver');
module.exports={

    elements:{
        linkCreateAccount : By.linkText('/join/')
    },

    clickCreateAccount:function () {

        this.driver.findElement.linkCreateAccount.click();

    }
};