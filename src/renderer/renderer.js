//#region Declaration and Initialization
const btnOpenFile = document.getElementById("tab-open-files");
const btnSaveFile = document.getElementById("tab-save-files");
const btnEdit = document.getElementById("tab-edit");
const btnView = document.getElementById("tab-view");
const btnHelp = document.getElementById("tab-help");
const btnMeta = document.getElementById("tab-meta");
const btnFiles = document.getElementById("tab-files");
const btnGrid = document.getElementById("tab-grid");
const btnStyle = document.getElementById("tab-style");
const btnAdditional = document.getElementById("tab-additional");
const cboLanguage = document.getElementById('language');
const cboCharset = document.getElementById('charset');
const txtDescription = document.getElementById('description');
const txtKeywords = document.getElementById('keywords');
const txtAuthor = document.getElementById('author');
const txtTitle = document.getElementById('title');
//#endregion

//#region Open Files
btnOpenFile.addEventListener('click', async () => {
  await window.electronAPI.openFileStats();
});
//#endregion

//#region Save Files
btnSaveFile.addEventListener('click', async () => {
  let tabs = document.querySelectorAll("#file-tab-menu [data-page]");
  let pages = document.querySelectorAll("#renderer [data-page]");

  let htmlSites = [];

  tabs.forEach((tab) => {
    pages.forEach((page) => {
      if (tab.getAttribute("data-page") === page.getAttribute("data-page")) {

        let file = {
          filePath: tab.href,
          fileContent: createContent(page)
        };

        window.electronAPI.saveFile(file);
        htmlSites.push(file);
      };
    });
  });

  function createContent(page) {

    let clonedPage = page.cloneNode(true);

    let html = document.createElement("html");
    let head = document.createElement("head");
    let body = document.createElement("body");

    let metas = clonedPage.querySelectorAll("meta");
    let title = clonedPage.querySelector("title");
    let links = clonedPage.querySelectorAll("link");

    html.lang = language.value;

    metas.forEach((meta) => {
      head.appendChild(meta);
    });

    head.appendChild(title);

    links.forEach((link) => {
      head.appendChild(link);
    });

    html.appendChild(head);

    Array.from(clonedPage.children).forEach((child) => {
      body.appendChild(child);
    });

    html.appendChild(body);

    return html.outerHTML;
  }
});
//#endregion

//#region Meta Tab
btnMeta.addEventListener("click", () => {
  let metas = document.getElementById("properties-meta");
  let files = document.getElementById("file-list");
  metas.style.display = "initial";
  files.style.display = "none";
});
//#endregion

//#region Files Tab
btnFiles.addEventListener("click", () => {
  let metas = document.getElementById("properties-meta");
  let files = document.getElementById("file-list");
  metas.style.display = "none";
  files.style.display = "initial";
});
//#endregion

//#region Grid Tab
btnGrid.addEventListener("click", () => {

});
//#endregion

//#region Style Tab
btnStyle.addEventListener("click", () => {

});
//#endregion

//#region Additional Tab
btnAdditional.addEventListener("click", () => {

});
//#endregion

//#region Language
cboLanguage.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let language = renderer.querySelector("[data-page='" + pageNumber + "'] meta[name=language]");
  language.textContent = event.target.value;
});
//#endregion

//#region Charset
cboCharset.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let charset = renderer.querySelector("[data-page='" + pageNumber + "'] meta[charset]");
  charset.textContent = event.target.value;
});
//#endregion

//#region Description
txtDescription.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let description = renderer.querySelector("[data-page='" + pageNumber + "'] meta[name=description]");
  description.textContent = event.target.value;
});
//#endregion

//#region Keywords
txtKeywords.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let keywords = renderer.querySelector("[data-page='" + pageNumber + "'] meta[name=keywords]");
  keywords.textContent = event.target.value;
});
//#endregion

//#region Author
txtAuthor.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let author = renderer.querySelector("[data-page='" + pageNumber + "'] meta[name=author]");
  author.textContent = event.target.value;
});
//#endregion

//#region Title
txtTitle.addEventListener("input", (event) => {
  let properties = document.getElementById("properties");
  let pageNumber = properties.getAttribute("data-page");
  let title = renderer.querySelector("[data-page='" + pageNumber + "'] title");
  title.textContent = event.target.value;
});
//#endregion