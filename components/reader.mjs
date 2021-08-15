import { request } from "../api.mjs";

const colors = ["#E2D4FF", "#B8CCDE", "#D7F5EA", "#C4DEB8", "#FCEC72"];

let currentHelper = {};

const myWordClick = (obj, el) => {
    if(currentHelper?.parent == el) {
        currentHelper.helper.remove();
        currentHelper.parent.classList.remove("is-active");
        currentHelper = {};
        return;
    }

    if(currentHelper?.helper) {
        currentHelper.helper.remove();
        currentHelper.parent.classList.remove("is-active");
    }

    let helper = document.createElement("div");
    helper.classList.add("helper");

    let translateElement = document.createElement("p");
    translateElement.innerHTML = `<p>Ваш перевод: ${obj.translate}</p>`;

    helper.append(translateElement);
    currentHelper.helper = helper;
    currentHelper.parent = el;
    currentHelper.parent.classList.add("is-active");

    el.append(helper);
};
const wordClick = (obj, el) => {
    if(currentHelper?.parent == el) {
        currentHelper.helper.remove();
        currentHelper.parent.classList.remove("is-active");
        currentHelper = {};
        return;
    }

    if(currentHelper?.helper) {
        currentHelper.helper.remove();
        currentHelper.parent.classList.remove("is-active");
    }

    let helper = document.createElement("div");
    helper.classList.add("helper");
    helper.classList.add("translate");

    let translateElement = document.createElement("p");
    request("http://185.231.247.155:5000/api/words/translate",
            "POST", 
            {
                words: obj.value,
                targetLanguageCode: /[a-zA-Z]/.test(obj.value)? "ru" : "en"
            })
        .then(res => {
            translateElement.innerHTML = `<p>Перевод: ${res.translations[0].text}</p>`;
            helper.append(translateElement);
            currentHelper.helper = helper;
            currentHelper.parent = el;
            currentHelper.parent.classList.add("is-active");

            el.append(helper);
        })
};

export const Reader = (text, helperController) => {
    let element = document.createElement("div");
    element.classList.add("reader");

    let array = text.split(/(?=[.\s]|\b)/);
    array = array.filter(cur => cur !== " " && cur !== "");

    let colorIndex = 0;
    let brAppended = true;

    let items = [];

    array = request("http://185.231.247.155:5000/api/words/reader", "POST", {words: array}).then(res => {
        res.reader.forEach(word => {
            let typeElement = document.createElement("div");
            let wordElement = document.createElement("p");
            let box = document.createElement('div');

            box.classList.add("box");
            typeElement.classList.add("type");
            switch (word.itemType) {
                case 0:
                    if(word.value == "\n") {
                        let br = document.createElement("div");
                        br.classList.add("br");
                        brAppended = true;
                        box = br;
                    } else {
                        wordElement.innerText = word.value;
                        box.classList.add("word");
                        box.title = "Перевести?";

                        if(brAppended) {
                            // TODO =>
                            // box.style.marginLeft = "60px";
                            brAppended = false;
                        }

                        box.addEventListener("click", () => wordClick(word, box));
                    }
                    break;
                case 1:
                    wordElement.innerText = word.value;
                    typeElement.style.backgroundColor = colors[colorIndex];
                    colorIndex++;
                    if(colorIndex == colors.length) colorIndex = 0;

                    box.classList.add("word");

                    if(brAppended) {
                        box.style.marginLeft = "60px";
                        brAppended = false;
                    }

                    box.addEventListener("click", () => myWordClick(word, box));
                    break;
                case 2:
                    wordElement.innerText = word.value;
                    if(brAppended) {
                        box.style.marginLeft = "60px";
                        brAppended = false;
                    }
                    box.classList.add("symbol");
                    break;
            }
            items.push(typeElement);
            box.append(typeElement);
            box.append(wordElement);

            helperController.addEventListener("change", () => {
                element.changeOpacity(+helperController.value);
            });
            element.changeOpacity(+helperController.value);

            element.append(box);
        });
    });

    document.body.addEventListener("click", (e) => {
        if(currentHelper?.helper && !e.target.classList.contains("box")) {
            currentHelper.helper.remove();
            currentHelper.parent.classList.remove("is-active");
            currentHelper = {};
        }
    });
    
    element.changeOpacity = (val) => {
        items.forEach(item => item.style.opacity = val/100);
    };

    return element;
};