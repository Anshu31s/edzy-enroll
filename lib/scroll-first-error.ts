export function scrollToFirstError<T extends Record<string, any>>(errors: Partial<Record<keyof T, any>>) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const el =
    document.querySelector(`[name="${firstKey}"]`) ||
    document.getElementById(firstKey);

  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
