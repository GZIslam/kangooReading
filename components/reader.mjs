import { request } from "../api.mjs";

const colors = ["#E2D4FF", "#B8CCDE", "#D7F5EA", "#C4DEB8", "#FCEC72"];

let currentHelper = {};

const myWordClick = (obj, el) => {
    if(currentHelper?.parent == el) {
        currentHelper.helper.remove();
        currentHelper = {};
        return;
    }

    if(currentHelper?.helper) currentHelper.helper.remove();

    let helper = document.createElement("div");
    helper.classList.add("helper");

    let translateElement = document.createElement("p");
    translateElement.innerHTML = `<p>Ваш перевод: ${obj.translate}</p>`;

    helper.append(translateElement);
    currentHelper.helper = helper;
    currentHelper.parent = el;

    el.append(helper);
};
const wordClick = (obj, el) => {
    if(currentHelper?.parent == el) {
        currentHelper.helper.remove();
        currentHelper = {};
        return;
    }

    if(currentHelper?.helper) currentHelper.helper.remove();

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

            el.append(helper);
        })
};

export const Reader = (text) => {
    let element = document.createElement("div");
    element.classList.add("reader");

    let array = text.split(/(?=[.\s]|\b)/);
    array = array.filter(cur => cur !== " " && cur !== "");

    let colorIndex = 0;
    let brAppended = true;

    let items = [];

    array = request("http://185.231.247.155:5000/api/words/reader", "POST", {words: array}).then(res => {
        res.reader.forEach(word => {
            let item = document.createElement("div");
            let wordElement = document.createElement("p");
            let box = document.createElement('div');

            box.classList.add("box");
            item.classList.add("item");
            switch (word.itemType) {
                case 0:
                    if(word.value == "\n") {
                        let br = document.createElement("div");
                        br.classList.add("br");
                        brAppended = true;
                        element.append(br);
                    } else {
                        wordElement.innerText = word.value;
                        item.classList.add("word");
                        box.title = "Перевести?";

                        if(brAppended) {
                            box.style.marginLeft = "60px";
                            brAppended = false;
                        }

                        box.addEventListener("click", () => wordClick(word, box));
                    }
                    break;
                case 1:
                    wordElement.innerText = word.value;
                    item.style.backgroundColor = colors[colorIndex];
                    colorIndex++;
                    if(colorIndex == colors.length) colorIndex = 0;

                    item.classList.add("word");

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
                    item.classList.add("symbol");
                    break;
            }
            items.push(item);
            box.append(item);
            box.append(wordElement);
            element.append(box);
        });
    });

    document.body.addEventListener("click", (e) => {
        if(currentHelper?.helper && !e.target.classList.contains("box")) {
            currentHelper.helper.remove();
            currentHelper = {};
        }
    });
    
    element.changeOpacity = (val) => {
        items.forEach(item => item.style.opacity = val/100);
    };

    return element;
};