Feature: User sign in

  As a Viewer, Publisher or Admin

  Background:
    Given I am signed in

  Scenario: A user signs out
    When I click sign out
    Then I am not signed in
