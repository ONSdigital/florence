/**
 * Return the last edited event for the given page, from the given collection.
 * @param collection
 * @param page
 * @returns {*}
 */
function getLastEditedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

  var pageEvents = collection.eventsByUri[safeUri];

  var lastEditedEvent = _.chain(pageEvents)
    .filter(function (event) {
      return event.type === 'EDITED';
    })
    .sortBy(function (event) {
      return event.date;
    })
    .last()
    .value();

  return lastEditedEvent;
}

/**
 * Return the collection created event from the given collection of events.
 * @param events
 * @returns {*}
 */
function getCollectionCreatedEvent(events) {

  var event = _.chain(events)
    .filter(function (event) {
      return event.type === 'CREATED';
    })
    .last()
    .value();

  return event;
}

/**
 * Return the last completed event for the given page, from the given collection.
 * @param collection
 * @param page
 * @returns {*}
 */
function getLastCompletedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

   var lastCompletedEvent;

  if (collection.eventsByUri) {
    var pageEvents = collection.eventsByUri[safeUri];
    if (pageEvents) {
      lastCompletedEvent = _.chain(pageEvents)
        .filter(function (event) {
          return event.type === 'COMPLETED';
        })
        .sortBy(function (event) {
          return event.date;
        })
        .last()
        .value();
    }
  }
  return lastCompletedEvent;
}

