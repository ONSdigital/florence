/**
 * manage migration link
 * @param templateData
 * @param data
 * @param isReadOnlyMigrationPath
 * @param warnOnNonMigrationSave
 */

async function migration(templateData, data, isReadOnlyMigrationPath = false, warnOnNonMigrationSave = false) {
    const migrationConfig = window.getEnv().enableMigrationField;
    if (migrationConfig) {
        Florence.Editor.warnOnNonMigrationSave = warnOnNonMigrationSave;
        Florence.Editor.hasMigrationLink = data.description?.migrationLink || '';
        Florence.Editor.hasNonMigrationChanges = false;
        templateData.readOnlyMigrationPath = isReadOnlyMigrationPath;
        let html = templates.migration(templateData);
        $('#migration').replaceWith(html);

        if (!isReadOnlyMigrationPath) {
            $('#migration_link').on('input', function () {
                let input = $(this).val();
                data.description.migrationLink = input.trim();
            });
        }
    }
}

function shouldBlockNonMigrationSave() {
    Florence.Editor.hasNonMigrationChanges = hasNonMigrationInputChanges();

    if (Florence.Editor.warnOnNonMigrationSave && Florence.Editor.hasMigrationLink && Florence.Editor.isDirty && Florence.Editor.hasNonMigrationChanges) {
        sweetAlert(...PAGE_CONTENT_MIGRATED);
        return true;
    }

    return false;
}

function hasNonMigrationInputChanges() {
    let hasChanges = false;

    $('.workspace-edit :input').not('#migration_link').each(function () {
        if (hasInputChanged(this)) {
            hasChanges = true;
            return false;
        }
    });

    return hasChanges;
}

function hasInputChanged(input) {
    const type = (input.type || '').toLowerCase();

    if (type === 'button' || type === 'submit' || type === 'reset' || type === 'file') {
        return false;
    }

    if (type === 'checkbox') {
        return input.checked !== input.defaultChecked;
    }

    return input.value !== input.defaultValue;
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
