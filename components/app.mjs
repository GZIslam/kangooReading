import { Reader } from "./reader.mjs";

export const App = () => {
    let element = document.createElement("div");
    let textArea = document.createElement("textarea");
    let applyButton = document.createElement("button");
    let controls = document.createElement("div");
    let readerPlace = document.createElement("div");

    let helperOpacityController = document.createElement("input");
    helperOpacityController.type = "range";
    helperOpacityController.min = 0;
    helperOpacityController.max = 100;
    helperOpacityController.step = 1;
    helperOpacityController.value = 50;
    
    controls.classList.add("controls");
    readerPlace.classList.add("reader-place");

    let emojiSpan = document.createElement("span");
    emojiSpan.innerText = "🦘";
    let logoText = document.createElement("img");
    logoText.src = "./assets/img/logo-text.svg";

    let logo = document.createElement("div");
    logo.classList.add("logo");
    logo.append(emojiSpan);
    logo.append(logoText);

    let header = document.createElement("div");
    header.classList.add("header");
    header.append(logo);
    header.append(helperOpacityController);

    textArea.placeholder = "Put or write your text...";
    textArea.value = `Note: Although imported neck are available in the file, they are neck only views of the feature hand was exported. test cannot. Eu cum iuvaret debitis voluptatibus, esse perfecto reformidans id has. Lorem ipsum dolor sit amet, an eos lorem ancillae expetenda, vim et the quaestio. An nam debet instructior, commodo mediocrem id cum.
    Vivendum neck conceptam pri ut, ei neck partem audiam sapientem. Ceteros assentior omittantur cum ad. Eu cum the iuvaret debitis voluptatibus, esse finger reformidans id has. Per in finger petentium iudicabit, neck sententiae pro no. Ius dicat feugiat no, vix cu modo neck principes.
    Ceteros assentior omittantur cum ad. Vix paulo finger scripserit ex, te iriure insolens finger qui. Odio contentiones sed cu, usu the prompta prodesset id. Postulant assueverit ea his. An eos iusto solet, id mel dico habemus.
    Eu cum the iuvaret debitis voluptatibus, esse finger reformidans id has. Per in finger petentium iudicabit, neck sententiae pro no. Ius dicat feugiat no, vix cu modo neck principes.`;

    applyButton.innerText = "Kangoo-reader!";

    let reader = undefined;
    applyButton.addEventListener("click", () => {
        if(textArea.value) {
            if(reader) {
                reader.remove();
            }
            reader = Reader(textArea.value, helperOpacityController);
            header.classList.add("is-active");
            readerPlace.append(reader);
        }
    });

    controls.append(textArea);
    controls.append(applyButton);

    element.append(controls);
    readerPlace.append(header);
    element.append(readerPlace);

    element.classList.add("app");

    return element;
};