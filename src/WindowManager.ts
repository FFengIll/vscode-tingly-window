import * as vscode from 'vscode';

export class WindowManager {
    private statusBarItem: vscode.StatusBarItem;
    private current: number;
    private readonly modes: string[];

    constructor() {
        this.modes = ['L', 'LR', 'N/A'];
        this.current = 0;

        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            -100
        );
    }

    public getStatusBarItem(): vscode.StatusBarItem {
        return this.statusBarItem;
    }

    public async switchMode(): Promise<void> {
        const next = (this.current + 1) % this.modes.length;
        const modeName = this.modes[next];

        this.updateStatusBarItem(modeName);
        this.current = next;

        await this.handleSwitchMode(modeName);
    }

    public async setFullWindowMode(): Promise<void> {
        this.updateStatusBarItem('N/A');
        this.current = 2; // N/A在modes中的索引
        await this.handleSwitchMode('N/A');
        await vscode.commands.executeCommand('setContext', 'windowModeIsNA', true);
    }

    public async setShowPanelsMode(): Promise<void> {
        this.updateStatusBarItem('LR');
        this.current = 1; // LR在modes中的索引
        await this.handleSwitchMode('LR');
        await vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);
    }

    public initializeMode(): void {
        this.updateStatusBarItem('N/A');
        vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);
    }

    private updateStatusBarItem(mode: string): void {
        this.statusBarItem.text = `Window: ${mode}`;
        this.statusBarItem.show();
    }

    private async handleSwitchMode(name: string): Promise<void> {
        switch (name) {
            case 'LR':
                await vscode.commands.executeCommand('workbench.action.focusSideBar');
                await vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
                await vscode.commands.executeCommand('workbench.action.focusPanel');
                break;
            case 'N/A':
                await vscode.commands.executeCommand('workbench.action.closeSidebar');
                await vscode.commands.executeCommand('workbench.action.closePanel');
                await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
                break;
            case 'L':
                await vscode.commands.executeCommand('workbench.action.focusSideBar');
                await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
                await vscode.commands.executeCommand('workbench.action.closePanel');
                break;
            case 'R':
                await vscode.commands.executeCommand('workbench.action.closeSideBar');
                await vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
                await vscode.commands.executeCommand('workbench.action.closePanel');
                break;
        }
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}