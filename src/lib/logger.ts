export function log(step: string, msg: string): void {
  console.log(`[${step}] ${msg}`);
}

export function warn(step: string, msg: string): void {
  console.warn(`[${step}] ${msg}`);
}
