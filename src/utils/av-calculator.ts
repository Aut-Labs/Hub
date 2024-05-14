// Normalize non-dominant parameters from [0, 40] to [0, 1]
const normalizeNonDominant = (value) => value / 40;
// Normalize dominant parameters from [40, 60] to [0, 1]
const normalizeDominant = (value) => (value - 40) / 20;

export const calculateAV = (updatedArchetype) => {
  const dominantParameter = Object.keys(updatedArchetype).reduce((a, b) =>
    updatedArchetype[a] > updatedArchetype[b] ? a : b
  );
  // Sum of all values used for normalizing weights to ensure they sum up to 1
  const sumOfValues = Object.values(updatedArchetype).reduce(
    // @ts-ignore
    (sum, current) => sum + current,
    0
  );

  // Normalize the weights according to the value limits
  const normalizedWeights = Object.keys(updatedArchetype).reduce((acc, key) => {
    const isDominant = key === dominantParameter;
    const value = updatedArchetype[key];
    acc[key] = isDominant
      ? normalizeDominant(value)
      : normalizeNonDominant(value);
    // @ts-ignore
    acc[key] *= value / sumOfValues; // Apply weight based on its contribution to the sum
    return acc;
  }, {});

  // Calculate AV as the sum of weighted normalized parameters
  return Object.values(normalizedWeights).reduce(
    // @ts-ignore
    (acc, weight, index) => acc + weight * (index + 1),
    0
  ); // Using index + 1 as the parameter
};
