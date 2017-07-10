import { browserHistory } from 'react-router';
import { store } from '../config/store';

/**
 * Redirects to one of the main views in Florence - chooses whether it needs to redirect to old Florence or route within the new application
 * 
 * @param {string} - The path of the view that we want to redirect to
 */

export default function redirectToMainScreen(screen) {
    const rootPath = store.getState().state.rootPath;

    if (screen === `${rootPath}/teams`) {
        browserHistory.push(`${rootPath}/teams`);
        return;
    }

    if (screen === `${rootPath}/collections` || screen === `${rootPath}/publishing-queue` || screen === `${rootPath}/reports` || screen === `${rootPath}/users-and-access`) {
        window.location.href = screen;
        return;
    }

    window.location.href = `${rootPath}/collections`;
}