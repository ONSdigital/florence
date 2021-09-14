#Feature: Creating a new Collection
#
#  As a Publisher etc.
#
#  Background:
#    Given I sign in as "publisher" user "florence@magicroundabout.ons.gov.uk"
#
#  Scenario: Creating a new collection for manual publishing
#    When I create a new collection called "Census 2021" for manual publishing
#    Then a collection with these details should be created:
#    """
#    {"name":"Census 2021","type":"manual","publishDate":null,"teams":[],"collectionOwner":"ADMIN","releaseUri":null}
#    """
#    And I should be presented with a editable collection titled "Census 2021"
#    And the collection publishing schedule should be "Manual publish"

