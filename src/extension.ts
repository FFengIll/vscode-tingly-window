'use strict';
import * as vscode from 'vscode';
import { SelectLineStatusBar } from './SelectLineStatusBar';
import { WindowManager } from './WindowManager';

let selectLineStatusBar: SelectLineStatusBar;
let windowManager: WindowManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('active: window mode');

    const commandId = 'tingly-window.switch';
    const fullWindowCommandId = 'tingly-window.fullWindow';
    const showPanelsCommandId = 'tingly-window.showPanels';
    const openFolderInCurrentCommandId = 'tingly-window.openFolderInCurrentWindow';
    const openFolderInNewCommandId = 'tingly-window.openFolderInNewWindow';

    // window manager
    windowManager = new WindowManager();
    windowManager.getStatusBarItem().command = commandId;
    context.subscriptions.push(windowManager.getStatusBarItem());
    context.subscriptions.push(windowManager);

    // selectline status bar
    selectLineStatusBar = new SelectLineStatusBar();
    context.subscriptions.push(selectLineStatusBar);

    // action
    const switchModeDisposal = vscode.commands.registerCommand(
        commandId,
        async () => {
            await windowManager.switchMode();
        }
    );
    context.subscriptions.push(switchModeDisposal);

    // Full Window 命令
    const fullWindowDisposal = vscode.commands.registerCommand(
        fullWindowCommandId,
        async () => {
            await windowManager.setFullWindowMode();
        }
    );
    context.subscriptions.push(fullWindowDisposal);

    // Restore Panels 命令
    const showPanelsDisposal = vscode.commands.registerCommand(
        showPanelsCommandId,
        async () => {
            await windowManager.setShowPanelsMode();
        }
    );
    context.subscriptions.push(showPanelsDisposal);

    // Open Folder in Current Window 命令
    const openFolderDisposal = vscode.commands.registerCommand(
        openFolderInCurrentCommandId,
        async () => {
            await windowManager.openFolderInCurrentWindow();
        }
    );
    context.subscriptions.push(openFolderDisposal);

    // Open Folder in New Window 命令
    const openFolderInNewWindowDisposal = vscode.commands.registerCommand(
        openFolderInNewCommandId,
        async () => {
            await windowManager.openFolderInNewWindow();
        }
    );
    context.subscriptions.push(openFolderInNewWindowDisposal);

    // 初始化
    windowManager.initializeMode();
}

export function deactivate() {
    if (selectLineStatusBar) {
        selectLineStatusBar.dispose();
    }
    if (windowManager) {
        windowManager.dispose();
    }
}
