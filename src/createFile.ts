type Configuration = {
  moduleName?: string;
};

export const createFile = (
  files: string[],
  { moduleName = "modules" }: Configuration
) => {
  const barrelData = files
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => file.startsWith("index") === false)
    .map((file) => file.replace(/\.tsx?$/, ""));

  const barrelImports = barrelData
    .map((file) => `import * as ${file} from "./${file}"`)
    .join("\n");

  const barrelExports = barrelData.map((x) => `\t...${x}`).join(",\n");

  return [
    barrelImports,
    "",
    `export const ${moduleName} = {`,
    barrelExports,
    "}",
  ].join("\n");
};
