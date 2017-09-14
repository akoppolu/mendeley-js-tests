Feature: Create Mendeley Account
  As a user
  I want to create an account on Mendeley website

  Scenario: Create an account
    Given user navigates to Mendeley  website
    And clicks on Create Account link
    When user enters all the mandatory fields
    And clicks on Continue
    And select Field of study
    And select Academic status
    And hit Create account
    Then user account should be created

  Scenario: Check validation message for Duplicate user accounts
    Given user naviates to Mendeley  website
    And clicks on Create Account link
    When user enters an existing user email address
    And clicks on Continue
    Then error message should be displayed for duplicate user account creation

  Scenario: Check all the mandatory fileds
    Given user naviates to Mendeley  website
    And clicks on Create Account link
    When user clicks on Continue
    Then validation errors should be displayed for all the mandatory fields
    When user enters all the mandatory fields
    And clicks on Continue
    And hit Create account
    Then validation errors should be displayed for all the mandatory dropdowns


  Scenario: Check validation message for invalid email format
    Given user naviates to Mendeley  website
    And clicks on Create Account link
    When user enters invalid email address
    Then validation errors should be displayed for emaild addresss field


  Scenario: Check validation message for Password field length
    Given user naviates to Mendeley  website
    And clicks on Create Account link
    When user enters password length less than 7 characters
    Then validation errors should be displayed for password field