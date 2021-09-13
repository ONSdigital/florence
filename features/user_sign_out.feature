Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I have auth tokens

  Scenario: A user signs out
    When I sign out
    Then I am not signed in
