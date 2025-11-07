'use strict';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
const modes = ['L', 'LR', 'N/A'];
var current = 0;

export function activate(context: vscode.ExtensionContext) {
    console.log('active: window mode');

    var commandId = 'tingly-window.switch';
    var fullWindowCommandId = 'tingly-window.fullWindow';
    var showPanelsCommandId = 'tingly-window.showPanels';

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

            handleSwitchMode(name);
        }
    );
    context.subscriptions.push(switchModeDisposal);

    // Full Window 命令
    var fullWindowDisposal = vscode.commands.registerCommand(
        fullWindowCommandId,
        async () => {
            updateStatusBarItem('N/A');
            current = 2; // N/A在modes中的索引
            handleSwitchMode('N/A');
            await vscode.commands.executeCommand('setContext', 'windowModeIsNA', true);
        }
    );
    context.subscriptions.push(fullWindowDisposal);

    // Restore Panels 命令
    var showPanelsDisposal = vscode.commands.registerCommand(
        showPanelsCommandId,
        async () => {
            // 打开所有panel
            updateStatusBarItem('LR');
            current = 1; // LR在modes中的索引
            handleSwitchMode('LR');
            await vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);
        }
    );
    context.subscriptions.push(showPanelsDisposal);

    // 初始化 context
    vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);

    updateStatusBarItem('N/A');
}


function updateStatusBarItem(mode: string) {
    statusBarItem.text = `Window: ${mode}`;
    statusBarItem.show();
}

// 新增：统一处理模式切换
function handleSwitchMode(name: string) {
    switch (name) {
        case 'LR':
            vscode.commands.executeCommand('workbench.action.focusSideBar');
            vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
            vscode.commands.executeCommand('workbench.action.focusPanel');
            break;
        case 'N/A':
            vscode.commands.executeCommand('workbench.action.closeSidebar');
            vscode.commands.executeCommand('workbench.action.closePanel');
            vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
            break;
        case 'L':
            vscode.commands.executeCommand('workbench.action.focusSideBar');
            vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
            vscode.commands.executeCommand('workbench.action.closePanel');
            break;
        case 'R':
            vscode.commands.executeCommand('workbench.action.closeSideBar');
            vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
            vscode.commands.executeCommand('workbench.action.closePanel');
            break;
    }
}

export function deactivate() { }
