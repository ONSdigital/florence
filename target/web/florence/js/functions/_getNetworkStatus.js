/**
 *  Get the network speed from zebedee/ping endpoint and output the network health
 **/

function networkStatus(ping) {
    var $good = $('.icon-status--good'),
        $ok = $('.icon-status--ok'),
        $poor = $('.icon-status--poor'),
        $veryPoor = $('.icon-status--very-poor');

    if (ping > 0 && ping < 100) {
        $('.icon-status div').css({"opacity": "1.0"});
    } else if (ping >= 100 && ping < 200) {
        $good.css({"opacity": "0.2"});
        $ok.css({"opacity": "1.0"});
        $poor.css({"opacity": "1.0"});
        $veryPoor.css({"opacity": "1.0"});
    } else if (ping >= 200 && ping < 300) {
        $good.css({"opacity": "0.2"});
        $ok.css({"opacity": "0.2"});
        $poor.css({"opacity": "1.0"});
        $veryPoor.css({"opacity": "1.0"});
    } else if (ping >= 300) {
        $good.css({"opacity": "0.2"});
        $ok.css({"opacity": "0.2"});
        $poor.css({"opacity": "0.2"});
        $veryPoor.css({"opacity": "1.0"});
    }
}