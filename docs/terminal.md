# Terminal help

## Opening a terminal

### [Windows] Through File Explorer
The easiest way to open a terminal on Windows is to navigate to the folder in File Explorer, click the "File" > "Open Windows PowerShell". This will open the terminal in the correct folder and you can start typing commands immediately.

### [Windows] Through command-line
You can also open a terminal and manually navigate to the folder from the terminal. In case you're unfamiliar:

* Search for `cmd` to open the Command Prompt
* Once opened, the path before the `>` indicates the active folder.
* To change drives, you can just type `D:` to navigate to the `D:\` drive.
* To change folder, type in `cd <folder>` (without the `<` and `>`), use tab to auto-complete. If your folder has spaces, it can help to use `cd "<folder>"`. You can navigate multiple folders at once, just add a `\ ` and type in the next folder.

_[Back to Installation](../README.md#installation)_

## Stopping the watch command

When you use the `watch`, `css watch` or `twig watch` command, a long-running process will start. It will continue to run in the background, unless you stop it. **To stop the long-running process, press `Ctrl+C`.**
