import http from "../http";

export default class topics {
    static getCanonicalTopics() {
        return http.get(`/topics`, false, false);
    }

    static getCanonicalSubTopics(canonicalTopicId) {
        return http.get(`/topics/${canonicalTopicId}/subtopics`, false, false);
    }
}
