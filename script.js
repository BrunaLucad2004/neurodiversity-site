/* ============================================
   CONTROLES DE ACESSIBILIDADE
   ============================================ */

const body = document.body;

// --- Tamanho da fonte ---
let fontScale = 1;
const BASE_SIZE = 16;

document.getElementById('btn-font-up').addEventListener('click', () => {
  fontScale = Math.min(fontScale + 0.1, 1.5);
  document.documentElement.style.fontSize = (BASE_SIZE * fontScale) + 'px';
});

document.getElementById('btn-font-down').addEventListener('click', () => {
  fontScale = Math.max(fontScale - 0.1, 0.8);
  document.documentElement.style.fontSize = (BASE_SIZE * fontScale) + 'px';
});

// --- Alto contraste ---
const btnContrast = document.getElementById('btn-contrast');
btnContrast.addEventListener('click', () => {
  const on = body.classList.toggle('high-contrast');
  btnContrast.setAttribute('aria-pressed', on);
  btnContrast.textContent = on ? 'Contraste normal' : 'Alto contraste';
});

// --- Fonte dislexia ---
const btnDyslexia = document.getElementById('btn-dyslexia');
btnDyslexia.addEventListener('click', () => {
  const on = body.classList.toggle('dyslexia-font');
  btnDyslexia.setAttribute('aria-pressed', on);
  btnDyslexia.textContent = on ? 'Fonte padrão' : 'Fonte dislexia';
});

// --- Desativar animações ---
//const btnMotion = document.getElementById('btn-motion');
//btnMotion.addEventListener('click', () => {
//  const on = body.classList.toggle('no-motion');
//  btnMotion.setAttribute('aria-pressed', on);
//  btnMotion.textContent = on ? 'Com animações' : 'Sem animações';
//});

/* ============================================
   FORMULÁRIO
   ============================================ 
function enviarFormulario() {
  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const lgpd     = document.getElementById('lgpd').checked;
  const feedback = document.getElementById('msg-feedback');

  // Limpa estado anterior
  feedback.className = 'feedback hidden';
  feedback.textContent = '';

  // Validação simples
  if (!nome || !email || !mensagem || !lgpd) {
    feedback.className = 'feedback error';
    feedback.textContent = 'Por favor, preencha todos os campos obrigatórios (*) antes de enviar.';
    feedback.focus();
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    feedback.className = 'feedback error';
    feedback.textContent = 'Informe um endereço de e-mail válido. Exemplo: nome@email.com';
    feedback.focus();
    return;
  }

  // Sucesso (simulado)
  feedback.className = 'feedback success';
  feedback.textContent = 'Mensagem enviada! Entraremos em contato em breve.';
  feedback.focus();

  // Limpa o formulário
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('assunto').value = '';
  document.getElementById('mensagem').value = '';
  document.getElementById('lgpd').checked = false;
}*/
