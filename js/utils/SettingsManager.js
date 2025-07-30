export class SettingsManager {
    constructor(storageKey, defaultSettings, version = '1.0.0') {
        this.storageKey = storageKey;
        this.defaultSettings = defaultSettings;
        this.version = version;
        this.settings = { ...defaultSettings };
        this.validators = new Map();
        this.migrationStrategies = new Map();
    }

    // Add a validator for a setting
    addValidator(key, validatorFn) {
        this.validators.set(key, validatorFn);
    }

    // Add a migration strategy for version updates
    addMigrationStrategy(fromVersion, toVersion, migrationFn) {
        const key = `${fromVersion}->${toVersion}`;
        this.migrationStrategies.set(key, migrationFn);
    }

    // Validate a single setting
    validateSetting(key, value) {
        const validator = this.validators.get(key);
        if (validator) {
            return validator(value);
        }
        return true;
    }

    // Load settings from storage
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                return this.settings;
            }

            const parsed = JSON.parse(stored);
            
            // Check version and migrate if necessary
            if (parsed.version !== this.version) {
                this.migrateSettings(parsed);
            }

            // Validate and merge with defaults
            const merged = { ...this.defaultSettings };
            for (const [key, value] of Object.entries(parsed)) {
                if (key in this.defaultSettings && this.validateSetting(key, value)) {
                    merged[key] = value;
                }
            }

            this.settings = merged;
            return this.settings;
        } catch (error) {
            console.error('Error loading settings:', error);
            return this.defaultSettings;
        }
    }

    // Save settings to storage
    save() {
        try {
            const toSave = {
                ...this.settings,
                version: this.version
            };
            localStorage.setItem(this.storageKey, JSON.stringify(toSave));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    // Update a single setting
    setSetting(key, value) {
        if (!(key in this.defaultSettings)) {
            throw new Error(`Invalid setting key: ${key}`);
        }

        if (!this.validateSetting(key, value)) {
            throw new Error(`Invalid value for setting: ${key}`);
        }

        this.settings[key] = value;
        return this.save();
    }

    // Get a single setting
    getSetting(key) {
        return this.settings[key];
    }

    // Reset all settings to defaults
    reset() {
        this.settings = { ...this.defaultSettings };
        return this.save();
    }

    // Migrate settings from one version to another
    migrateSettings(oldSettings) {
        let currentSettings = oldSettings;
        const migrations = this.findMigrationPath(oldSettings.version, this.version);
        
        for (const migration of migrations) {
            const migrationFn = this.migrationStrategies.get(migration);
            if (migrationFn) {
                currentSettings = migrationFn(currentSettings);
            }
        }

        return currentSettings;
    }

    // Find the path of migrations needed
    findMigrationPath(fromVersion, toVersion) {
        // Simplified version - in real implementation, you would need to
        // find the shortest path of available migrations
        return [`${fromVersion}->${toVersion}`];
    }
}
