Feature: Creating a new Collection

  As a Publisher etc.

  Background:
    Given I am logged in as "florence@magicroundabout.ons.gov.uk"

  Scenario: Creating a new collection for manual publishing
    When I create a new collection called "Census 2021" for manual publishing
    Then these collection creation details should have been sent:
    """
    {"name":"Census 2021","type":"manual","publishDate":null,"teams":[],"collectionOwner":"ADMIN","releaseUri":null}
    """
    And I should be presented with a editable collection titled "Census 2021"
    And the collection publishing schedule should be "Manual publish"

