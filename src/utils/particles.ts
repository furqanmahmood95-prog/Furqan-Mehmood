export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type?: 'circle' | 'spark' | 'ring';
  maxRadius?: number;
  radius?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private width: number = 440;
  private height: number = 440;

  public init(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    this.resize(canvas.width, canvas.height);
    this.start();
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.particles = [];
    this.floatingTexts = [];
  }

  public spawnLineClear(cells: { x: number; y: number; color: string }[]) {
    cells.forEach(cell => {
      this.spawnCellExplosion(cell.x, cell.y, cell.color);
    });
  }

  public spawnCellExplosion(x: number, y: number, color: string) {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        color,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.02,
        type: Math.random() > 0.5 ? 'spark' : 'circle',
      });
    }

    // Expanding neon ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 1,
      radius: 4,
      maxRadius: 36,
      color,
      alpha: 0.9,
      decay: 0.04,
      type: 'ring',
    });
  }

  public spawnEmpWave(centerX: number, centerY: number) {
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40;
      const speed = Math.random() * 6 + 3;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: '#00f0ff',
        alpha: 1,
        decay: 0.025,
        type: 'spark',
      });
    }

    // Mega expanding ring
    this.particles.push({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      size: 3,
      radius: 10,
      maxRadius: 180,
      color: '#ff0055',
      alpha: 1,
      decay: 0.03,
      type: 'ring',
    });
  }

  public addFloatingText(text: string, x: number, y: number, color: string = '#00f0ff', size: number = 18) {
    this.floatingTexts.push({
      id: Math.random().toString(36).substring(2, 9),
      text,
      x,
      y,
      vy: -1.2,
      color,
      alpha: 1,
      decay: 0.018,
      size,
    });
  }

  private start() {
    const loop = () => {
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render & update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'ring') {
        p.radius = (p.radius || 0) + 2.5;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || (p.radius || 0) > (p.maxRadius || 30)) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius || 5, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // slight gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;

        this.ctx.beginPath();
        if (p.type === 'spark') {
          // Elongated spark
          const len = Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 2;
          this.ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }
    }

    // Render & update floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= ft.decay;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = `800 ${ft.size}px 'Orbitron', sans-serif`;
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = ft.color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }
  }
}
