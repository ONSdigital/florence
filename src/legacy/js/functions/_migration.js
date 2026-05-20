/**
 * manage migration link
 * @param templateData
 * @param data
 * @param isReadOnlyMigrationPath
 */

async function migration(templateData, data, isReadOnlyMigrationPath = false) {
    const migrationConfig = window.getEnv().enableMigrationField;
    if (migrationConfig) {
        Florence.Editor.hasMigrationLink = data.description?.migrationLink || '';
        templateData.readOnlyMigrationPath = isReadOnlyMigrationPath;
        let html = templates.migration(templateData)
        $('#migration').replaceWith(html);

        if (!isReadOnlyMigrationPath) {
            $('#migration_link').on('input', function () {
                let input = $(this).val();
                data.description.migrationLink = input.trim();
            });
        }
    }
}

/**
 * Disables save buttons for content that has been migrated.
 */
function disableSaveButtonsForMigratedContent() {
    if (!Florence.Editor.hasMigrationLink) {
        return;
    }
    $('.btn-edit-save, .btn-edit-save-and-submit-for-review, .btn-edit-save-and-submit-for-approval')
        .addClass('btn--disabled')
        .prop('disabled', true);
    
    sweetAlert(...MIGRATED_DATASET_CONTENT);
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
