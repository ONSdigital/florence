function getLastEditedEvent(collection, page) {
  var pageEvents = collection.eventsByUri[page];

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

function getLastCompletedEvent(collection, page) {
  var pageEvents = collection.eventsByUri[page];
  var lastCompletedEvent = _.chain(pageEvents)
    .filter(function (event) {
      return event.type === 'COMPLETED';
    })
    .sortBy(function (event) {
      return event.date;
    })
    .last()
    .value();

  return lastCompletedEvent;
}

