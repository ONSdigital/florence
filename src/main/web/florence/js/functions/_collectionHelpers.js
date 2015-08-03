function getLastEditedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

  var pageEvents = collection.eventsByUri[safeUri];

  var lastEditedEvent = _.chain(pageEvents)
    .filter(function (event) {
      return event.type === 'EDITED'
    })
    .sortBy(function (event) {
      return event.date;
    })
    .last()
    .value();

  return lastEditedEvent;
}

function getCollectionCreatedEvent(events) {

  var event = _.chain(events)
    .filter(function (event) {
      return event.type === 'CREATED'
    })
    .last()
    .value();

  return event;
}

function getLastCompletedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

   var lastCompletedEvent;

  if (collection.eventsByUri) {
    var pageEvents = collection.eventsByUri[safeUri];
    if (pageEvents) {
      lastCompletedEvent = _.chain(pageEvents)
        .filter(function (event) {
          return event.type === 'COMPLETED'
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

