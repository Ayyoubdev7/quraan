surahLink = document.getElementById('surahlink'),
readMsg = document.getElementById('readmessage');

if (localStorage.getItem("Progress")) {
    fetch(`https://api.quran.com/api/v4/chapters/${localStorage.getItem('Progress')}?language=ar`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('surahname').textContent = data.chapter.name_arabic;
            document.getElementById('ayacount').textContent = data.chapter.verses_count;
            document.getElementById('surahtype').textContent = data.chapter.revelation_place == "makkah" ? "مكية" : "مدنية";
            document.getElementById('surahorder').textContent = data.chapter.revelation_order;
            document.getElementById('surahlink').href = `surah.html?id=${data.chapter.id}`
            document.getElementById('rocketlink').href = `surah.html?id=${data.chapter.id}`
        })
    readMsg.style.display = "none";
    surahLink.style.display = "block";
}
else {
    surahLink.style.display = "none";
    readMsg.style.display = "block";
    document.getElementById('progressinfo').style.display = "none"
}
