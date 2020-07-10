const audios = {
    kids: { file: 'kids-cheering.mp3', volume: 0.15 },
    ding: { file: 'ding.mp3', volume: 0.1 },
    whoosh: { file: 'whoosh.wav', volume: 1 },
    treasure: { file: 'zelda-treasure.mp3', volume: 0.8 },
    coin: { file: 'coin.mp3', volume: 0.7 }
};

Object.keys(audios).forEach(key => {
    const path = `sounds/${audios[key].file}`;
    const volume = audios[key].volume;
    audios[key] = new Audio();
    audios[key].src = path;
    audios[key].volume = volume;
    audios[key].preload = 'auto';
})

export default function playAudio(name) {
    const audio = new Audio();
    audio.src = audios[name].src;
    audio.volume = audios[name].volume;
    audio.play();
}