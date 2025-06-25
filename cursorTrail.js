class RefinedMouseTrail {
            constructor() {
                this.cursor = document.querySelector('.cursor');
                this.glowEffect = document.querySelector('.glow-effect');
                this.outerGlow = document.querySelector('.outer-glow');
                this.trails = [];
                this.particles = [];
                this.sparkles = [];
                this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                this.lastMouse = { x: 0, y: 0 };
                this.trailLength = 12;
                this.sparkleCount = 0;
                
                this.init();
            }

            init() {
                // Create trail elements with enhanced styling
                for (let i = 0; i < this.trailLength; i++) {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-trail';
                    
                    const size = 20 - (i * 1.2);
                    const opacity = (1 - i / this.trailLength) * 0.8;
                    
                    trail.style.width = size + 'px';
                    trail.style.height = size + 'px';
                    trail.style.opacity = opacity;
                    trail.style.transform = `scale(${1 - i / this.trailLength * 0.3})`;
                    
                    document.body.appendChild(trail);
                    this.trails.push({
                        element: trail,
                        x: this.mouse.x,
                        y: this.mouse.y,
                        delay: i * 0.04
                    });
                }

                this.bindEvents();
                this.animate();
            }

            bindEvents() {
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                    
                    // Create enhanced particles
                    this.createParticle(e.clientX, e.clientY);
                    
                    // Occasionally create sparkles
                    if (Math.random() > 0.85) {
                        this.createSparkle(e.clientX, e.clientY);
                    }
                });

                document.addEventListener('mouseenter', () => {
                    this.cursor.style.opacity = '1';
                    this.glowEffect.style.opacity = '1';
                    this.outerGlow.style.opacity = '1';
                });

                document.addEventListener('mouseleave', () => {
                    this.cursor.style.opacity = '0';
                    this.glowEffect.style.opacity = '0';
                    this.outerGlow.style.opacity = '0';
                });
            }

            createParticle(x, y) {
                if (this.particles.length > 30) return;

                const particle = document.createElement('div');
                particle.className = 'trail-particle';
                
                const size = Math.random() * 6 + 4;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = x - size/2 + 'px';
                particle.style.top = y - size/2 + 'px';
                
                const offsetX = (Math.random() - 0.5) * 40;
                const offsetY = (Math.random() - 0.5) * 40;
                
                document.body.appendChild(particle);
                
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0)`;
                    particle.style.opacity = '0';
                });

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                    const index = this.particles.indexOf(particle);
                    if (index > -1) {
                        this.particles.splice(index, 1);
                    }
                }, 800);

                this.particles.push(particle);
            }

            createSparkle(x, y) {
                if (this.sparkles.length > 15) return;

                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                
                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 60;
                
                sparkle.style.left = (x + offsetX) + 'px';
                sparkle.style.top = (y + offsetY) + 'px';
                sparkle.style.animationDelay = Math.random() * 1 + 's';
                
                document.body.appendChild(sparkle);

                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                    const index = this.sparkles.indexOf(sparkle);
                    if (index > -1) {
                        this.sparkles.splice(index, 1);
                    }
                }, 1500);

                this.sparkles.push(sparkle);
            }

            animate() {
                // Enhanced cursor position with micro-smoothing
                const smoothX = this.mouse.x + (Math.sin(Date.now() * 0.001) * 0.5);
                const smoothY = this.mouse.y + (Math.cos(Date.now() * 0.001) * 0.5);
                
                this.cursor.style.left = (smoothX - 12) + 'px';
                this.cursor.style.top = (smoothY - 12) + 'px';

                // Enhanced glow effects with subtle movement
                this.glowEffect.style.left = smoothX + 'px';
                this.glowEffect.style.top = smoothY + 'px';
                
                this.outerGlow.style.left = (smoothX + Math.sin(Date.now() * 0.002) * 2) + 'px';
                this.outerGlow.style.top = (smoothY + Math.cos(Date.now() * 0.002) * 2) + 'px';

                // Enhanced trail animation with better easing
                this.trails.forEach((trail, index) => {
                    const targetX = index === 0 ? smoothX : this.trails[index - 1].x;
                    const targetY = index === 0 ? smoothY : this.trails[index - 1].y;
                    
                    const easing = 0.18 - (index * 0.01);
                    trail.x += (targetX - trail.x) * easing;
                    trail.y += (targetY - trail.y) * easing;
                    
                    const size = parseInt(trail.element.style.width);
                    trail.element.style.left = (trail.x - size/2) + 'px';
                    trail.element.style.top = (trail.y - size/2) + 'px';
                });

                // Enhanced cursor scaling with smoother transitions
                const speed = Math.sqrt(
                    Math.pow(this.mouse.x - this.lastMouse.x, 2) + 
                    Math.pow(this.mouse.y - this.lastMouse.y, 2)
                );
                
                const scale = Math.min(1 + speed * 0.015, 1.8);
                const glowScale = Math.min(1 + speed * 0.01, 1.5);
                
                this.cursor.style.transform = `scale(${scale})`;
                this.glowEffect.style.transform = `translate(-50%, -50%) scale(${glowScale})`;
                this.outerGlow.style.transform = `translate(-50%, -50%) scale(${glowScale * 0.8})`;
                
                this.lastMouse.x = this.mouse.x;
                this.lastMouse.y = this.mouse.y;

                requestAnimationFrame(() => this.animate());
            }
        }

        // Initialize when page loads
        window.addEventListener('load', () => {
            new RefinedMouseTrail();
        });

        // Enhanced initial state
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector('.cursor').style.opacity = '0';
            document.querySelector('.glow-effect').style.opacity = '0';
            document.querySelector('.outer-glow').style.opacity = '0';
        });