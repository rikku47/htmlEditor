//#region Declaration and Initialization
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// Load the File System to execute our common tasks (CRUD).
const fs = require('fs');
const path = require("path");
let files = [];
let win;
//#endregion

//#region app
app.whenReady().then(() => {

    createWindow()

    //#region 
    win.webContents.openDevTools();
    win.webContents.send("init");
    //#endregion webContents

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
//#endregion

//#region Functions
//#region Window
const createWindow = () => {
    //#region new BrowserWindow
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '/preload/preload.js')
        }
    })
    //#endregion

    //#region ipcMain
    ipcMain.handle("dialog:openFileStats", handleFileOpenStats);
    ipcMain.handle("read:FileStats", readFileStats);
    ipcMain.handle("dialog:readFile", handleFileRead);
    ipcMain.handle("dialog:openFile", handleFileOpen);
    ipcMain.handle("save:saveFile", handeleFileSave);
    //#endregion

    win.maximize();
    win.loadFile('index.html');
}
//#endregion

function checkDuplicateFiles(filePaths) {
    filePaths.forEach((filePath) => {
        if (!files.includes(filePath)) {
            files.push(filePath);
        }
    });
}

//#region File handle
const handleFileOpenStats = async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(
        {
            title: "HTML",
            buttonLabel: 'Open',
            filters: [
                {
                    name: 'HTML Files',
                    extensions: ['html', 'htm']
                },],
            properties: [
                'openFile',
                "multiSelections"
            ]
        }
    );
    if (canceled) {
        return;
    } else {
        readFileStats(event, filePaths);
    }
}

const handleFileOpen = async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(
        {
            title: "HTML",
            buttonLabel: 'Open',
            filters: [
                {
                    name: 'HTML Files',
                    extensions: ['html', 'htm']
                },],
            properties: [
                'openFile',
                "multiSelections"
            ]
        }
    );
    if (canceled) {
        return;
    } else {
        filePaths.forEach((filePath) => {
            // Implement file read...
        });
    };
}

const handleFileRead = async (event, filePath) => {
    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) {
            win.webContents.send('read-file',
                {
                    fileError: "An error ocurred reading the file :" + err.message,
                    fileContent: undefined,
                    filePath: filePath,
                    fileName: path.basename(filePath)
                });
        } else {

            let file = {
                fileError: undefined,
                fileContent: data,
                filePath: filePath,
                fileName: path.basename(filePath)
            };

            win.webContents.send('read-file', file);
        };
    });
}

const handleFilesSave = async (event, files) => {
    const { canceled, filePath } = await dialog.showSaveDialog(
        {
            title: "HTML",
            buttonLabel: 'Save',
            filters: [
                {
                    name: 'HTML Files',
                    extensions: ['html', 'htm']
                },]
        }
    );
    if (canceled) {
        return;
    } else {
        try {
            files.forEach((path) => {
                fs.writeFileSync(filePath, path, "utf-8");
            });
        } catch (error) {
            console.log(error);
        } finally {
            return filePath;
        }
    }
}

const handeleFileSave = async (event, file) => {
    try {

        let filePath = file.filePath;

        if (file.filePath.includes("file:///")) {
            filePath = file.filePath.substr(8, file.filePath.length);
        };

        fs.writeFileSync(filePath, file.fileContent, { encoding: 'utf-8' });

    } catch (error) {
        console.log(error);
        dialog.showMessageBox(null, { message: error });
    };
    // finally {
    //     return file;
    // };
}

const readFileStats = async (event, filePaths) => {

    checkDuplicateFiles(filePaths);
    win.webContents.send("clear-table");

    files.forEach((filePath) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                win.webContents.send("file-error", err.message);
            } else {
                win.webContents.send("file-datas", filePath, stats);
            }
        });
    });
}
//#endregion
//#endregion