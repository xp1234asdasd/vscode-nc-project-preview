import {window, StatusBarItem, StatusBarAlignment} from 'vscode';
import { NC_SHOW_PREVIEW_COMMAND } from '../config';

export default class PreviewStatusBarItem {
	private instance: StatusBarItem | undefined;
	constructor() {
		this.instance = window.createStatusBarItem(
			StatusBarAlignment.Left
		);
		this.instance.text = '$(open-preview) Preview';
		this.instance.show();
		this.instance.command = NC_SHOW_PREVIEW_COMMAND;
	}
	dispose() {
		if (this.instance) {
			this.instance.dispose();
		}
	}
}