Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I am not signed in

  Scenario: A user signing in with valid credentials
    When I sign in as "publisher" user "test username"
    Then I am signed in

  Scenario: A user signing in with invalid credentials
    When I sign in as "publisher" user "invalid test username"
    Then I am not signed in
