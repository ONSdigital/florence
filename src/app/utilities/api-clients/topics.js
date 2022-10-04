import http from "../http";

export default class topics {
    static getRootTopics() {
        return http.get(`/topics`, false, false);
    }

    static getSubTopics(rootTopicId) {
        return http.get(`/topics/${rootTopicId}/subtopics`, false, false);
    }
}
