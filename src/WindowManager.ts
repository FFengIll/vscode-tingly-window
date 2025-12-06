import * as vscode from 'vscode';

export class WindowManager {
    private statusBarItem: vscode.StatusBarItem;
    private current: number;
    private readonly modes: string[];
    private readonly modeDescriptions: { [key: string]: string };

    constructor() {
        this.modes = ['L', 'LR', 'FULL'];
        this.current = 2; // 默认为 FULL

        this.modeDescriptions = {
            'L': 'Left - Show only left sidebar',
            'LR': 'Left+Right - Show both sidebars and panels',
            'FULL': 'Full - Hide all sidebars and panels'
        };

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
        this.updateStatusBarItem('FULL');
        this.current = this.modes.indexOf('FULL');
        await this.handleSwitchMode('FULL');
        await vscode.commands.executeCommand('setContext', 'windowModeIsNA', true);
    }

    public async setShowPanelsMode(): Promise<void> {
        this.updateStatusBarItem('LR');
        this.current = this.modes.indexOf('LR');
        await this.handleSwitchMode('LR');
        await vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);
    }

    public initializeMode(): void {
        this.current = this.modes.indexOf('FULL');
        this.updateStatusBarItem('FULL');
        vscode.commands.executeCommand('setContext', 'windowModeIsNA', false);
    }

    private updateStatusBarItem(mode: string): void {
        const modeIcons: { [key: string]: string } = {
            'L': '$(layout-sidebar-left)',
            'LR': '$(layout-centered)',
            'FULL': '$(layout-menubar)'
        };

        this.statusBarItem.text = `${modeIcons[mode]} Window: ${mode}`;
        this.statusBarItem.tooltip = `Current: ${this.modeDescriptions[mode] || mode}\nClick to cycle window mode`;
        this.statusBarItem.show();
    }

    private async handleSwitchMode(name: string): Promise<void> {
        switch (name) {
            case 'LR':
                await vscode.commands.executeCommand('workbench.action.focusSideBar');
                await vscode.commands.executeCommand('workbench.action.focusAuxiliaryBar');
                await vscode.commands.executeCommand('workbench.action.focusPanel');
                break;
            case 'FULL':
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

    public async openFolderInCurrentWindow(): Promise<void> {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Open Folder in Current Window',
            canSelectFolders: true,
            canSelectFiles: false
        };

        const folderUri = await vscode.window.showOpenDialog(options);

        if (folderUri && folderUri[0]) {
            try {
                // Use VSCode command to open folder in current window (replace window)
                await vscode.commands.executeCommand(
                    'vscode.openFolder',
                    folderUri[0],
                    { forceReuseWindow: true, forceNewWindow: false }
                );

                vscode.window.showInformationMessage(
                    `Opened folder in current window: ${folderUri[0].fsPath}`
                );
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to open folder: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }
    }

    public async openFolderInNewWindow(): Promise<void> {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Open Folder in New Window',
            canSelectFolders: true,
            canSelectFiles: false
        };

        const folderUri = await vscode.window.showOpenDialog(options);

        if (folderUri && folderUri[0]) {
            try {
                // Use VSCode command to open folder in new window
                await vscode.commands.executeCommand(
                    'vscode.openFolder',
                    folderUri[0],
                    { forceReuseWindow: false, forceNewWindow: true }
                );

                vscode.window.showInformationMessage(
                    `Opened folder in new window: ${folderUri[0].fsPath}`
                );
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Failed to open folder: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}