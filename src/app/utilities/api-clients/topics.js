import http from "../http";
import { API_PROXY } from "./constants";

export default class topics {
    static getRootTopics() {
        return http.get(`${API_PROXY.VERSIONED_PATH}/topics`, false, false);
    }

    static getSubtopics(rootTopicId) {
        return http.get(`${API_PROXY.VERSIONED_PATH}/topics/${rootTopicId}/subtopics`, false, false);
    }
}
