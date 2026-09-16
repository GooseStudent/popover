import './styles.css';

export class Popover {
    constructor(triggerElement) {
        this.trigger = triggerElement;
        this.title = triggerElement.dataset.popoverTitle || '';
        this.content = triggerElement.dataset.popoverContent || '';
        this.isOpen = false;
        this.popover = null;

        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onResize = this.onResize.bind(this);

        this.init();
    }

    init() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        document.addEventListener('click', this.onDocumentClick);
        document.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('resize', this.onResize);
    }

    createPopoverElement() {
        const el = document.createElement('div');
        el.className = 'popover';
        el.setAttribute('role', 'tooltip');

        el.innerHTML = `
            <div class="popover-header">
                <h3 class="popover-title"></h3>
                <button class="popover-close" aria-label="Close">×</button>
            </div>
            <div class="popover-body">
                <p class="popover-text"></p>
            </div>
        `;

        el.querySelector('.popover-title').textContent = this.title;
        el.querySelector('.popover-text').textContent = this.content;

        el.querySelector('.popover-close').addEventListener('click', () => {
            this.hide();
        });

        document.body.appendChild(el);
        return el;
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        if (!this.popover) {
            this.popover = this.createPopoverElement();
        }
        this.isOpen = true;
        this.popover.classList.add('active');
        this.positionPopover();
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    hide() {
        this.isOpen = false;
        if (this.popover) {
            this.popover.classList.remove('active');
        }
        this.trigger.setAttribute('aria-expanded', 'false');
    }

    onDocumentClick(e) {
        if (!this.isOpen) return;
        const target = e.target;
        const isInside =
            (this.popover && this.popover.contains(target)) ||
            this.trigger.contains(target);
        if (!isInside) {
            this.hide();
        }
    }

    onKeyDown(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.hide();
        }
    }

    onResize() {
        if (this.isOpen) {
            this.positionPopover();
        }
    }

    positionPopover() {
        const triggerRect = this.trigger.getBoundingClientRect();
        const popoverRect = this.popover.getBoundingClientRect();

        let top = triggerRect.top - popoverRect.height - 10;
        let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

        if (top < 10) {
            top = triggerRect.bottom + 10;
            this.popover.classList.remove('popover--top');
            this.popover.classList.add('popover--bottom');
        } else {
            this.popover.classList.remove('popover--bottom');
            this.popover.classList.add('popover--top');
        }

        if (left < 10) left = 10;
        if (left + popoverRect.width > window.innerWidth - 10) {
            left = window.innerWidth - popoverRect.width - 10;
        }

        this.popover.style.top = `${top + window.scrollY}px`;
        this.popover.style.left = `${left + window.scrollX}px`;

        const arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
        this.popover.style.setProperty('--arrow-left', `${arrowLeft}px`);
    }

    destroy() {
        this.hide();
        if (this.popover && this.popover.parentNode) {
            this.popover.parentNode.removeChild(this.popover);
        }
        document.removeEventListener('click', this.onDocumentClick);
        document.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('resize', this.onResize);
    }
}