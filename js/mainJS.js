fetch('https://api.quran.com/api/v4/chapters?fields=text_uthmani')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const chapters = data.chapters;
    let list = document.querySelector(".main_list ul"); // Select the parent <ul> element

    for (let i = 0; i < chapters.length; i++) {
      list.innerHTML += `<li><a href=surah.html?id=${chapters[i].id}>سورة ${chapters[i].name_arabic}</a></li>`;
    }
  })
  .catch(error => console.error(error));
