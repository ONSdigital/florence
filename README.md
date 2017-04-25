Florence
================

The publishing platform used for the [ONS website](https://www.ons.gov.uk).

![Florence screenshot](images/Florence screenshot.png)

### Getting started

To run Florence you must have [Golang](https://golang.org/) installed on a UNIX machine.

Once you have installed those dependencies and cloned this repo you need to run the following:

1. Move into the correct directory 
```
cd florence
```
2. Run the server
```
make
```

#### Optional (for developing Florence)

3. Install [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
4. Watch for JS, CSS and other source file changes
```
cd src && npm run watch
```

### Configuration

The following environment variables are available when running the Go server.

| Environment variable | Default               | Description                             |
|----------------------|-----------------------|-----------------------------------------|
| BIND_ADDR            | :8080                 | Host and port to bind to                |
| BABBAGE_URL          | http://localhost:8080 | URL that [Babbage](https://github.com/ONSdigital/babbage) can be accessed on |
| ZEBEDEE_URL          | http://localhost:8081 | URL that [Zebedee](https://github.com/ONSdigital/zebedee) can be accessed on |

For example:
```
make BIND_ADDR=:20000
```

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

### License

Copyright © 2016-2017, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
