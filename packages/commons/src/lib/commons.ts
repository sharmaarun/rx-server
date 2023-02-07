export function isClass(v: any) {
  return typeof v === 'function' && (
    /^\s*class\s+/.test(v.toString()) ||
    /^\s*_super\s+/g.test(v.toString()) ||
    /^\s*super\s+/g.test(v.toString())
  );
}

export async function loadModule(name: string) {
  const module = await import(/* webpackIgnore: true */name)
  return module?.default || module
}