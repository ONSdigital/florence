/**
 *  Get the network speed from zebedee/ping endpoint and output the network health
 **/

function networkStatus(ping) {
    if (ping > 0 && ping < 100) {
        $('.icon-status div').css({"opacity": "1.0"});
    } else if (ping >= 100 && ping < 200) {
        $('.icon-status--good').css({"opacity": "0.1"});
        $('.icon-status--ok').css({"opacity": "1.0"});
        $('.icon-status--poor').css({"opacity": "1.0"});
        $('.icon-status--very-poor').css({"opacity": "1.0"});
    } else if (ping >= 200 && ping < 300) {
        $('.icon-status--good').css({"opacity": "0.1"});
        $('.icon-status--ok').css({"opacity": "0.1"});
        $('.icon-status--poor').css({"opacity": "1.0"});
        $('.icon-status--very-poor').css({"opacity": "1.0"});
    } else if (ping >= 300) {
        $('.icon-status--good').css({"opacity": "0.1"});
        $('.icon-status--ok').css({"opacity": "0.1"});
        $('.icon-status--poor').css({"opacity": "0.1"});
        $('.icon-status--very-poor').css({"opacity": "1.0"});
    }
}