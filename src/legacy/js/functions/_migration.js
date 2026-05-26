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
        Florence.Editor.hasMigrationLink = data.description?.migrationLink || '';
        Florence.Editor.warnOnNonMigrationSave = warnOnNonMigrationSave;
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
    // no warning if no changes have been made
    if (!Florence.Editor.isDirty) {
        return false;
    }

    const hasNonMigrationChanges = hasNonMigrationInputChanges();

    let currentMigrationLink = $('#migration_link').val();
    if (currentMigrationLink) {
        currentMigrationLink = currentMigrationLink.trim();
    }
    const hasMigrationLink = Florence.Editor.hasMigrationLink || currentMigrationLink;

    if (Florence.Editor.warnOnNonMigrationSave && hasMigrationLink && hasNonMigrationChanges) {
        sweetAlert(...MIGRATED_PAGE_CONTENT);
        return true;
    }

    return false;
}

// Blocks save and shows warning if content has a migration link.
function blockNonMigrationChangeWithWarning() {
    let currentMigrationLink = $('#migration_link').val();
    if (currentMigrationLink) {
        currentMigrationLink = currentMigrationLink.trim();
    }
    const hasMigrationLink = Florence.Editor.hasMigrationLink || currentMigrationLink;

    if (Florence.Editor.warnOnNonMigrationSave && hasMigrationLink) {
        sweetAlert(...MIGRATED_PAGE_CONTENT);
        return true;
    }
    return false;
}

// Disables save buttons for content that has been migrated.
function disableSaveButtonsForMigratedContent() {
    if (!Florence.Editor.hasMigrationLink) {
        return;
    }
    $('.btn-edit-save, .btn-edit-save-and-submit-for-review, .btn-edit-save-and-submit-for-approval')
        .addClass('btn--disabled')
        .prop('disabled', true);
    
    sweetAlert(...MIGRATED_DATASET_CONTENT);
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
        const changed = input.checked !== input.defaultChecked;
        return changed;
    }

    const changed = input.value !== input.defaultValue;
    return changed;
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
