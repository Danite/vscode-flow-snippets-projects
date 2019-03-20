import * as vscode from 'vscode';
import * as snippets from "./snippets/snippets.json";

const convertSnippetArrayToString = (snippetArray: any) => snippetArray.join('\n');

export function activate(context: vscode.ExtensionContext) {

    console.log('Snippet activated');

    let disposable = vscode.commands.registerCommand(
        'extension.flowSnippetSearch',
        () => {
            const items = Object.entries(snippets).map(
                ([shortDescription, { prefix, body, description }], id) => ({
                    id,
                    description: description || shortDescription,
                    label: prefix,
                    value: prefix,
                    body,
                })
            );
            const options = {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: 'Search snippet',
            };
            vscode.window.showQuickPick(items, options).then(({ body }) => {
                const activeTextEditor = vscode.window.activeTextEditor;
                const snippet =
                    typeof body === 'string' ? body : convertSnippetArrayToString(body);
                activeTextEditor &&
                    activeTextEditor.insertSnippet(new vscode.SnippetString(snippet));
            });
        }
    );
    context.subscriptions.push(disposable);
}

export function deactivate() { }
