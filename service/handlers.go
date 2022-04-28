package service

import (
	"bufio"
	"bytes"
	"encoding/json"
	"mime"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/ONSdigital/florence/config"
	"github.com/ONSdigital/log.go/log"
	"github.com/gorilla/mux"
)

// generated files constants
const (
	assetStaticRoot  = "../dist/"
	assetLegacyIndex = "../dist/legacy-assets/index.html"
	assetRefactored  = "../dist/refactored.html"
)

type florenceLogEvent struct {
	ServerTimestamp string      `json:"-"`
	ClientTimestamp time.Time   `json:"clientTimestamp"`
	Type            string      `json:"type"`
	Location        string      `json:"location"`
	InstanceID      string      `json:"instanceID"`
	Payload         interface{} `json:"payload"`
}

type florenceServerEvent struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type florenceVersionPayload struct {
	Version string `json:"version"`
}

func redirectToFlorence(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "/florence", 301)
}

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := mux.Vars(req)["uri"]
	assetPath := assetStaticRoot + path

	etag, err := getAssetETag(assetPath)

	if hdr := req.Header.Get("If-None-Match"); len(hdr) > 0 && hdr == etag {
		w.WriteHeader(http.StatusNotModified)
		return
	}

	b, err := getAsset(assetPath)
	if err != nil {
		log.Event(req.Context(), "error getting asset", log.ERROR, log.Error(err))
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`ETag`, etag)
	w.Header().Set(`Cache-Control`, "no-cache")
	w.Header().Set(`Content-Type`, mime.TypeByExtension(filepath.Ext(path)))
	w.WriteHeader(200)
	w.Write(b)
}

func legacyIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Event(req.Context(), "getting legacy html file", log.INFO)

		b, err := getAsset(assetLegacyIndex)
		if err != nil {
			log.Event(req.Context(), "error getting legacy html file", log.ERROR, log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.ERROR, log.Error(err))
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		w.Write(b)
	}
}

func websocketHandler(serviceVersion string) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		c, err := upgrader.Upgrade(w, req, nil)
		if err != nil {
			log.Event(req.Context(), "error upgrading connection to websocket", log.ERROR, log.Error(err))
			return
		}

		defer c.Close()

		err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: serviceVersion}})
		if err != nil {
			log.Event(req.Context(), "error writing version message", log.ERROR, log.Error(err))
			return
		}

		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Event(req.Context(), "error reading websocket message", log.ERROR, log.Error(err))
				break
			}

			rdr := bufio.NewReader(bytes.NewReader(message))
			b, err := rdr.ReadBytes('{')
			if err != nil {
				log.Event(req.Context(), "error reading websocket bytes", log.WARN, log.Error(err), log.Data{"bytes": string(b)})
				continue
			}

			tags := strings.Split(string(b), ":")
			eventID := tags[0]
			eventType := tags[1]
			eventData := message[len(eventID)+len(eventType)+2:]

			switch eventType {
			case "log":
				var e florenceLogEvent
				e.ServerTimestamp = time.Now().UTC().Format("2006-01-02T15:04:05.000-0700Z")
				err = json.Unmarshal(eventData, &e)
				if err != nil {
					log.Event(req.Context(), "error unmarshalling websocket message", log.WARN, log.Error(err), log.Data{"data": string(eventData)})
					continue
				}
				log.Event(req.Context(), "client log", log.INFO, log.Data{"data": e})

				err = c.WriteJSON(florenceServerEvent{"ack", eventID})
				if err != nil {
					log.Event(req.Context(), "error writing websocket ack", log.WARN, log.Error(err))
				}
			default:
				log.Event(req.Context(), "unknown websocket event type", log.WARN, log.Data{"type": eventType, "data": string(eventData)})
			}
		}
	}
}

func refactoredIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Event(req.Context(), "getting refactored html file", log.INFO)

		b, err := getAsset(assetRefactored)
		if err != nil {
			log.Event(req.Context(), "error getting refactored html file", log.ERROR, log.Error(err))
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Event(req.Context(), "error marshalling shared configuration", log.ERROR, log.Error(err))
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		w.Write(b)
	}
}
