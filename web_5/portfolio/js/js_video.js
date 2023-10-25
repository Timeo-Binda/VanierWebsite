               const nav = document.getElementById('nav');
                window.addEventListener('scroll', () => {
                    if (window.scrollY >= 100) {
                        nav.classList.add('nav__black');
                    } else {
                        nav.classList.remove('nav__black');
                    }
                });


                // Récupérez le bouton "Play" par son ID
                const playButton = document.getElementById('play-button');

                // Ajoutez un gestionnaire d'événements clic au bouton "Play"
                playButton.addEventListener('click', () => {
                    // Sélectionnez la vidéo et modifiez sa source pour la première vidéo
                    const video = document.getElementById('video');
                    video.src = '../media/video_site/BINDA_virtual_rivalry.mp4';

                    // Affichez l'overlay
                    overlay.style.display = 'flex';
                });



                // Sélectionnez tous les posters
                const posters = document.querySelectorAll('.row__posterLarge');

                // Sélectionnez l'overlay et le bouton de fermeture
                const overlay = document.getElementById('overlay');
                const closeButton = document.getElementById('close-btn');

                // Créez un tableau d'URLs de vidéos correspondantes à chaque poster
                const videoSources = [
                    '../../media/video_site/BINDA_virtual_rivalry.mp4',
                    '../../media/video_site/m.mp4',
                    '../../media/video_site/BINDA_9_shots.mp4',
                    '../../media/video_site/binda_netflix_cinemagraph.mp4',
                    '../../media/video_site/binda_oasis_loop.mp4',
                    '../../media/video_site/arctic_monkeys.mp4',
                    '../../media/video_site/shaka_ponk.mp4',
                    // Ajoutez d'autres liens de vidéos ici (un pour chaque poster)
                ];

                // Ajoutez un gestionnaire d'événement clic à chaque poster
                posters.forEach((poster, index) => {
                    poster.addEventListener('click', () => {
                        // Sélectionnez la vidéo et modifiez sa source en utilisant l'index
                        const video = document.getElementById('video');
                        video.src = videoSources[index];

                        // Affichez l'overlay
                        overlay.style.display = 'flex';
                    });
                });

                // Ajoutez un gestionnaire d'événement clic pour fermer l'overlay
                closeButton.addEventListener('click', () => {
                    // Cachez l'overlay
                    overlay.style.display = 'none';

                    // Arrêtez la vidéo lorsque l'overlay est fermé (facultatif)
                    const video = document.getElementById('video');
                    video.pause();
                    video.currentTime = 0;
                });

                // Ajoutez un gestionnaire d'événement clic pour fermer l'overlay en cliquant à l'extérieur de la vidéo
                overlay.addEventListener('click', (event) => {
                    if (event.target === overlay) {
                        // Cachez l'overlay
                        overlay.style.display = 'none';

                        // Arrêtez la vidéo lorsque l'overlay est fermé (facultatif)
                        const video = document.getElementById('video');
                        video.pause();
                        video.currentTime = 0;
                    }


                });