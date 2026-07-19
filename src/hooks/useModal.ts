import { notify, confirm } from '../services/modalManager';

export const useModal = () => {
  return {
    open: notify,
    confirm: confirm,
    success: notify.success,
    error: notify.error,
    warning: notify.warning,
    info: notify.info,
    question: notify.question,
    danger: notify.danger,
    custom: notify.custom,
    promise: notify.promise,
    dismiss: notify.dismiss,
    clear: notify.clear,
  };
};
