    import './styles.css';

class Popover {
    constructor(triggerElement, popoverElement) {
        this.trigger = triggerElement;
        this.popover = popoverElement;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        const closeBtn = this.popover.querySelector('.popover-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                const target = e.target;
                const isInside = this.popover.contains(target) || this.trigger.contains(target);
                if (!isInside) {
                    this.hide();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });

        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.positionPopover();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.isOpen = true;
        this.popover.classList.add('active');
        this.positionPopover();
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    hide() {
        this.isOpen = false;
        this.popover.classList.remove('active');
        this.trigger.setAttribute('aria-expanded', 'false');
    }

    positionPopover() {
        const triggerRect = this.trigger.getBoundingClientRect();
        const popoverRect = this.popover.getBoundingClientRect();

        let top = triggerRect.top - popoverRect.height - 10;
        let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

        if (top < 10) {
            top = triggerRect.bottom + 10;
            this.popover.style.setProperty('--arrow-direction', 'bottom');
        } else {
            this.popover.style.setProperty('--arrow-direction', 'top');
        }

        if (left < 10) {
            left = 10;
        }

        if (left + popoverRect.width > window.innerWidth - 10) {
            left = window.innerWidth - popoverRect.width - 10;
        }

        this.popover.style.top = `${top + window.scrollY}px`;
        this.popover.style.left = `${left + window.scrollX}px`;
    }

    destroy() {
        this.hide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.querySelector('.popover-btn');
    const popoverElement = document.querySelector('.popover');

    if (triggerBtn && popoverElement) {
        const popover = new Popover(triggerBtn, popoverElement);
        window.__popover = popover;
    }
});