declare global {
  interface Window {
    __activeViewTransition?: ViewTransition | null;
  }
}

export function startTransition(callback: () => void) {
  window.__activeViewTransition?.skipTransition();

  if (document.startViewTransition) {
    const transition = document.startViewTransition(callback);
    window.__activeViewTransition = transition;
    transition.finished.finally(() => {
      if (window.__activeViewTransition === transition) {
        window.__activeViewTransition = null;
      }
    });
    return transition;
  }

  callback();
  return null;
}

export function openModal(modal: HTMLDialogElement) {
  startTransition(() => {
    modal.showModal();
    (modal as HTMLDialogElement & { onModalOpen?: () => void }).onModalOpen?.();
  });
}

export function closeModal(dialog: HTMLDialogElement) {
  const trigger = document.querySelector<HTMLElement>(
    `[data-open-modal="${dialog.id}"]`,
  );

  const transition = startTransition(() => {
    dialog.close();
    trigger?.blur();
  });

  transition?.finished.catch(() => {
    if (dialog.open) dialog.close();
  });
}

export function wireDialogClose(dialog: HTMLDialogElement) {
  const close = () => closeModal(dialog);

  dialog.querySelector("[data-close]")?.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });

  return close;
}
