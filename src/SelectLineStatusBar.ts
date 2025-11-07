import * as vscode from 'vscode';
import * as util from 'util';

const DEFAULT_FORMAT = 'Selected %d Lines';

export class SelectLineStatusBar {
    private statusBar: vscode.StatusBarItem;
    private alignConfig: string;
    private statusBarPriority: number;
    private displayFormat: string;

    constructor() {
        this.alignConfig = vscode.workspace.getConfiguration('selectline').get('alignment', 'left');
        this.statusBarPriority = vscode.workspace.getConfiguration('selectline').get('statusbarPriority', 100);
        this.displayFormat = vscode.workspace.getConfiguration('selectline').get('displayFormat', DEFAULT_FORMAT);

        this.statusBar = vscode.window.createStatusBarItem(
            this.getAlignmentEnum(this.alignConfig),
            this.statusBarPriority
        );

        this.setupEventListeners();
        this.setupConfigurationListener();
    }

    private setupEventListeners(): void {
        vscode.window.onDidChangeActiveTextEditor(e => {
            if (e) {
                this.displaySelectedLineCount(e.selections);
            }
        });

        vscode.window.onDidChangeTextEditorSelection(e => {
            if (e) {
                this.displaySelectedLineCount(e.selections);
            }
        });

        vscode.window.onDidChangeTextEditorViewColumn(e => {
            if (e.textEditor) {
                this.displaySelectedLineCount(e.textEditor.selections);
            }
        });
    }

    private setupConfigurationListener(): void {
        vscode.workspace.onDidChangeConfiguration(() => {
            this.displayFormat = vscode.workspace.getConfiguration('selectline').get('displayFormat', DEFAULT_FORMAT);

            const newAlignConfig = vscode.workspace.getConfiguration('selectline').get('alignment', 'left');
            const newStatusBarPriority = vscode.workspace.getConfiguration('selectline').get('statusbarPriority', 100);

            if (newAlignConfig !== this.alignConfig || newStatusBarPriority !== this.statusBarPriority) {
                this.alignConfig = newAlignConfig;
                this.statusBarPriority = newStatusBarPriority;

                this.statusBar.hide();
                this.statusBar.dispose();
                this.statusBar = vscode.window.createStatusBarItem(
                    this.getAlignmentEnum(this.alignConfig),
                    this.statusBarPriority
                );
            }
        });
    }

    private displaySelectedLineCount(selections: readonly vscode.Selection[]): void {
        let selectedCount = selections.reduce((prev, selection) => {
            const lineCount = selection.end.line - selection.start.line;
            const hasContentInLastLine = selection.end.character > 0;
            return prev + lineCount + (hasContentInLastLine ? 1 : 0);
        }, 0);

        if (selectedCount > 1) {
            this.statusBar.text = util.format(this.displayFormat, selectedCount);
            this.statusBar.show();
        } else {
            this.statusBar.hide();
        }
    }

    private getAlignmentEnum(alignConfig: string): vscode.StatusBarAlignment {
        if (alignConfig === 'right') {
            return vscode.StatusBarAlignment.Right;
        } else {
            return vscode.StatusBarAlignment.Left;
        }
    }

    public dispose(): void {
        this.statusBar.dispose();
    }
}