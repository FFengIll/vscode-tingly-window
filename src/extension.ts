'use strict';
import { stat } from 'fs';
import * as vscode from 'vscode';
import { TextEditorSelectionChangeKind } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // status bar
    var statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        -100
    );
    statusBarItem.text = 'WindowMode';
    statusBarItem.command = 'vscode-window-mode.switch';
    context.subscriptions.push(statusBarItem);

    statusBarItem.show();

    // action
    var switchModeDisposal = vscode.commands.registerCommand(
        'vscode-window-mode.switch',
        async () => {
            let config = vscode.workspace.getConfiguration('windowMode');
            let mode: any = config.get('mode');
            let currentMode: number = config.get('currentMode') || 0;
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
                'currentMode',
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
}

export function deactivate() {}
