export class CustomSelect {
  constructor() {
    this._selects = null;
    this._select = null;

    this._onSelectClick = this._onSelectClick.bind(this);
    this._onSelectKeydown = this._onSelectKeydown.bind(this);
    this._onSelectItemClick = this._onSelectItemClick.bind(this);
    this._onSelectItemKeydown = this._onSelectItemKeydown.bind(this);
    this._onLastSelectItemKeydown = this._onLastSelectItemKeydown.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
  }

  init() {
    this._selects = document.querySelectorAll('[data-select]');

    if (!this._selects) {
      return;
    }

    this._selects.forEach((select) => {
      this._setSelectAction(select);
    });
  }

  _setSelectAction(select) {
    this._select = select;

    const button = this._select.querySelector('[data-select-button]');
    const items = this._select.querySelectorAll('[data-select-item]');

    button.addEventListener('click', this._onSelectClick);
    button.addEventListener('keydown', this._onSelectKeydown);

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this._onSelectItemClick(item, index);
      });

      item.addEventListener('keydown', (evt) => {
        this._onSelectItemKeydown(item, index, evt);
      });

      if (index === items.length - 1) {
        item.addEventListener('keydown', this._onLastSelectItemKeydown);
      }
    });
  }

  _setSelectItemAction(item, index) {
    const parent = item.closest('[data-select]');
    const buttonText = parent.querySelector('[data-select-button] .custom-select__text');
    const itemText = item.textContent;
    const select = parent.querySelector('select');
    const changeEvent = new CustomEvent('change');
    const inputEvent = new CustomEvent('input');
    select.dispatchEvent(changeEvent);
    select.dispatchEvent(inputEvent);
    const options = parent.querySelectorAll('option');
    const form = select.closest('form');

    if (form) {
      const formChangeEvent = new CustomEvent('change');
      const formInputEvent = new CustomEvent('input');
      form.dispatchEvent(formChangeEvent);
      form.dispatchEvent(formInputEvent);
    }

    const activeItem = parent.querySelector('[data-select-item][aria-selected="true"]');

    if (item.getAttribute('aria-selected') === true) {
      this._closeSelect();
    } else {
      if (activeItem) {
        activeItem.setAttribute('aria-selected', false);
      }

      item.setAttribute('aria-selected', 'true');
      buttonText.innerText = itemText;
      options[index + 1].selected = true;
      this._closeSelect();
    }
  }

  _closeSelect() {
    const activeSelect = document.querySelector('[data-select].is-open');

    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('click', this._onEscapeKeydown);

    if (activeSelect) {
      activeSelect.classList.remove('is-open');
    }
  }

  _onSelectClick(evt) {
    const parent = evt.target.closest('[data-select]');
    const activeSelect = document.querySelector('[data-select].is-open');

    if (activeSelect && activeSelect === parent) {
      activeSelect.classList.remove('is-open');
      return;
    }

    if (activeSelect) {
      this._closeSelect();
    }

    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onEscapeKeydown);

    if (parent.classList.contains('is-open')) {
      parent.classList.remove('is-open');
    } else {
      parent.classList.add('is-open');
    }
  }

  _onSelectKeydown(evt) {
    const parent = evt.target.closest('[data-select]');
    if (evt.shiftKey && evt.key === 'Tab' && parent.classList.contains('is-open')) {
      this._closeSelect();
    }
  }

  _onSelectItemClick(item, index) {
    this._setSelectItemAction(item, index);
  }

  _onSelectItemKeydown(item, index, evt) {
    if (evt.key === 'Enter') {
      this._setSelectItemAction(item, index);
    }
  }

  _onLastSelectItemKeydown(evt) {
    if (evt.key === 'Tab') {
      this._closeSelect();
    }
  }

  _onDocumentClick(evt) {
    if (!evt.target.closest('[data-select]')) {
      this._closeSelect();
    }
  }

  _onEscapeKeydown(evt) {
    if (evt.key === 'Escape') {
      this._closeSelect();
    }
  }
}
