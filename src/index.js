import './styles.css';
import { Popover } from './popover.js';

document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.querySelector('.popover-btn');
    if (triggerBtn) {
        const popover = new Popover(triggerBtn);
        window.__popover = popover;
    }
});

export { Popover };