Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I sign in as "publisher" user "test username"
    And I am signed in

  Scenario: A user signs out
    When I sign out
    Then I am not signed in
