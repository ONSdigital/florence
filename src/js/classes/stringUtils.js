var StringUtils = {
  textareaLines: function (line, maxLineLength, start, numberOfLinesCovered) {

    if (start + maxLineLength >= line.length) {
      //console.log('Line Length = ' + numberOfLinesCovered);
      return numberOfLinesCovered;
    }

    var substring = line.substr(start, maxLineLength + 1);
    var actualLineLength = substring.lastIndexOf(' ') + 1;

    if (actualLineLength === maxLineLength) // edge case - the break is at the end of the line exactly with a space after it
    {
      actualLineLength--;
    }

    if (start + actualLineLength === line.length) {
      return numberOfLinesCovered;
    }

    if (actualLineLength === 0) {
      actualLineLength = maxLineLength;
    }

    //if(numberOfLinesCovered < 30) {
    //  console.log('Line: ' + numberOfLinesCovered + ' length = ' + actualLineLength);
    //}
    return StringUtils.textareaLines(line, maxLineLength, start + actualLineLength, numberOfLinesCovered + 1);
  },

  formatIsoDateString: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFullDateString: function (input) {
    var date = new Date(input);
//    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date);        //+ ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFull: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFullSec: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes + ':' + seconds;
    return formattedDate;
  },

  randomId: function () {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4());
  }

};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = StringUtils;
}

