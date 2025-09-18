// Validation simple du mot de passe = confirmation
const form = document.getElementById('signupForm');
const pwd = document.getElementById('password');
const confirmPwd = document.getElementById('confirm');
const matchError = document.getElementById('matchError');

function checkMatch() {
  const ok = confirmPwd.value === pwd.value && confirmPwd.value.length > 0;
  matchError.style.display = ok ? 'none' : 'block';
  confirmPwd.setCustomValidity(ok ? '' : 'Les mots de passe ne correspondent pas');
  return ok;
}

pwd.addEventListener('input', checkMatch);
confirmPwd.addEventListener('input', checkMatch);

form.addEventListener('submit', (e) => {
  if (!checkMatch()) {
    e.preventDefault();
    confirmPwd.focus();
    return;
  }

  // Exemple: empêcher l'envoi réel et afficher les données (à adapter côté serveur)
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  // Ne jamais journaliser les mots de passe en production !
  alert('Inscription prête à être envoyée !\\n' + JSON.stringify({
    login: data.login,
    nom: data.nom,
    prenom: data.prenom,
    adresse: data.adresse,
    email: data.email,
    tel: data.tel,
    naissance: data.naissance
  }, null, 2));
});