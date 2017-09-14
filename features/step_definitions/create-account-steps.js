'use strict';

var {defineSupportCode} = require('cucumber');
var {expect} = require('chai');
var {By, until, Key} = require('selenium-webdriver');
var url = 'https://www.mendeley.com';
var linkCreateAccount = By.linkText('Create account');
var textLocEmailAddress = By.name('email');
var textLocFName =By.name('first_name');
var textLocLName = By.name('last_name');
var textLocPassword = By.name('password');
var linkLocContinue = By.xpath('//button/span');
var selectSubArea =By.name('subject_area');
var selectUserRole =By.name('user_role');
var btnLocCreateAccount = By.id('join-form-submit');
var timeout = 2000;

defineSupportCode(function({When, Then,Given}) {

    Given('user navigates to Mendeley  website', function (next) {
        this.driver.get(url)
            .then(function() {
                next();
            });
    });

    Given('clicks on Create Account link', function (next) {
         this.driver.findElement(linkCreateAccount).click()
            .then(function() {
                next();
            });
    });

    When('user enters all the mandatory fields', function  (next) {

        var emailAddress = 'test' + Date.now() + '@gmail.com';
        this.driver.switchTo().defaultContent();
        this.driver.sleep(2000);
        this.driver.findElement(textLocEmailAddress).sendKeys(emailAddress);
        this.driver.findElement(textLocFName).sendKeys("test first");
        this.driver.findElement(textLocLName).sendKeys("test last");
        this.driver.findElement(textLocPassword).sendKeys("test1234567")
            .then(function() {
                next();
            });

    });
    When('clicks on Continue', function (next) {
        this.driver.findElement(linkLocContinue).click()
            .then(function() {
                next();
            });
    });
    When('select Field of study', function (next) {
        this.driver.switchTo().defaultContent();
        this.driver.sleep(2000);

        this.driver.findElement(selectSubArea).sendKeys("Chemistry")
            .then(function () {
                next();
            });
    });
    When('select Academic status', function (next) {
        this.driver.switchTo().defaultContent();
        this.driver.sleep(2000);

        this.driver.findElement(selectUserRole).sendKeys("Librarian")
            .then(function () {
                next();
            });
    });
    When('hit Create account', function (next) {
        this.driver.findElement(btnLocCreateAccount).click()
            .then(function() {
            next();
            });
    });
    Then('user account should be created', function (next) {
        this.driver.switchTo().defaultContent();
        this.driver.sleep(4000);

        this.driver.findElement(By.css("#wj-step-1 h1"))
            .then(function () {
                next();
            });

    });

    Given('user naviates to Mendeley  website', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    When('user enters an existing user email address', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('error message should be displayed for duplicate user account creation', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    When('user clicks on Continue', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('validation errors should be displayed for all the mandatory fields', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('validation errors should be displayed for all the mandatory dropdowns', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    When('user enters invalid email address', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('validation errors should be displayed for emaild addresss field', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    When('user enters password length less than {int} characters', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('validation errors should be displayed for password field', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });


});
