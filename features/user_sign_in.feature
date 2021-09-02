Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I am not signed in

  Scenario: A user signing in with valid credentials
    When I sign in with "test username" and "test password"
    Then I am signed in

  Scenario: A user signing in with invalid credentials
    When I sign in with "test username" and "invalid test password"
    Then I am not signed in
