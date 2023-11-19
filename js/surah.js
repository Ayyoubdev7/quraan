let url = new URLSearchParams(location.search);

(function nextSurah() {
    let next_surah = document.getElementById('next_surah')
    let id = Number(url.get('id'))
    id += 1
    if (id > 114) {
        next_surah.href = `surah.html?id=1`
    }
    else {
        next_surah.href = `surah.html?id=${id}`
    }
})();

(function prevSurah() {
    let prev_surah = document.getElementById('prev_surah')
    let id = Number(url.get('id'))
    id -= 1
    if (id > 0) {
        prev_surah.href = `surah.html?id=${id}`
    }
    else {
        prev_surah.href = `surah.html?id=1`
    }
})();

const surah = fetch(
  `https://api.quran.com/api/v4/verses/by_chapter/${url.get(
    "id"
  )}?language=ar&per_page=all&fields=text_uthmani`
)
  .then((response) => response.json())
  .then((data) => {
    let surah_content = document.getElementsByClassName(
      "surah-content mt-3 mb-0"
    )[0];
    for (let i = 0; i < data.verses.length; i++) {
      const spanAya = document.createElement("span");
      spanAya.classList.add(`aya_${i + 1}`);
      const ayat = data.verses[i].text_uthmani;
      spanAya.appendChild(document.createTextNode(ayat));
      surah_content.appendChild(spanAya);

      const verseNumber = document.createElement("span");
      verseNumber.textContent = `〘${i + 1}〙`;
      spanAya.appendChild(verseNumber);

      // console.log(spanAya);
    }

    const lastVerse = document.createElement("span");
    lastVerse.textContent = data.verses[data.verses.length - 1].text_uthmani;
  });

localStorage.setItem("Progress", url.get("id"));

// audio player =======================================================

const idSurah = +url.get("id");
console.log(idSurah);
let recitation;

async function fetchData() {
  try {
    const response = await fetch("https://quran-endpoint.vercel.app/quran");

    if (!response.ok) {
      throw new Error("Network response was not work");
    }

    const data = await response.json();
    for (ele of data.data) {
      if (ele.number === idSurah) {
        recitation = ele.recitation.full;
        document.querySelector(".surahNameAudio").textContent =
          ele.asma.ar.long;
        console.log(ele);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
fetchData();

const audioPlayer = document.querySelector(".audio-player");
const audio = new Audio();
fetchData().then(() => {
  // console.log(recitation);
  audio.src = recitation;
});

audio.addEventListener(
  "loadeddata",
  () => {
    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = 0.75;
  },
  false
);

const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener(
  "click",
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector(".controls .volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false
);

setInterval(() => {
  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
  "click",
  () => {
    if (audio.paused) {
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      audio.play();
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      audio.pause();
    }
  },
  false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = audioPlayer.querySelector(".volume-container .volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("fa-volume-high");
    volumeEl.classList.add("fa-volume-xmark");
  } else {
    volumeEl.classList.add("fa-volume-high");
    volumeEl.classList.remove("fa-volume-xmark");
  }
});

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}
