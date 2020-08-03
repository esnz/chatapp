export const joinClasses = (...args: any[]) => {
  return args.join(' ');
};

export const formatDate = (date: Date): string => {
  if (date.getDate() === new Date().getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' });
};
