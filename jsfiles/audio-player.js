  function initializeAudioPlayers() {
            const audioPlayers = document.querySelectorAll('.audio-player');
            
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
                let animationInterval;
                
                // Format time (seconds to mm:ss)
                function formatTime(seconds) {
                    if (isNaN(seconds)) return '0:00';
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = Math.floor(seconds % 60);
                    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
                }
                
                // Update time display
                function updateTime() {
                    if (timeDisplays[0]) {
                        timeDisplays[0].textContent = formatTime(audio.currentTime);
                    }
                    if (timeDisplays[1]) {
                        timeDisplays[1].textContent = formatTime(audio.duration);
                    }
                }
                
                // Animate wave bars
                function animateWaves() {
                    if (isPlaying) {
                        waveBars.forEach(bar => {
                            const randomHeight = 8 + Math.random() * 10;
                            bar.style.height = `${randomHeight}px`;
                            bar.classList.add('active');
                        });
                    } else {
                        waveBars.forEach(bar => {
                            bar.classList.remove('active');
                        });
                    }
                }
                
                // Play/pause functionality
                playButton.addEventListener('click', function() {
                    if (isPlaying) {
                        audio.pause();
                        playButton.textContent = '▶';
                        isPlaying = false;
                        clearInterval(animationInterval);
                        animateWaves();
                    } else {
                        // Try to play the audio
                        const playPromise = audio.play();
                        
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                playButton.textContent = '❚❚';
                                isPlaying = true;
                                animationInterval = setInterval(animateWaves, 100);
                            }).catch(error => {
                                console.log('Audio play failed:', error);
                                alert('Audio playback failed. Please check if the audio file exists and is accessible.');
                            });
                        } else {
                            // Fallback for older browsers
                            playButton.textContent = '❚❚';
                            isPlaying = true;
                            animationInterval = setInterval(animateWaves, 100);
                        }
                    }
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
                    a.download = `audio-demo-${player.dataset.demo || 'file'}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
                
                // Audio event listeners
                audio.addEventListener('timeupdate', updateTime);
                
                audio.addEventListener('ended', function() {
                    isPlaying = false;
                    playButton.textContent = '▶';
                    clearInterval(animationInterval);
                    animateWaves();
                });
                
                audio.addEventListener('loadedmetadata', function() {
                    updateTime();
                });
                
                // Handle audio loading errors
                audio.addEventListener('error', function() {
                    console.error('Audio loading error for:', audio.src);
                    playButton.style.background = '#9ca3af';
                    playButton.style.cursor = 'not-allowed';
                });
                
                // Initialize display
                updateTime();
            });
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initializeAudioPlayers);