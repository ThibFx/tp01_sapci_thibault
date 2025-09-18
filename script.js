const form = document.getElementById('signupForm');
const fields = {
  login: document.getElementById('login'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  nom: document.getElementById('nom'),
  prenom: document.getElementById('prenom'),
  adresse: document.getElementById('adresse'),
  email: document.getElementById('email'),
  tel: document.getElementById('tel'),
  naissance: document.getElementById('naissance'),
};
const matchError = document.getElementById('matchError');
const globalError = document.getElementById('globalError');
const summarySection = document.getElementById('summary');
const recapList = summarySection.querySelector('.recap');
const editBtn = document.getElementById('editBtn');

function setFieldError(input, message) {
  const box = form.querySelector(`.error[data-error-for="${input.id}"]`);
  if (box) {
    box.textContent = message || '';
    box.classList.toggle('show', Boolean(message));
  }
  input.classList.toggle('is-invalid', Boolean(message));
  input.setAttribute('aria-invalid', Boolean(message) ? 'true' : 'false');
  input.setCustomValidity(message || '');
}

function clearAllErrors() {
  globalError.textContent = '';
  globalError.style.display = 'none';
  form.querySelectorAll('.error').forEach(e => {
    if (e.id !== 'matchError' && e.id !== 'globalError') e.classList.remove('show');
  });
  Object.values(fields).forEach(i => {
    i.classList.remove('is-invalid');
    i.removeAttribute('aria-invalid');
    i.setCustomValidity('');
  });
  matchError.style.display = 'none';
}

function showGlobalError() {
  globalError.textContent = 'Veuillez corriger les champs en erreur.';
  globalError.style.display = 'block';
}

function isValidEmail(v) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(v);
}

function checkPasswordsMatch() {
  const ok = fields.confirm.value.length > 0 && fields.confirm.value === fields.password.value;
  matchError.style.display = ok ? 'none' : 'block';
  fields.confirm.setCustomValidity(ok ? '' : 'Les mots de passe ne correspondent pas');
  fields.confirm.classList.toggle('is-invalid', !ok);
  fields.confirm.setAttribute('aria-invalid', ok ? 'false' : 'true');
  return ok;
}

fields.password.addEventListener('input', checkPasswordsMatch);
fields.confirm.addEventListener('input', checkPasswordsMatch);

Object.values(fields).forEach(input => {
  input.addEventListener('blur', () => { validateField(input); });
});

function validateField(input) {
  if (!input.value || (input.type === 'date' && input.value === '')) {
    setFieldError(input, 'Ce champ est requis.');
    return false;
  }
  if (input === fields.login) {
    const val = input.value.trim();
    if (val.length < 3 || val.length > 32) {
      setFieldError(input, 'Le login doit comporter entre 3 et 32 caractères.');
      return false;
    }
  }
  if (input === fields.password && input.value.length < 8) {
    setFieldError(input, 'Le mot de passe doit contenir au moins 8 caractères.');
    return false;
  }
  if (input === fields.email && !isValidEmail(input.value.trim())) {
    setFieldError(input, 'Veuillez saisir un email valide (ex. nom@domaine.fr).');
    return false;
  }
  if (input === fields.tel) {
    const re = /^[+0-9 ().-]{6,}$/;
    if (!re.test(input.value.trim())) {
      setFieldError(input, 'Format de téléphone invalide.');
      return false;
    }
  }
  setFieldError(input, '');
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors();

  const results = Object.values(fields).map(validateField);
  const fieldsOk = results.every(Boolean);
  const pwOk = checkPasswordsMatch();

  if (!fieldsOk || !pwOk) {
    showGlobalError();
    const firstInvalid =
      Object.values(fields).find(i => i.classList.contains('is-invalid')) ||
      (!pwOk ? fields.confirm : null);
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  
  form.hidden = true;
  form.classList.add('is-hidden');
  summarySection.hidden = false;
  summarySection.classList.remove('is-hidden');

  const data = Object.fromEntries(new FormData(form).entries());
  const recap = [
    ['Login', data.login],
    ['Nom', data.nom],
    ['Prénom', data.prenom],
    ['Adresse', data.adresse],
    ['Email', data.email],
    ['Téléphone', data.tel],
    ['Date de naissance', data.naissance],
  ];

  recapList.innerHTML = recap
    .map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(String(v))}</dd>`)
    .join('');
});

editBtn.addEventListener('click', () => {
  summarySection.hidden = true;
  summarySection.classList.add('is-hidden');
  form.hidden = false;
  form.classList.remove('is-hidden');
  const first = form.querySelector('input');
  if (first) first.focus();
});

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
