const { getSongById } = require("genius-lyrics-api");
const fetch = require('node-fetch');

class ArtistSet {

    // 3158 Milo
    // 96862 Scallops Hotel
    // 1840820 R.A.P. Ferreira

    // Individual songs to block
    BLOCKED_SONG_IDS = [
        6393069, 
        7105027, 
        3420106,
        4051931
    ]

    constructor(...rest) {
        this.artist_ids = [...rest];
        this.discography = [];
        this.song_object = {
            lyrics: []
        }
    }
    
    async fetchSongs(artists=this.artist_ids) {
        let counter = 0;
        for (const artist of artists) {
            let page = 1;
            let response_collector = [];
            let response_song_collector = [];
            let loop = true;
            while (loop) {
                const response = await fetch(`https://api.genius.com/artists/${artist}/songs?per_page=50&page=${page}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
                        },
                    })
    
                    const data = await response.json()
                    let songs = data["response"]["songs"];
                    let next_page = data["response"]["next_page"];
    
                    response_song_collector.push(JSON.stringify(data, null, 4))

                    songs.forEach(song => {
                        if (!this.artist_ids.some(artist_id => String(song["primary_artist"]["id"]).includes(artist_id))) return
                        if (this.BLOCKED_SONG_IDS.some(blocked_id => String(song["id"]).includes(blocked_id))) return 
                        
                        response_collector.push([song["id"], song["title"]])
                    });
    
                    if (!next_page) {
                        loop = false;
                        return this.discography = response_collector.map(song => (song));
                    } else {
                        page = next_page;
                    }
                await new Promise(r => setTimeout(r, 20));
                }
                counter += 1;
        }
    }

    async download(id=0) {
        if (!id) return console.error("No ID supplied.")
        let try_again = true;
        let song_object = { lyrics: [] };
        while (try_again) {
            song_object = await getSongById(id, process.env.GENIUS_ACCESS_TOKEN);
            if(song_object.lyrics) {
                try_again = false;
            }
        
            this.song_object = song_object
        }

        this.song_object.lyrics = this.song_object.lyrics.split(/\n/);

        for (let i = this.song_object.lyrics.length - 1; i >= 0; i--) {
            if (this.song_object.lyrics[i].charAt(0) === '[' ||
            this.song_object.lyrics[i].charAt(0) === '' ||
            this.song_object.lyrics[i].includes("?")) { 
                this.song_object.lyrics.splice(i, 1);
            }
            this.song_object.lyrics[i].charAt(0).toLowerCase()
        }
    }

    randomSong() {
        return this.discography[Math.floor(Math.random() * this.discography.length)];
    }

    randomSet() {
        const batch = [];

        const random = Math.floor(Math.random() * this.song_object.lyrics.length-2)
        
        batch.push(this.song_object.lyrics[random],this.song_object.lyrics[random + 1], this.song_object.lyrics[random + 2])
        
        return batch
    }
}

module.exports = ArtistSet;