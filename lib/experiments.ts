type VariantDef<T extends string> = {
  key: T;
  weight?: number;
};

type VariantInput<T extends string> = T[] | VariantDef<T>[];

type ResolvedVariant<T extends string> = {
  key: T;
  weight: number;
};

type ExperimentOptions = {
  queryParamPrefix?: string;
  storagePrefix?: string;
};

function resolveVariants<T extends string>(variants: VariantInput<T>): ResolvedVariant<T>[] {
  if (variants.length === 0) return [];

  const normalized = variants.map((variant) => {
    if (typeof variant === "string") return { key: variant, weight: 1 };
    return { key: variant.key, weight: Math.max(0, variant.weight ?? 1) };
  });

  const hasPositiveWeight = normalized.some((variant) => variant.weight > 0);
  if (!hasPositiveWeight) {
    return normalized.map((variant) => ({ ...variant, weight: 1 }));
  }

  return normalized;
}

function pickWeightedVariant<T extends string>(variants: ResolvedVariant<T>[]): T {
  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
  if (totalWeight <= 0) return variants[0].key;

  const randomNumber = Math.random() * totalWeight;
  let cursor = 0;
  for (const variant of variants) {
    cursor += variant.weight;
    if (randomNumber <= cursor) {
      return variant.key;
    }
  }

  return variants[variants.length - 1].key;
}

export function getOrAssignExperimentVariant<T extends string>(
  experimentId: string,
  variants: VariantInput<T>,
  options?: ExperimentOptions
): T {
  const resolvedVariants = resolveVariants(variants);
  const fallback = resolvedVariants[0]?.key;
  if (!fallback) {
    throw new Error(`Experiment "${experimentId}" must have at least one variant.`);
  }

  if (typeof window === "undefined") return fallback;

  const queryParamPrefix = options?.queryParamPrefix ?? "exp_";
  const storagePrefix = options?.storagePrefix ?? "morpeth_exp_";
  const storageKey = `${storagePrefix}${experimentId}`;
  const validSet = new Set(resolvedVariants.map((variant) => variant.key));

  const params = new URLSearchParams(window.location.search);
  const forcedVariant = params.get(`${queryParamPrefix}${experimentId}`) as T | null;
  if (forcedVariant && validSet.has(forcedVariant)) {
    try {
      window.localStorage.setItem(storageKey, forcedVariant);
    } catch {
      // Ignore write failures and continue with forced value.
    }
    return forcedVariant;
  }

  try {
    const storedVariant = window.localStorage.getItem(storageKey) as T | null;
    if (storedVariant && validSet.has(storedVariant)) {
      return storedVariant;
    }
  } catch {
    // Ignore storage read failures and continue.
  }

  const picked = pickWeightedVariant(resolvedVariants);
  try {
    window.localStorage.setItem(storageKey, picked);
  } catch {
    // Ignore write failures and continue.
  }
  return picked;
}
