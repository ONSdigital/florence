Feature: Creating a new Collection

  As a Publisher etc.

  Background:
    Given I am logged in as "florence@magicroundabout.ons.gov.uk"

  Scenario: Something about uploading a dataset?
    When I create a new collection called "Census 2021" for manual publishing
    Then I should be presented with a editable collection titled "Census 2021"
    And the collection publishing schedule should be "Manual publish"

