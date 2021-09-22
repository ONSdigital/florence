Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I am not signed in

  Scenario: A User signing in without an email address
    When I sign in as "publisher" user ""
    Then I am not signed in
    And I should see the "missing email" element

  Scenario: A User signing in without a password
    When I sign in as "publisher" user "no.password@ons.gov.uk"
    Then I am not signed in
    And I should see the "missing password" element

  Scenario: A Publisher signing in with valid credentials
    When I sign in as "publisher" user "a.publisher@ons.gov.uk"
    Then I am signed in

  Scenario: A Publisher signing in with invalid credentials
    When I sign in as "publisher" user "not.a.user@ons.gov.uk"
    Then I am not signed in

  Scenario: A Admin signing in with valid credentials
    When I sign in as "admin" user "a.admin@ons.gov.uk"
    Then I am signed in

  Scenario: A Admin signing in with invalid credentials
    When I sign in as "admin" user "not.a.user@ons.gov.uk"
    Then I am not signed in

  Scenario: A Viewer signing in with valid credentials
    When I sign in as "viewer" user "a.viewer@ons.gov.uk"
    Then I am signed in

  Scenario: A Viewer signing in with invalid credentials
    When I sign in as "viewer" user "not.a.user@ons.gov.uk"
    Then I am not signed in
