 let currentSection = 0;
        let isTransitioning = false;
        let currentShoe = 0;
        let isChangingShoe = false;
        let scrollTimeout = null;
        let touchStartY = 0;

        const sections = ['home', 'collection', 'editorial', 'contact'];
        const shoes = [
            { 
                name: 'PERSA CLÁSICO', 
                color: 'Gamuza Vino Tinto', 
                price: '$450.000',
                image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80'
            },
            { 
                name: 'PERSA MINIMAL', 
                color: 'Cuero Marfil', 
                price: '$420.000',
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'
            },
            { 
                name: 'PERSA MODERNO', 
                color: 'Lona Carbón', 
                price: '$380.000',
                image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
            }
        ];

        // Navegación CON overlay (para botones del NAV)
        function navigateToSectionWithOverlay(index) {
            if (isTransitioning || index === currentSection) return;
            
            isTransitioning = true;
            const overlay = document.querySelector('.transition-overlay');
            overlay.classList.add('active');
            
            setTimeout(() => {
                currentSection = index;
                const container = document.querySelector('.sections-container');
                container.style.transform = `translateY(-${currentSection * 100}vh)`;
                
                setTimeout(() => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 300);
                }, 800);
            }, 500);
        }

        // Navegación SIN overlay (para scroll)
        function navigateToSectionSmooth(index) {
            if (isTransitioning || index === currentSection) return;
            
            isTransitioning = true;
            currentSection = index;
            
            const container = document.querySelector('.sections-container');
            container.style.transform = `translateY(-${currentSection * 100}vh)`;
            
            // Duración debe coincidir con la transición CSS (1.2s)
            setTimeout(() => {
                isTransitioning = false;
            }, 1200);
        }

        // Cambio de zapato con animación lateral elegante (SIN overlay)
        function changeShoe(direction) {
            if (isChangingShoe) return;
            
            isChangingShoe = true;
            
            // Deshabilitar botones durante la animación
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            
            const shoeImage = document.querySelector('.shoe-image-placeholder');
            const shoeInfo = document.querySelector('.shoe-info');
            
            // Fade out de la información
            shoeInfo.classList.add('fade-out');
            
            // Determinar dirección de salida
            if (direction === 'next') {
                shoeImage.classList.add('slide-out-left');
            } else {
                shoeImage.classList.add('slide-out-right');
            }
            
            setTimeout(() => {
                // Actualizar índice
                if (direction === 'next') {
                    currentShoe = (currentShoe + 1) % shoes.length;
                } else {
                    currentShoe = currentShoe === 0 ? shoes.length - 1 : currentShoe - 1;
                }
                
                // Actualizar contenido
                updateShoeDisplay();
                
                // Remover clases de salida
                shoeImage.classList.remove('slide-out-left', 'slide-out-right');
                
                // Agregar clases de entrada (opuestas a la dirección)
                if (direction === 'next') {
                    shoeImage.classList.add('slide-in-right');
                } else {
                    shoeImage.classList.add('slide-in-left');
                }
                
                // Resetear posición inmediatamente
                setTimeout(() => {
                    shoeImage.classList.remove('slide-in-left', 'slide-in-right');
                    shoeInfo.classList.remove('fade-out');
                    
                    // Rehabilitar botones
                    prevBtn.disabled = false;
                    nextBtn.disabled = false;
                    
                    setTimeout(() => {
                        isChangingShoe = false;
                    }, 100);
                }, 50);
            }, 800);
        }

        function updateShoeDisplay() {
            const shoeImage = document.querySelector('.shoe-image-placeholder');
            document.getElementById('shoeName').textContent = shoes[currentShoe].name;
            document.getElementById('shoeColor').textContent = shoes[currentShoe].color;
            document.getElementById('shoePrice').textContent = shoes[currentShoe].price;
            shoeImage.style.backgroundImage = `url('${shoes[currentShoe].image}')`;
        }

        // Mobile Menu
        function toggleMenu() {
            const menu = document.querySelector('.mobile-menu');
            const btn = document.querySelector('.mobile-menu-btn');
            menu.classList.toggle('active');
            btn.classList.toggle('active');
        }

        // Scroll Control (sin overlay)
        function handleWheel(e) {
            e.preventDefault();
            
            if (isTransitioning) return;
            
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                if (e.deltaY > 0 && currentSection < sections.length - 1) {
                    navigateToSectionSmooth(currentSection + 1);
                } else if (e.deltaY < 0 && currentSection > 0) {
                    navigateToSectionSmooth(currentSection - 1);
                }
            }, 50);
        }

        function handleTouchStart(e) {
            touchStartY = e.touches[0].clientY;
        }

        function handleTouchEnd(e) {
            if (isTransitioning) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentSection < sections.length - 1) {
                    navigateToSectionSmooth(currentSection + 1);
                } else if (diff < 0 && currentSection > 0) {
                    navigateToSectionSmooth(currentSection - 1);
                }
            }
        }

        // Event Listeners
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Prevent default scroll behavior
        document.body.style.overflow = 'hidden';
        
        // Initialize
        window.addEventListener('DOMContentLoaded', () => {
            const container = document.querySelector('.sections-container');
            container.style.transform = 'translateY(0)';
            currentSection = 0;
            updateShoeDisplay();
        });