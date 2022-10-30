'use strict';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('active: window mode');

    var commandId = 'vscode-window-mode.switch';

    // status bar
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        -100
    );
    statusBarItem.command = commandId;
    context.subscriptions.push(statusBarItem);

    // action
    var switchModeDisposal = vscode.commands.registerCommand(
        commandId,
        async () => {
            let config = vscode.workspace.getConfiguration('windowMode');
            let mode: any = config.get('mode');
            let currentMode: number = config.get('current') || 0;
            let nextMode = currentMode;
            let target = null;
            if (mode.length > 0) {
                nextMode = (currentMode + 1) % mode.length;
                target = mode[nextMode];
            } else {
                nextMode = (currentMode + 1) % 2;
                target = ['all', 'none'][nextMode];
            }

            await config.update(
                'current',
                nextMode,
                vscode.ConfigurationTarget.Workspace
            );
            switch (target) {
                case null:
                    break;
                case 'all':
                    vscode.commands.executeCommand(
                        'workbench.action.focusSideBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.focusPanel'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.focusAuxiliaryBar'
                    );
                    break;
                case 'none':
                    vscode.commands.executeCommand(
                        'workbench.action.closeSidebar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.closePanel'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.closeAuxiliaryBar'
                    );
                    break;
                case 'sidebar':
                    vscode.commands.executeCommand(
                        'workbench.action.focusSideBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.focusAuxiliaryBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.closePanel'
                    );
                    break;
            }
        }
    );
    context.subscriptions.push(switchModeDisposal);

    // register some listener that make sure the status bar
    // item always up-to-date
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
    );
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
    );

    updateStatusBarItem();
}

function updateStatusBarItem() {
    // show
    statusBarItem.text = 'WindowMode';
    statusBarItem.show();
}

export function deactivate() {}
