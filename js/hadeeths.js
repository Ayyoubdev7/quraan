"use strict";
const hadeeths = document.getElementById("hadeeth_content");
const pagination = document.getElementById("pagination");
const hadithsPerPage = 30;
let currentPage = 1;
let totalHadiths = null;

const buttons = document.querySelectorAll(".books button");
let dataBooksRef = localStorage.getItem("dataBooksRef") || "muslim";

if (dataBooksRef === "muslim") totalHadiths = 4930;
if (dataBooksRef === "bukhari") totalHadiths = 6638;
if (dataBooksRef === "tirmidzi") totalHadiths = 3625;
if (dataBooksRef === "nasai") totalHadiths = 5364;
if (dataBooksRef === "abu-daud") totalHadiths = 4419;
if (dataBooksRef === "ibnu-majah") totalHadiths = 4285;
if (dataBooksRef === "ahmad") totalHadiths = 4305;
if (dataBooksRef === "darimi") totalHadiths = 2949;
if (dataBooksRef === "malik") totalHadiths = 1587;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    location.reload();
    dataBooksRef = button.getAttribute("data-books");
    localStorage.setItem("dataBooksRef", dataBooksRef);
    getHadiths(currentPage);
  });
});
console.log(dataBooksRef);
buttons.forEach((rawybutton) => {
  if (dataBooksRef === rawybutton.getAttribute("data-books")) {
    rawybutton.classList.add(
      "border",
      "border-3",
      "border-primary",
      "border-bottom-3",
      "border-top-0",
      "border-end-0",
      "border-start-0",
      "rounded-0",
      "fs-4",
      "text-primary"
    );
  } else {
    rawybutton.style.backgroundColor = "";
  }
});

function updateActivePageButton() {
  const pageButtons = document.querySelectorAll(
    "#pagination button:not(:first-child):not(:last-child)"
  );

  pageButtons.forEach((button, index) => {
    const classesStyle1 = [
      "border",
      "border-3",
      "text-primary",
      "border-primary",
      "border-top-0",
      "border-end-0",
      "border-start-0",
      "rounded-0",
      "fs-4",
    ];
    if (index + 1 === currentPage) {
      button.classList.add(...classesStyle1);
    } else {
      button.classList.remove(...classesStyle1);
    }
  });
}

const textToVoice = (arabicText) => {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = "ar";
  speech.text = arabicText;

  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const hodaVoice = voices.find(
      (voice) => voice.name === "Microsoft Hoda - Arabic (Egypt)"
    );
    speech.voice = hodaVoice;
    window.speechSynthesis.speak(speech);
  };

  window.speechSynthesis.getVoices().length !== 0
    ? setVoice()
    : window.speechSynthesis.addEventListener("voiceschanged", setVoice);
};

const stopSpeech = () => {
  window.speechSynthesis.cancel();
};
const stopVoiceBtnElement = document.createElement("button");
stopVoiceBtnElement.classList.add(
  "stopVoiceBtn",
  "fixed-bottom",
  "btn",
  "bg-dark",
  "text-primary"
);
stopVoiceBtnElement.textContent = "ايقاف";
document.body.appendChild(stopVoiceBtnElement);

const stopVoiceBtn = document.querySelector(".stopVoiceBtn");
stopVoiceBtn.style.display = "none";
stopVoiceBtn.addEventListener("click", () => {
  stopSpeech();
  stopVoiceBtn.style.display = "none";
});

let getHadiths = (page) => {
  currentPage = page;
  const startIndex = (page - 1) * hadithsPerPage + 1;
  const endIndex = startIndex + hadithsPerPage - 1;
  let url = `https://api.hadith.gading.dev/books/${dataBooksRef}?range=${startIndex}-${endIndex}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hadeeths.innerHTML = "";

      for (let i = 0; i < data.data.hadiths.length; i++) {
        const hadeethsDiv = document.createElement("div");
        hadeethsDiv.innerHTML = `
          <span class="hadeeth_span">${data.data.hadiths[i].arab}</span> <br><br>
        `;
        hadeethsDiv.classList.add(
          "hadeethsDiv",
          "pt-5",
          "border",
          "border-tertiary",
          "border-2",
          "border-top-0",
          "border-end-0",
          "border-start-0"
        );
        hadeeths.appendChild(hadeethsDiv);
        const voiceBtnElement = document.createElement("button");
        voiceBtnElement.classList.add(
          "voiceBtn",
          "fs-6",
          "text-primary",
          "btn"
        );
        voiceBtnElement.textContent = "استمع";
        hadeethsDiv.insertAdjacentElement("beforeend", voiceBtnElement);

        voiceBtnElement.addEventListener("click", () => {
          stopVoiceBtn.style.display = "block";
          const arabicText = data.data.hadiths[i].arab;
          textToVoice(arabicText);
        });
      }
      console.log(totalHadiths);
      console.table(data);
      updateActivePageButton();
    })
    .catch((error) => console.log("error", error));
};
window.addEventListener("beforeunload", () => {
  stopSpeech();
});

// -=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const previousButton = document.createElement("button");
previousButton.innerText = "السابق";
previousButton.classList.add("btn", "border-dark", "previousButton");
previousButton.addEventListener("click", () => {
  if (currentPage > 1) {
    getHadiths(currentPage - 1);
  }
});
document.querySelector(".previousButton").appendChild(previousButton);

for (let i = 1; i <= Math.ceil(totalHadiths / hadithsPerPage) - 1; i++) {
  const pageButton = document.createElement("button");
  pageButton.innerText = i;
  pageButton.classList.add("btn");
  pageButton.addEventListener("click", () => {
    getHadiths(i);
  });
  pagination.appendChild(pageButton);
}

const nextButton = document.createElement("button");
nextButton.innerText = "التالي";
nextButton.classList.add("btn", "border-dark", "nextButton");
nextButton.addEventListener("click", () => {
  let lastPage = Math.ceil(totalHadiths / hadithsPerPage);
  console.log(lastPage);
  if (currentPage < lastPage) {
    getHadiths(currentPage + 1);
  }
});
document.querySelector(".nextButton").appendChild(nextButton);

const hiddeneBtn = document.createElement("button");
hiddeneBtn.classList.add("btn", "overflow-hidden", "w-25");
hiddeneBtn.style.border = "none";
hiddeneBtn.style.pointerEvents = "none";
pagination.insertAdjacentElement("afterbegin", hiddeneBtn);
const clonedBtn = hiddeneBtn.cloneNode(true);
pagination.insertAdjacentElement("beforeend", clonedBtn);

getHadiths(currentPage);
