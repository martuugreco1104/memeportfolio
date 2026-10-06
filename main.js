document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       HOVER PLAYBACK & VOLUME TOGGLE
       ========================================= */
    const interactiveCards = document.querySelectorAll('.interactive-card');
    
    interactiveCards.forEach(card => {
        const video = card.querySelector('video.card-video');
        const volumeBtn = card.querySelector('.volume-toggle');
        if (!video) return;

        // Ensure video is muted by default so autoplay hover works
        video.muted = true;
        
        // Pausar y resetear en load
        video.pause();
        video.currentTime = 0.1;

        card.addEventListener('mouseenter', () => {
            video.playPromise = video.play();
        });

        card.addEventListener('mouseleave', () => {
            if (video.playPromise !== undefined) {
                video.playPromise.then(() => {
                    video.pause();
                    video.currentTime = 0.1;
                    // Resetear a mute al salir para que no asuste si vuelven a entrar
                    video.muted = true;
                    if(volumeBtn) updateVolumeIcon(volumeBtn, true);
                }).catch(err => {
                    // Autoplay was prevented
                });
            } else {
                video.pause();
                video.currentTime = 0.1;
                video.muted = true;
                if(volumeBtn) updateVolumeIcon(volumeBtn, true);
            }
        });

        // Toggle Volumen
        if (volumeBtn) {
            volumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Evitar que burbujee si hay links
                video.muted = !video.muted;
                updateVolumeIcon(volumeBtn, video.muted);
            });
        }
    });

    // Helper para actualizar icono SVG del volumen
    function updateVolumeIcon(btn, isMuted) {
        if (isMuted) {
            // Muted Icon
            btn.innerHTML = `<svg class="icon-mute" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
        } else {
            // Unmuted (Volume Up) Icon
            btn.innerHTML = `<svg class="icon-unmute" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        }
    }

    /* =========================================
       COPIAR MAIL (FOOTER)
       ========================================= */
    const copyBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toast');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText('eteresmeralda@gmail.com').then(() => {
                toast.classList.add('show');
                const originalText = this.textContent;
                this.textContent = 'Â¡¡Copiado!';
                
                setTimeout(() => {
                    toast.classList.remove('show');
                    this.textContent = originalText;
                }, 3000);
            });
        });
    }
    /* =========================================
       INLINE YOUTUBE PLAYBACK
       ========================================= */
    const ytPlayers = document.querySelectorAll('.yt-inline-player');
    ytPlayers.forEach(player => {
        player.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (!videoId) return;

            this.innerHTML = `<iframe class="yt-iframe" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`; 
            this.classList.remove('yt-card');
            this.style.transform = 'none';
        });
    });


    /* =========================================
       HERO PREVIEW REEL
       ========================================= */
    const previewLabels = document.querySelectorAll('.preview-label');
    const heroPreviewVideo = document.getElementById('heroPreviewVideo');

    if (previewLabels.length > 0 && heroPreviewVideo) {
        previewLabels.forEach(label => {
            label.addEventListener('click', function() {
                // Remove active class from all
                previewLabels.forEach(lbl => lbl.classList.remove('active'));
                // Add active to current
                this.classList.add('active');
                
                // Change video src
                const newSrc = this.getAttribute('data-vid');
                if (newSrc && heroPreviewVideo.src !== newSrc) {
                    heroPreviewVideo.src = newSrc;
                    heroPreviewVideo.play();
                }
            });
        });
    }



    /* =========================================
       3D TILT EFFECT & GLARE
       ========================================= */
    const heroSplit = document.querySelector('.hero-split');
    const mockup = document.querySelector('.preview-mockup');
    const glare = document.querySelector('.mockup-glare');
    const playhead = document.querySelector('.timecode-playhead');
    const timecodeBar = document.querySelector('.timecode-bar');

    if(heroSplit) {
        heroSplit.addEventListener('mousemove', (e) => {
            if(mockup) {
                const rect = heroSplit.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Normalize for rotation (-1 to 1)
                const xNorm = (x / rect.width) * 2 - 1;
                const yNorm = (y / rect.height) * 2 - 1;

                // Rotations (max 8 deg)
                const rotX = yNorm * -8;
                const rotY = xNorm * 8;

                mockup.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

                if(glare) {
                    glare.style.opacity = '1';
                    // Center glare around mouse position
                    const mockupRect = mockup.getBoundingClientRect();
                    const glareX = e.clientX - mockupRect.left;
                    const glareY = e.clientY - mockupRect.top;
                    glare.style.background = `radial-gradient(circle at ${glareX}px ${glareY}px, rgba(255,255,255,0.2), transparent 50%)`;
                }
            }
            
            // Playhead mapping
            if(timecodeBar && playhead) {
                const barRect = timecodeBar.getBoundingClientRect();
                // We use window clientX, relative to the bar
                let playX = e.clientX - barRect.left;
                if(playX < 0) playX = 0;
                if(playX > barRect.width) playX = barRect.width;
                playhead.style.transform = `translateX(${playX}px)`;
            }
        });

        heroSplit.addEventListener('mouseleave', () => {
            if(mockup) {
                mockup.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            }
            if(glare) {
                glare.style.opacity = '0';
            }
        });
    }

    /* =========================================
       TIMECODE COUNTER
       ========================================= */
    const tcText = document.querySelector('.timecode-text');
    if(tcText) {
        let frameCount = 0;
        const updateTC = () => {
            frameCount++;
            const date = new Date();
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            const ff = String(frameCount % 24).padStart(2, '0');
            tcText.textContent = `${hh}:${mm}:${ss}:${ff}`;
            requestAnimationFrame(updateTC);
        };
        updateTC();
    }

});
