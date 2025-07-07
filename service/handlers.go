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
	"github.com/ONSdigital/log.go/v2/log"
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
	http.Redirect(w, req, "/florence", http.StatusMovedPermanently)
}

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := mux.Vars(req)["uri"]
	assetPath := assetStaticRoot + path

	etag, err := getAssetETag(assetPath)
	if err != nil {
		log.Error(req.Context(), "error getting asset etag", err)
		w.WriteHeader(404)
		return
	}

	if hdr := req.Header.Get("If-None-Match"); hdr != "" && hdr == etag {
		w.WriteHeader(http.StatusNotModified)
		return
	}

	b, err := getAsset(assetPath)
	if err != nil {
		log.Error(req.Context(), "error getting asset", err)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`ETag`, etag)
	w.Header().Set(`Cache-Control`, "no-cache")
	w.Header().Set(`Content-Type`, mime.TypeByExtension(filepath.Ext(path)))
	w.WriteHeader(200)
	_, err = w.Write(b)
	if err != nil {
		log.Error(req.Context(), "error writing response", err)
	}
}

func legacyIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Info(req.Context(), "getting legacy html file")

		b, err := getAsset(assetLegacyIndex)
		if err != nil {
			log.Error(req.Context(), "error getting legacy html file", err)
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Error(req.Context(), "error marshalling shared configuration", err)
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		_, err = w.Write(b)
		if err != nil {
			log.Error(req.Context(), "error writing response", err)
		}
	}
}

func websocketHandler(serviceVersion string) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		c, err := upgrader.Upgrade(w, req, nil)
		if err != nil {
			log.Error(req.Context(), "error upgrading connection to websocket", err)
			return
		}

		defer c.Close()

		err = c.WriteJSON(florenceServerEvent{"version", florenceVersionPayload{Version: serviceVersion}})
		if err != nil {
			log.Error(req.Context(), "error writing version message", err)
			return
		}

		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				log.Error(req.Context(), "error reading websocket message", err)
				break
			}

			rdr := bufio.NewReader(bytes.NewReader(message))
			b, err := rdr.ReadBytes('{')
			if err != nil {
				log.Error(req.Context(), "error reading websocket bytes", err, log.Data{"bytes": string(b)})
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
					log.Error(req.Context(), "error unmarshalling websocket message", err, log.Data{"data": string(eventData)})
					continue
				}
				log.Info(req.Context(), "client log", log.Data{"data": e})

				err = c.WriteJSON(florenceServerEvent{"ack", eventID})
				if err != nil {
					log.Error(req.Context(), "error writing websocket ack", err)
				}
			default:
				log.Error(req.Context(), "unknown websocket event type", err, log.Data{"type": eventType, "data": string(eventData)})
			}
		}
	}
}

func refactoredIndexFile(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		log.Info(req.Context(), "getting refactored html file")

		b, err := getAsset(assetRefactored)
		if err != nil {
			log.Error(req.Context(), "error getting refactored html file", err)
			w.WriteHeader(404)
			return
		}

		cfgJSON, err := json.Marshal(cfg.SharedConfig)
		if err != nil {
			log.Error(req.Context(), "error marshalling shared configuration", err)
			w.WriteHeader(500)
			return
		}
		b = []byte(strings.Replace(string(b), "/* environment variables placeholder */", "/* server generated shared config */ "+string(cfgJSON), 1))

		w.Header().Set(`Content-Type`, "text/html")
		w.WriteHeader(200)
		_, err = w.Write(b)
		if err != nil {
			log.Error(req.Context(), "error writing response", err)
		}
	}
}

func DeleteHTTPCookie() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c := &http.Cookie{
			Name:    "access_token",
			Value:   "",
			Path:    "/",
			Expires: time.Unix(0, 0),
		}
		http.SetCookie(w, c)
		w.WriteHeader(http.StatusAccepted)
	}
}
