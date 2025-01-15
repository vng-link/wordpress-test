const initPhoneValidation = () => {
  const forms = document.querySelectorAll('[data-validate-form] form');

  if (!forms) {
    return;
  }

  forms.forEach((form) => {
    if (form.querySelector('[data-validate-type="phone"]')) {
      const phoneInput = form.querySelector('[data-validate-type="phone"]').querySelector('input');

      phoneInput.addEventListener('input', () => {
        phoneInput.setCustomValidity('');
      });

      form.addEventListener('submit', (evt) => {
        if (phoneInput.value.length < 18) {
          phoneInput.setCustomValidity('Телефон должен содержать 11 цифр');
          phoneInput.reportValidity();
          evt.preventDefault();
        } else {
          phoneInput.setCustomValidity('');
        }
      });
    }
  });
}

export {initPhoneValidation};
