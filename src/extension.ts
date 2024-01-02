// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readdir } from "fs/promises";
import * as vscode from "vscode";
import { createFile } from "./createFile";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "helloworld-sample" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const disposable = vscode.commands.registerCommand(
    "extension.tunna",
    async (folder) => {
      const folderData = await readdir(folder.fsPath);

      const folderName = folder.path.split("/").at(-1);

      const filepath = vscode.Uri.file(`${folder.fsPath}/index.ts`);

      const data = await (async () => {
        try {
          return await vscode.workspace.fs.readFile(filepath);
        } catch (e) {
          return undefined;
        }
      })();

      let existingModuleName = data
        ?.toString()
        ?.split("\n")
        ?.find((line) => line.startsWith("export const"))
        ?.match("export const (.*) =")?.[1];

      if (!existingModuleName)
        existingModuleName = await vscode.window.showInputBox({
          value: folderName,
          validateInput: (value) => {
            if (value.match(/^[a-zA-Z0-9_]+$/)) {
              return null;
            }

            return "Invalid module name";
          },
        });
      else
        vscode.window.showInformationMessage(
          `(Tunna) using existing module name (${existingModuleName})`
        );

      if (!existingModuleName) return;

      vscode.workspace.fs.writeFile(
        filepath,
        Buffer.from(
          createFile(folderData, {
            moduleName: existingModuleName,
          })
        )
      );
    }
  );

  context.subscriptions.push(disposable);
}
