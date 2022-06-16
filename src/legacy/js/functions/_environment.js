function isDevOrSandpit () {
    var hostname = window.location.hostname;
    var env = {};

    if(hostname.indexOf('develop') > -1) {
        env.name = 'develop'
    }

    if(hostname.indexOf('.dp.aws.') > -1) {
        env.name = 'sandbox'
    }

    // if((hostname.indexOf('127') > -1) || (hostname.indexOf('localhost')) > -1) {
    //     env.name = 'localhost'
    // }

    return env;
}
