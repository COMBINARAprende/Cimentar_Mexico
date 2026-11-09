(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = "cimentar-mexico-compromisos-v1";

  const actions = [
    "Elige una noticia que te haya provocado enojo. Busca la fuente original y verifica el dato central antes de compartirla.",
    "Conversa con una persona de tu comunidad y pregúntale qué pequeña mejora considera prioritaria.",
    "Identifica un espacio común que necesite cuidado y averigua cuál es la forma segura y autorizada de ayudar.",
    "Escucha durante diez minutos una opinión distinta a la tuya. Resume lo que entendiste antes de responder.",
    "Consulta el sitio oficial de tu municipio y localiza un canal para reportar una necesidad comunitaria.",
    "Comparte una oportunidad educativa o laboral después de verificar que la información sea auténtica.",
    "Pregunta en una escuela o biblioteca cercana si existe una actividad en la que puedas colaborar.",
    "Revisa un compromiso público de tu localidad y busca información documentada sobre su avance.",
    "Dedica un momento a reconocer una práctica que sí funciona en tu colonia y compártela con respeto.",
    "Define una acción ambiental sencilla y medible: ahorrar agua, separar residuos o cuidar un árbol.",
    "Aprende qué mecanismo de participación ciudadana existe en tu municipio y anota cómo puedes acceder.",
    "Agradece a alguien que contribuya al bienestar de tu comunidad y reconoce concretamente lo que hace.",
    "Antes de publicar una acusación, verifica la información, protege datos personales y evita señalar sin evidencia.",
    "Ofrece compartir un conocimiento práctico con alguien que pueda aprovecharlo.",
    "Reúne a dos personas para pensar una solución pequeña, legal y posible a un problema común.",
    "Revisa una fuente pública de datos sobre educación, salud, seguridad u otro tema de tu interés.",
    "Haz una pausa antes de responder a un mensaje provocador. Pregúntate si tu respuesta informa o solo escala el conflicto.",
    "Escribe qué resultado concreto te gustaría ver en tu comunidad y cómo podrías medirlo."
  ];

  const toast = $("#toast");
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function getCommitments() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveCommitments(values) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      return true;
    } catch {
      notify("El navegador no permitió guardar tus selecciones. Puedes compartirlas de todas formas.");
      return false;
    }
  }

  function currentUrl() {
    return window.location.href.split("#")[0];
  }

  function shareText(text) {
    const fullText = `${text}\n\nCimentar México — Pon tu primera piedra.\n${currentUrl()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) {
      // If pop-ups are blocked, keep the text available through clipboard.
      copyText(fullText).then(() => notify("El navegador bloqueó WhatsApp. Copiamos el mensaje para que puedas pegarlo."));
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw new Error("copy failed");
      }
      return true;
    } catch {
      return false;
    }
  }

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const nav = $("#main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
    $$("a", nav).forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      menuToggle.textContent = "☰";
    }));
  }

  // Civic action die
  const dieButton = $("#btn-dado");
  const dieResult = $("#dado-resultado");
  const shareActionButton = $("#btn-compartir");
  let currentAction = "";
  if (dieButton && dieResult) {
    dieButton.addEventListener("click", () => {
      let next = actions[Math.floor(Math.random() * actions.length)];
      if (actions.length > 1 && next === currentAction) {
        next = actions[(actions.indexOf(next) + 1) % actions.length];
      }
      currentAction = next;
      dieResult.textContent = next;
      if (shareActionButton) shareActionButton.disabled = false;
    });
  }
  if (shareActionButton) {
    shareActionButton.addEventListener("click", () => {
      if (!currentAction) return notify("Primero solicita una acción ciudadana.");
      shareText(`Mi acción ciudadana para hoy:\n${currentAction}`);
    });
  }

  // Commitments: local-only persistence
  const commitmentInputs = $$("#piedras input[type='checkbox']");
  const progressText = $("#progress-text");
  const progressFill = $("#progress-fill");
  const shareCommitmentButton = $("#btn-compartir-compromiso");
  const statusMessage = $("#piedra-msg");
  const clearButton = $("#btn-limpiar");

  function renderCommitments() {
    const saved = getCommitments();
    commitmentInputs.forEach(input => { input.checked = saved.includes(input.value); });
    const count = saved.length;
    if (progressText) progressText.textContent = `${count} de ${commitmentInputs.length}`;
    if (progressFill) progressFill.style.width = `${commitmentInputs.length ? count / commitmentInputs.length * 100 : 0}%`;
    if (shareCommitmentButton) shareCommitmentButton.disabled = count === 0;
  }

  commitmentInputs.forEach(input => {
    input.addEventListener("change", () => {
      const selected = commitmentInputs.filter(item => item.checked).map(item => item.value);
      saveCommitments(selected);
      renderCommitments();
      if (statusMessage) statusMessage.textContent = input.checked
        ? "Compromiso agregado. Puedes seguir eligiendo."
        : "Compromiso actualizado.";
    });
  });

  if (shareCommitmentButton) {
    shareCommitmentButton.addEventListener("click", () => {
      const selected = getCommitments();
      if (!selected.length) return notify("Selecciona al menos un compromiso.");
      shareText(`Estos son mis compromisos:\n${selected.map(item => `• ${item}`).join("\n")}\n\n¿Te animas a poner tu primera piedra?`);
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (!getCommitments().length) return notify("No hay selecciones que borrar.");
      const confirmed = window.confirm("¿Quieres borrar tus compromisos guardados en este navegador?");
      if (!confirmed) return;
      saveCommitments([]);
      renderCommitments();
      if (statusMessage) statusMessage.textContent = "Tus selecciones se borraron de este dispositivo.";
    });
  }

  // Share the site and copy URL
  const shareSiteButton = $("#btn-compartir-sitio");
  if (shareSiteButton) {
    shareSiteButton.addEventListener("click", async () => {
      const shareData = {
        title: "Cimentar México — Pon tu primera piedra",
        text: "Una invitación a pensar, dialogar y construir juntos.",
        url: currentUrl()
      };
      if (navigator.share) {
        try { await navigator.share(shareData); }
        catch (error) { if (error.name !== "AbortError") notify("No fue posible abrir el menú para compartir."); }
      } else {
        shareText("Te invito a conocer Cimentar México: una iniciativa ciudadana para pensar, dialogar y construir juntos.");
      }
    });
  }

  const copyButton = $("#btn-copiar-enlace");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const ok = await copyText(currentUrl());
      notify(ok ? "Enlace copiado." : "No se pudo copiar automáticamente. Copia la dirección desde tu navegador.");
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderCommitments();
})();
