'use strict';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
const modes = ['L', 'LR', 'N/A'];
var current = 0;

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
            let name = null;
            let next = (current + 1) % modes.length;
            name = modes[next];
            updateStatusBarItem(name);

            current = next;

            switch (name) {
                case 'LR':
                    vscode.commands.executeCommand(
                        'workbench.action.focusSideBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.focusAuxiliaryBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.focusPanel'
                    );
                    break;
                case 'N/A':
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
                case 'L':
                    vscode.commands.executeCommand(
                        'workbench.action.focusSideBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.closeAuxiliaryBar'
                    );
                    vscode.commands.executeCommand(
                        'workbench.action.closePanel'
                    );
                    break;
                case 'R':
                    vscode.commands.executeCommand(
                        'workbench.action.closeSideBar'
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
    // context.subscriptions.push(
    //     vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
    // );
    // context.subscriptions.push(
    //     vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
    // );

    updateStatusBarItem('N/A');
}

function updateStatusBarItem(mode: string) {
    // show
    statusBarItem.text = `Window: ${mode}`;
    statusBarItem.show();
}

export function deactivate() {}
