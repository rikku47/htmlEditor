//#region Declaration and Initialization
const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
//#endregion

//#region Context Bridge
contextBridge.exposeInMainWorld("electronAPI", {
    openFileStats: () => ipcRenderer.invoke("dialog:openFileStats"),
    saveFile: (file) => ipcRenderer.invoke("save:saveFile", file)
});
//#endregion

//#region Channels
ipcRenderer.on("clear-table", () => {
    let table = document.querySelector("#table");
    clearTable(table);
})

ipcRenderer.on("file-error", (message) => {
    console.log(message);
});

ipcRenderer.on("file-datas", function (event, filePath, fileDatas) {

    let table = document.querySelector("#table");
    let row = document.createElement("tr");

    let datas = [
        "atime",
        "atimeMs",
        "birthtime",
        "birthtimeMs",
        "blksize",
        "blocks",
        "ctime",
        "ctimeMs",
        "dev",
        "gid",
        "ino",
        "length",
        "mode",
        "mtime",
        "mtimeMs",
        "nlink",
        "rdev",
        "size",
        "uid"
    ];
    let length = Object.entries(fileDatas).length + 5;

    for (let index = 0; index < length; index++) {
        let cell = document.createElement("td");
        row.appendChild(cell);
    };

    row.addEventListener("click", (event) => {
        let path = event.target.parentElement.cells[18].textContent;
        ipcRenderer.invoke("dialog:readFile", path);
    });

    table.tBodies[0].appendChild(row);

    for (const property in fileDatas) {
        if (Object.hasOwnProperty.call(fileDatas, property)) {

            const value = fileDatas[property];

            switch (property) {
                case "atime":
                    row.cells[0].textContent = value
                    break;
                case "atimeMs":
                    row.cells[1].textContent = value
                    break;
                case "birthtime":
                    row.cells[2].textContent = value
                    break;
                case "birthtimeMs":
                    row.cells[3].textContent = value
                    break;
                case "blksize":
                    row.cells[4].textContent = value
                    break;
                case "blocks":
                    row.cells[5].textContent = value
                    break;
                case "ctime":
                    row.cells[6].textContent = value
                    break;
                case "ctimeMs":
                    row.cells[7].textContent = value
                    break;
                case "dev":
                    row.cells[8].textContent = value
                    break;
                case "gid":
                    row.cells[9].textContent = value
                    break;
                case "ino":
                    row.cells[10].textContent = value
                    break;
                case "mode":
                    row.cells[11].textContent = value
                    break;
                case "mtime":
                    row.cells[12].textContent = value
                    break;
                case "mtimeMs":
                    row.cells[13].textContent = value
                    break;
                case "nlink":
                    row.cells[14].textContent = value
                    break;
                case "rdev":
                    row.cells[15].textContent = value
                    break;
                case "size":
                    row.cells[16].textContent = value
                    break;
                case "uid":
                    row.cells[17].textContent = value
                    break;
            }
        };
    };

    row.cells[18].textContent = filePath;

    const edit = document.createElement("button");
    const save = document.createElement("button");
    const close = document.createElement("button");
    const checkbox = document.createElement("input");

    edit.textContent = "Edit";
    save.textContent = "Save";
    close.textContent = "Close";
    checkbox.type = "checkbox"

    save.disabled = true;

    edit.addEventListener("click", () => {

    });

    save.addEventListener("click", () => {

    });

    close.addEventListener("click", (event) => {

        let changed = false;

        if (!changed) {
            table.deleteRow(event.target.parentElement.parentElement.rowIndex);
        } else {

        };
    });

    checkbox.addEventListener("select", console.log("Checkbox"));

    row.cells[19].appendChild(edit);
    row.cells[20].appendChild(save);
    row.cells[21].appendChild(close);
    row.cells[22].appendChild(checkbox);
});

//#region Create tab and page of the HTML sites.
ipcRenderer.on("read-file", function (event, file) {
    let fileTabMenu = document.querySelector("#file-tab-menu > .tabs");
    let renderer = document.querySelector("#renderer");

    let found = false;

    // Check if element exist.
    if (fileTabMenu.children.length > 0 && !found) {
        Array.from(fileTabMenu.children).forEach((child, index) => {
            if ((child.children[0].href.includes(file.filePath.replaceAll("\\", "/")))) {
                // Set found to true.
                found = true;
                // Get current posision of element.
                indexInFileTabMenu = index;
            };
        });
    };

    // If Element not exist, create.
    if (!found) {
        let liForFile = document.createElement("li");
        let filePathAndName = document.createElement("a");

        liForFile.classList.add("tab");

        Array.from(fileTabMenu.children).forEach((child) => {
            child.children[0].classList.remove("active-tab");
            child.children[0].classList.add("inactive-tab");
        });

        filePathAndName.classList.add("tab-name", "active-tab");
        filePathAndName.href = file.filePath;
        filePathAndName.innerHTML = file.fileName;
        filePathAndName.addEventListener("click", (event) => {
            event.preventDefault();
            Array.from(event.target.parentElement.parentElement.children).forEach((element) => {
                element.children[0].classList.remove("active-tab");
                element.children[0].classList.add("inactive-tab");
            });
            event.target.classList.remove("inactive-tab");
            event.target.classList.add("active-tab");

            let pages = Array.from(renderer.children);

            pages.forEach((page) => {
                page.classList.remove("active-page");
                page.classList.add("inactive-page");
            });

            let page = renderer.querySelector('[data-page="' + event.target.dataset.page + '"]');
            page.classList.remove("inactive-page");
            page.classList.add("active-page");

            getInformations(page);
        });

        liForFile.appendChild(filePathAndName);
        fileTabMenu.appendChild(liForFile);
        filePathAndName.setAttribute('data-page', fileTabMenu.children.length);

        let page = document.createElement("div");
        page.setAttribute('data-page', fileTabMenu.children.length);
        let pages = Array.from(renderer.children);

        pages.forEach((page) => {
            page.classList.remove("active-page");
            page.classList.add("inactive-page");
        });

        page.classList.add("active-page");
        page.innerHTML = file.fileContent;

        renderer.appendChild(page);

        getInformations(page);
    };
});

ipcRenderer.on("init", () => {
    console.log("Setup");
    ipcRenderer.invoke("read:FileStats", ["G:\\Projekte\\Organisation\\ruleTheWorld\\src\\files\\kai.html", "G:\\Projekte\\Organisation\\ruleTheWorld\\src\\files\\kai.html"]);
    console.log("End of Setup");
});

function getInformations(page) {

    let pageNumber = page.getAttribute("data-page");

    let properties = document.getElementById("properties");
    properties.setAttribute("data-page", pageNumber);
    
    let charsetAltText = "No charset found."
    let descriptionAltText = "No description found."
    let keywordsAltText = "No keywords found."
    let authorAltText = "No author found."
    let titleAltText = "No title found."

    let charset = document.getElementById("charset");
    let description = document.getElementById("description");
    let keywords = document.getElementById("keywords");
    let author = document.getElementById("author");
    let title = document.getElementById("title");

    if (charset) {
        charset.value = page.querySelector("meta[charset]").getAttribute("charset") ?? charsetAltText;
    };

    if (description) {
        description.value = page.querySelector("meta[name=description]").getAttribute("content") ?? descriptionAltText;
    };

    if (keywords) {
        keywords.value = page.querySelector("meta[name=keywords]").getAttribute("content") ?? keywordsAltText;
    };

    if (author) {
        author.value = page.querySelector("meta[name=author]").getAttribute("content") ?? authorAltText;
    };

    if (title) {
        title.value = page.querySelector("title").textContent ?? titleAltText;
    };
}

//#endregion

//#region Function
function clearTable(table) {
    if (table.rows.length > 1) {
        for (let i = table.rows.length; i > 1; i--) {
            table.deleteRow(1);
        };
    };
}
//#endregion