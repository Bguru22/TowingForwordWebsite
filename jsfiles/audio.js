// audio.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all audio players on the page
    const audioPlayers = document.querySelectorAll('.audio');
    
    audioPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        const playButton = player.querySelector('.play-button');
        const speedControl = player.querySelector('.speed-control');
        const downloadBtn = player.querySelector('.download-btn');
        const timeDisplays = player.querySelectorAll('.time-display');
        const waveBars = player.querySelectorAll('.wave-bar');
        
        let isPlaying = false;
        let playbackRates = [1, 1.5, 2];
        let currentRateIndex = 0;
        
        // Format time (seconds to mm:ss)
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
        
        // Update time display
        function updateTime() {
            timeDisplays[0].textContent = formatTime(audio.currentTime);
            timeDisplays[1].textContent = formatTime(audio.duration);
            
            // Update wave animation
            if (isPlaying) {
                waveBars.forEach(bar => {
                    const randomHeight = 8 + Math.random() * 10;
                    bar.style.height = `${randomHeight}px`;
                    bar.classList.add('active');
                });
            }
        }
        
        // Play/pause functionality
        playButton.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                playButton.textContent = '▶';
                waveBars.forEach(bar => bar.classList.remove('active'));
            } else {
                audio.play();
                playButton.textContent = '❚❚';
            }
            isPlaying = !isPlaying;
        });
        
        // Speed control functionality
        speedControl.addEventListener('click', function() {
            currentRateIndex = (currentRateIndex + 1) % playbackRates.length;
            const newRate = playbackRates[currentRateIndex];
            audio.playbackRate = newRate;
            speedControl.textContent = `${newRate}×`;
        });
        
        // Download functionality
        downloadBtn.addEventListener('click', function() {
            const a = document.createElement('a');
            a.href = audio.src;
            a.download = `audio-demo-${player.dataset.demo}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
        
        // Update time display periodically
        audio.addEventListener('timeupdate', updateTime);
        
        // When audio ends
        audio.addEventListener('ended', function() {
            isPlaying = false;
            playButton.textContent = '▶';
            waveBars.forEach(bar => bar.classList.remove('active'));
        });
        
        // Initialize time display
        audio.addEventListener('loadedmetadata', function() {
            timeDisplays[1].textContent = formatTime(audio.duration);
        });
    });
});