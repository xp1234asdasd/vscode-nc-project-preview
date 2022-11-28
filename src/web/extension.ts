// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DEFAULT_TASK_NAME, NC_SHOW_PREVIEW_COMMAND } from './config';
import PreviewStatusBarItem from './ux/PreviewStatusBarItem';
import PreviewWebViewPanel from './ux/PreviewWebViewPanel';

let previewStatusBarItem:PreviewStatusBarItem | null;
let previewWebViewPanel: PreviewWebViewPanel | null;

export async function activate(context: vscode.ExtensionContext) {
	// 没有则不做任何处理
	const startTaskName = vscode.workspace.getConfiguration().get('autoPreview.startTaskName') || DEFAULT_TASK_NAME;
	const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	if (!workspaceRoot) {
		return;
	}
	// vscode启动后就显示status bar item
	!previewStatusBarItem && (previewStatusBarItem = new PreviewStatusBarItem());

	context.subscriptions.push(
		vscode.commands.registerCommand(NC_SHOW_PREVIEW_COMMAND, () => {
			new PreviewWebViewPanel(context.extensionUri).show();
		})
	);
	vscode.tasks.onDidStartTask((e) => {
		vscode.window.showInformationMessage(`onDidStartTask ${e.execution.task.name}`);
		const taskName = e.execution.task.name;
		if (startTaskName === taskName) {
			vscode.commands.executeCommand(NC_SHOW_PREVIEW_COMMAND);
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	previewStatusBarItem?.dispose();
	previewWebViewPanel?.dispose();
}

