module github.com/ONSdigital/florence

go 1.21

// to fix: [CVE-2023-32731]
replace google.golang.org/grpc => google.golang.org/grpc v1.58.2

// To fix: [CVE-2024-24786] CWE-835: Loop with Unreachable Exit Condition ('Infinite Loop')
replace google.golang.org/protobuf => google.golang.org/protobuf v1.33.0

require (
	github.com/ONSdigital/dp-api-clients-go/v2 v2.260.0
	github.com/ONSdigital/dp-component-test v0.9.0
	github.com/ONSdigital/dp-cookies v0.4.0
	github.com/ONSdigital/dp-healthcheck v1.6.1
	github.com/ONSdigital/dp-net/v2 v2.11.1
	github.com/ONSdigital/log.go v1.1.0
	github.com/chromedp/cdproto v0.0.0-20211126220118-81fa0469ad77
	github.com/chromedp/chromedp v0.7.6
	github.com/cucumber/godog v0.13.0
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/websocket v1.5.0
	github.com/hashicorp/go-uuid v1.0.3
	github.com/jteeuwen/go-bindata v3.0.8-0.20180305030458-6025e8de665b+incompatible
	github.com/kelseyhightower/envconfig v1.4.0
	github.com/maxcnunes/httpfake v1.2.4
	github.com/pkg/errors v0.9.1
	github.com/smartystreets/goconvey v1.8.1
	github.com/stretchr/testify v1.8.4
)

require (
	github.com/ONSdigital/dp-api-clients-go v1.43.0 // indirect
	github.com/ONSdigital/dp-mongodb-in-memory v1.7.0 // indirect
	github.com/ONSdigital/dp-net v1.5.0 // indirect
	github.com/ONSdigital/log.go/v2 v2.4.1 // indirect
	github.com/chromedp/sysutil v1.0.0 // indirect
	github.com/cucumber/gherkin/go/v26 v26.2.0 // indirect
	github.com/cucumber/messages/go/v21 v21.0.1 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/fatih/color v1.15.0 // indirect
	github.com/gobwas/httphead v0.1.0 // indirect
	github.com/gobwas/pool v0.2.1 // indirect
	github.com/gobwas/ws v1.3.0 // indirect
	github.com/gofrs/uuid v4.4.0+incompatible // indirect
	github.com/golang/snappy v0.0.4 // indirect
	github.com/gopherjs/gopherjs v1.17.2 // indirect
	github.com/hashicorp/go-immutable-radix v1.3.1 // indirect
	github.com/hashicorp/go-memdb v1.3.4 // indirect
	github.com/hashicorp/golang-lru v1.0.2 // indirect
	github.com/hokaccha/go-prettyjson v0.0.0-20211117102719-0474bc63780f // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/jtolds/gls v4.20.0+incompatible // indirect
	github.com/justinas/alice v1.2.0 // indirect
	github.com/klauspost/compress v1.17.0 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.19 // indirect
	github.com/montanaflynn/stats v0.7.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/smarty/assertions v1.15.1 // indirect
	github.com/spf13/afero v1.10.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
	github.com/xdg-go/pbkdf2 v1.0.0 // indirect
	github.com/xdg-go/scram v1.1.2 // indirect
	github.com/xdg-go/stringprep v1.0.4 // indirect
	github.com/youmark/pkcs8 v0.0.0-20201027041543-1326539a0a0a // indirect
	go.mongodb.org/mongo-driver v1.12.1 // indirect
	golang.org/x/crypto v0.31.0 // indirect
	golang.org/x/net v0.33.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.28.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
