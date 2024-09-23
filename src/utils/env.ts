export const envionmentGenerator = (envVariables: any) =>
  Object.keys(envVariables).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: import.meta.env[envVariables[curr]]
    }),
    {} as typeof envVariables
  );

export const ensureVariablesExist = (environment: any, envVariables: any) => {
  const missingVariables = Object.keys(environment).reduce((prev, curr) => {
    const variable = environment[curr];
    if (!variable) {
      prev = [...prev, envVariables[curr]];
    }
    return prev;
  }, []);

  if (missingVariables.length) {
    const message = `The following variables are missing \n${missingVariables.join(
      "\r\n"
    )} \n- Please define them in .env`;
    throw new Error(message);
  }
};
