export class VersionManager {
    constructor() {
        this.versionElement = document.querySelector('.version-tag');
        this.currentVersion = {
            major: 2,
            minor: 5,
            patch: 2
        };
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.versionElement) {
            this.versionElement.textContent = `v${this.currentVersion.major}.${this.currentVersion.minor}.${this.currentVersion.patch}`;
            
            // Add tooltip with additional information
            this.versionElement.title = `Last updated: ${new Date().toLocaleDateString()}`;
        }
    }

    // Method to increment version numbers
    increment(type = 'patch') {
        switch (type) {
            case 'major':
                this.currentVersion.major++;
                this.currentVersion.minor = 0;
                this.currentVersion.patch = 0;
                break;
            case 'minor':
                this.currentVersion.minor++;
                this.currentVersion.patch = 0;
                break;
            case 'patch':
                this.currentVersion.patch++;
                break;
        }
        this.updateDisplay();
        this.saveVersion();
    }

    // Save version to localStorage
    saveVersion() {
        localStorage.setItem('siteVersion', JSON.stringify(this.currentVersion));
    }

    // Load version from localStorage
    loadVersion() {
        const saved = localStorage.getItem('siteVersion');
        if (saved) {
            this.currentVersion = JSON.parse(saved);
            this.updateDisplay();
        }
    }
}
