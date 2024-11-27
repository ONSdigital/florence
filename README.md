# Florence

The publishing platform used for the [ONS website](https://www.ons.gov.uk).

![Florence screenshot](images/Florence%20screenshot.png "Florence screenshot")

## Getting started

To run Florence you must have:

1. [Golang](https://golang.org/) installed:

   ```shell
   brew install go
   ```

1. [nvm](https://github.com/nvm-sh/nvm) installed:

   ```shell
   brew install nvm
   ```

   :warning: Make sure to follow the instructions provided at the end of the install to configure up your shell profile.

1. The node version specified in [`.nvmrc`](./.nvmrc) installed through nvm:

   ```shell
   nvm install
   ```

Once you have installed those dependencies and cloned this repo you need to run the following:

1. Move into the correct directory

    ```shell
    cd florence
    ```

1. Build node modules (you won't need to do this everytime only when the assets need to be rebuilt)

   ```shell
   make node-modules
   ```

1. Run the server

   ```shell
   make debug
   ```

Steps 2 & 3 can also be run with the following command:

```shell
make dev
```

This will build the node modules and then run the server

1. Browse to the Florence homepage http://localhost:8081/florence

1. If you are running Florence for the first time you will need to login with the setup credentials. You will be asked to change this password.

Username: florence@magicroundabout.ons.gov.uk
Password: Doug4l

Further guidance on how to use Florence can be found in [usage.md](USAGE.md)

### Dependencies

There are other ONS digital applications that you'll need to run to allow Florence to work end-to-end:

- Preview: [Babbage](https://github.com/ONSdigital/babbage)
- API: [Zebedee CMS](https://github.com/ONSdigital/zebedee)
- Preview: [Sixteens](https://github.com/ONSdigital/sixteens)
- Publishing: [The Train](https://github.com/ONSdigital/sixteens)
- Dataset upload: [Import API](https://github.com/ONSdigital/dp-import-api)
- Dataset upload: [Recipes API](https://github.com/ONSdigital/dp-recipe-api)

#### Optional (for developing Florence)

- Install [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
- Watch for JS, CSS and other source file changes

   ```shell
   make watch-src
   ```

- Update JS, CSS and other source file changes

   ```shell
   make node-modules
   ```

### Configuration

The following environment variables are available when running the Go server.

| Environment variable         | Default                           | Description
|------------------------------|-----------------------------------|------------
| BIND_ADDR                    | :8080                             | Host and port to bind to. **Note**: running `make debug` will run Florence on `:8081`
| ROUTER_URL                   | http://localhost:20000            | URL that the [frontend router](https://github.com/ONSdigital/dp-frontend-router) can be accessed on
| ZEBEDEE_URL                  | http://localhost:8082             | URL that [Zebedee](https://github.com/ONSdigital/zebedee) can be accessed on
| IMPORT_API_URL               | http://localhost:21800            | URL that the [dataset import API](https://github.com/ONSdigital/dp-import-api) can be accessed on
| RECIPE_API_URL               | http://localhost:22300            | URL that the [dataset recipes API](https://github.com/ONSdigital/dp-recipe-api) can be accessed on
| DATASET_API_URL              | http://localhost:22000            | URL that the [dataset API](https://github.com/ONSdigital/dp-dataset-api) can be accessed on
| TABLE_RENDERER_URL           | http://localhost:23300            | The URL that dp-table-renderer can be accessed on
| DATASET_CONTROLLER_URL       | http://localhost:24000            | Dataset controller url
| WAGTAIL_URL                  | http://localhost:8000/wagtail     | Wagtail CMS URL
| ENABLE_WAGTAIL_PROXY         | false                             | Enables proxy to Wagtail CMS
| GRACEFUL_SHUTDOWN_TIMEOUT    | 10s                               | The graceful shutdown timeout in seconds
| HEALTHCHECK_INTERVAL         | 30s                               | The period of time between health checks
| HEALTHCHECK_CRITICAL_TIMEOUT | 90s                               | The period of time after which failing checks will result in critical global check status

The following envrionment variables are available when running the Go server and within the React application:

| Environment variable      | Default | Description
|---------------------------|---------|------------
| ALLOWED_EXTERNAL_PATHS    | []string| Permitted external primary path and subpath from Florence e.g. primary path `/data-admin` allows `/data-admin/*`
| ENABLE_DATASET_IMPORT     | true    | Displays the screens to allow filterable datasets to be imported through Florence (note: it requires the whole CMD stack to be running)
| ENABLE_NEW_SIGN_IN        | false   | Enables the new sign in using the identity API (rather than zebedee)
| ENABLE_NEW_UPLOAD         | false   | Enables the image upload functionality via static files service
| ENABLE_PERMISSION_API     | false   |
| ENABLE_CANTABULAR_JOURNEY | false   | Enables the cantabular journey

For example:

```
make debug BIND_ADDR=:20000
```

### Testing

Run all tests

```shell
npm run test
```

Testing a single file

```shell
npm run test:file --file=<YOUR_FILE>
```

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

### License

Copyright © 2016-2024, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
