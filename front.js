// Công việc phải làm
/*
1. Render songs    OK
2. Scroll top      OK
3. Play/ pause/ seek    OK
4. CD rotate           OK
5. next/prev           OK
6. random              OK
7. next/reat when ended    OK
8. active songs            OK
9. scroll active songs into view    OK
10. Play song when click     
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Như một người dưng',
            singer:  'Yang Remix',
            path: '../music/như-một-người-dưng.mp3',
            image: '../imge/như một người dưng.jpg'
        },
        {
            name: 'Để anh lương thiện',
            singer:  '???',
            path: '../music/anh-thôi-lương-thiện.mp3',
            image: '../imge/anh thôi lương thiện.jpg'
        },
        {
            name: 'Đông miên 2023',
            singer:  'Lưu Triệu Vũ',
            path: '../music/đông-miên-2023.mp3',
            image: '../imge/đông miên 2023.jpg'
        },
        {
            name: 'Chầm chậm',
            singer:  'Tiểu Lạc Ca',
            path: '../music/chầm-chậm.mp3',
            image: '../imge/chầm chậm.jpg'
        },
        {
            name: 'Tháp rơi tự do',
            singer:  'LB Lợi Bỉ',
            path: '../music/tháp-rơi-tự-do.mp3',
            image: '../imge/tháp rơi tự do.jpg'
        },
        {
            name: 'Nếu tình yêu đã lãng quên',
            singer:  'Uông Tô Lang - Thiện Y Thuần',
            path: '../music/nếu-tình-yêu-đã-lãng-quên_1.mp3',
            image: '../imge/nếu tình yêu đã lãng quên.jpg'
        }
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this; //this này là tượng trưng cho app, _this là dùng gián tiếp app trong các nút con
        const cdWidth = cd.offsetWidth;

        // Xử lí quay/dừng CD khi đang phát bài hát
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 giây
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lí phóng to, thu nhỏ đĩa CD hiện bài hát đang phát
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            console.log(newCdWidth);

            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/ cdWidth;
        }
        // Xử lí khi kích vào nút play
        playBtn.onclick = function(){
            if (_this.isPlaying){
                // để dừng nhạc
                audio.pause();
            }
            else{
                // để phát nhạc
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            // chuyển hình nút pause thành nút đang chạy
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            // chuyển hình nút play thành nút pause
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát đang chạy, nút dưới cũng chạy theo
        audio.ontimeupdate = function(){
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime/audio.duration *100);
                progress.value = progressPercent;
                progress.style.background =  `linear-gradient(to right, #ec1f55 ${progressPercent}%, #ddd ${progressPercent}%)`;
            }
        }
        
        // Xử lí khi tua bài hát
        progress.oninput = function(e){
            const seekTime = audio.duration/ 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next bài hát sau
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev bài hát trước
        prevBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
        }
        

        // Xử lí bật/tắt random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }

        // Xử lý next bài hát khi audio ended
        audio.onended = function(){
            if (_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')){
                // xử lí click vô bài hát
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        }
    },
    scrollToActiveSong : function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        // Gán cấu hình từ config vào ứng dụng 
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe, xử lý các sự kiện (DOM Events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active',_this.isRandom);
        repeatBtn.classList.toggle('active',_this.isRepeat);
    }
};

app.start();