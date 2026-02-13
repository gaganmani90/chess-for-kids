// ===== NAVIGATION SYSTEM =====
// Section switching and navigation management

import { Sound } from './sound.js';

export function initNavigation(sectionInitFunctions) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
            Sound.click();
            const sectionId = btn.dataset.section;
            showSection(sectionId, sectionInitFunctions);
        });
    });
}

export function showSection(sectionId, sectionInitFunctions) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Initialize section if it has an init function
    if (sectionInitFunctions[sectionId]) {
        sectionInitFunctions[sectionId]();
    }
}
