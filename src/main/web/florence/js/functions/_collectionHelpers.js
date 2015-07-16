function getLastEditedEvent(collection, page) {

  var uri = page;
  if (uri.charAt(0) !== '/') {
    uri = "/" + uri;
  }

  var pageEvents = collection.eventsByUri[uri];

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

  var uri = page;
  if (uri.charAt(0) !== '/') {
    uri = "/" + uri;
  }

   var lastCompletedEvent;

  if (collection.eventsByUri) {
    var pageEvents = collection.eventsByUri[uri];
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
  console.log(lastCompletedEvent);
  return lastCompletedEvent;
}

