/**
 * manage migration link
 * @param templateData
 * @param data
 */

async function migration(templateData, data) {
    const migrationConfig = window.getEnv().enableMigrationField;
    if (migrationConfig) {
        let html = templates.migration(templateData)
        $('#migration').replaceWith(html);

        $('#migration_link').on('input', function () {
            let input = $(this).val();
            data.description.migrationLink = input.trim();
        });
    }
}

// isRelativePath validates if the given path is a relative path
function isRelativePath(path) {
    if (typeof path !== 'string') {
        return false;
    }
    // Exclude periods
    if (path.includes('.')) {
        return false;
    }
    // Exclude whitespace
    if (path.includes(' ')) {
        return false;
    }
    // Exclude end slash
    if (path.endsWith('/')) {
        return false;
    }
    // Check if the path starts with '/'
    if (path.startsWith('/')) {
        return true;
    }
    return false;
}

// validateMigrationPath handles the validation of the migration path input 
function validateMigrationPath(input) {
    if (input && input !== '') {
        const isValid = isRelativePath(input);
        return isValid;
    }
    return true; // allow empty field
}
