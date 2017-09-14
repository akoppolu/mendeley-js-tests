'use strict';
var {By, until, Key} = require('selenium-webdriver');
module.exports={

    elements: {
        textLocEmailAddress : By.name('email'),
        textLocFirstName : By.name('first_name'),
        textLocLastName : By.name('last_name'),
        textLocPassword : By.name('password'),
        linkLocContinue : By.linkText('button'),
        selectLocFieldOfStudy : By.name('subject_area'),
        selectLocAcademicStatus  : By.name('user_role')
    },

    inputEmail: function (email) {
        this.driver.findElement.textLocEmailAddress.sendKeys(email);
    },
    inputFirstName: function (firstName) {
        this.driver.findElement.textLocFirstName.sendKeys(firstName);
    },
    inputLastName: function (lastName) {
        this.driver.findElement.textLocLastName.sendKeys(lastName);
    },
    inputPassword: function (password) {
        this.driver.findElement.textLocPassword.sendKeys(password);
    },
    clickContinue: function () {
        this.driver.findElement.linkLocContinue.click();
    },
    selectFieldOfStudy: function (subjectArea) {
        this.driver.findElement.selectLocFieldOfStudy.click();
    },
    selectAcademicStatus: function (academicStatus) {
        this.driver.findElement.selectLocAcademicStatus.click();
    }

};