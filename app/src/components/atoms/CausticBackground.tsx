"use client";

import React, { useRef, useEffect } from "react";

interface CausticBackgroundProps {
  baseColor: string;
  lightColor: string;
  intensity?: number;
  speed?: number;
  mouseInfluence?: number;
}

// Vertex shader - simple fullscreen quad
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - caustic effect with organic distorted Voronoi
const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_baseColor;
  uniform vec3 u_lightColor;
  uniform float u_intensity;

  // Mouse trail - up to 32 points with position, age, and velocity
  uniform vec4 u_trail[32];     // xy = position, z = age (0-1), w = strength
  uniform vec2 u_trailVel[32];  // velocity at each point for swirl direction
  uniform int u_trailCount;

  // Hash functions
  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Simple 2D noise for distortion
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal noise for organic distortion
  float fbm(vec2 p, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);

    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(p + time * 0.1);
      p = p * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  // Voronoi with distorted edges
  vec2 voronoi(vec2 p, float time, float distortAmount) {
    // Apply organic distortion to input coordinates
    vec2 distort = vec2(
      fbm(p * 0.5 + time * 0.2, time),
      fbm(p * 0.5 + 50.0 + time * 0.15, time + 10.0)
    );
    p += (distort - 0.5) * distortAmount;

    vec2 n = floor(p);
    vec2 f = fract(p);

    // First pass: find closest cell center
    float minDist = 8.0;
    vec2 minPoint = vec2(0.0);
    vec2 minCell = vec2(0.0);

    for(int j = -1; j <= 1; j++) {
      for(int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 cellId = n + g;
        vec2 o = hash22(cellId);
        // Animate with varied speeds per cell
        float speed = 0.3 + hash21(cellId) * 0.4;
        o = 0.5 + 0.45 * sin(time * speed + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);

        if(d < minDist) {
          minDist = d;
          minPoint = r;
          minCell = cellId;
        }
      }
    }

    // Second pass: find distance to nearest edge with smoothing
    float edgeDist = 8.0;
    for(int j = -2; j <= 2; j++) {
      for(int i = -2; i <= 2; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 cellId = n + g;
        vec2 o = hash22(cellId);
        float speed = 0.3 + hash21(cellId) * 0.4;
        o = 0.5 + 0.45 * sin(time * speed + 6.2831 * o);
        vec2 r = g + o - f;

        if(dot(minPoint - r, minPoint - r) > 0.00001) {
          // Smooth edge distance calculation
          vec2 midpoint = 0.5 * (minPoint + r);
          vec2 diff = r - minPoint;
          float len = length(diff);
          if(len > 0.001) {
            vec2 edgeDir = diff / len;
            float d = abs(dot(midpoint, edgeDir));
            edgeDist = min(edgeDist, d);
          }
        }
      }
    }

    return vec2(edgeDist, sqrt(minDist));
  }

  void main() {
    vec2 uv = v_uv;
    vec2 pos = uv * u_resolution;

    // Simple push-away distortion from mouse trail
    // Like dragging a stick through water - just displaces, no fancy swirls
    vec2 totalDistort = vec2(0.0);

    for(int i = 0; i < 32; i++) {
      if(i >= u_trailCount) break;

      vec2 trailPos = u_trail[i].xy;
      float age = u_trail[i].z;
      float strength = u_trail[i].w;

      vec2 toPixel = pos - trailPos;
      float dist = length(toPixel);

      // Radius starts small, expands as it ages (ripple spreading out)
      float radius = 50.0 + age * 120.0;

      // Strength fades with age squared for lazy drift back
      float fade = (1.0 - age * age) * strength;

      if(dist < radius && fade > 0.001) {
        // Soft falloff from center
        float falloff = 1.0 - smoothstep(0.0, radius, dist);
        float effect = falloff * fade;

        // Just push outward - simple displacement
        vec2 pushDir = dist > 0.5 ? normalize(toPixel) : vec2(0.0);

        // Push strength decreases toward edge of influence
        float pushAmount = effect * 18.0 * falloff;

        totalDistort += pushDir * pushAmount;
      }
    }

    pos += totalDistort;

    float t = u_time * 1.0;

    // Variable line thickness based on position
    float thicknessNoise = fbm(pos * 0.003, t * 0.5);

    // Two Voronoi layers - back to original cell sizes
    vec2 v1 = voronoi(pos * 0.009, t, 1.5);
    vec2 v2 = voronoi(pos * 0.006 + 200.0, t * 0.8 + 50.0, 1.6);

    // Random variation along the lines - some fade out, some are strong
    float lineNoise1 = fbm(pos * 0.015 + t * 0.3, t * 0.2);
    float lineNoise2 = fbm(pos * 0.008 + 100.0, t * 0.15);

    // Cell merge noise - at low-frequency, removes edges to make some cells appear merged
    // This creates larger apparent cells without adding another layer
    float mergeNoise = fbm(pos * 0.004, t * 0.08);
    float mergeMask1 = smoothstep(0.4, 0.7, mergeNoise); // Even more edges removed = sparser
    float mergeMask2 = smoothstep(0.45, 0.75, mergeNoise + fbm(pos * 0.003 + 300.0, t * 0.06) * 0.3);

    // Line break/fade variation - less aggressive fading
    float lineBreak1 = smoothstep(0.15, 0.4, lineNoise1);
    float lineBreak2 = smoothstep(0.2, 0.45, lineNoise2);

    // Line widths
    float lineWidth1 = 0.05 + thicknessNoise * 0.035 + lineNoise1 * 0.015;
    float lineWidth2 = 0.07 + thicknessNoise * 0.04 + lineNoise2 * 0.02;

    // Edge detection with varying softness
    float edge1 = smoothstep(lineWidth1, lineWidth1 * 0.2, v1.x);
    float edge2 = smoothstep(lineWidth2, lineWidth2 * 0.3, v2.x);

    // Apply line breaks AND merge mask - some edges disappear entirely
    edge1 *= lineBreak1 * mergeMask1;
    edge2 *= lineBreak2 * mergeMask2;

    // Combine layers
    float edges = edge1 * 0.55 + edge2 * 0.35;

    // Strong bright spots where edges converge
    // Use distance to cell center (v1.y, v2.y) to find convergence points
    float convergence1 = 1.0 - smoothstep(0.0, 0.4, v1.y);
    float convergence2 = 1.0 - smoothstep(0.0, 0.5, v2.y);

    // Bright spots happen where edges meet AND we're near cell vertices
    float brightSpots = edge1 * convergence1 * 3.0;
    brightSpots += edge1 * edge2 * 2.5;
    brightSpots += pow(edge1, 2.0) * convergence1 * 4.0;

    // Extra glow at random hot spots
    float hotSpot = pow(convergence1 * convergence2, 0.8) * 2.0;

    // Large-scale brightness variation
    float largeVar = fbm(pos * 0.001, t * 0.3) * 0.35 + 0.65;

    // Combine everything - edges plus bright spots
    float combined = (edges + brightSpots * 0.4 + hotSpot * 0.3) * largeVar;

    // Soft contrast curve
    float caustic = pow(combined, 0.75) * u_intensity * 1.6;
    caustic = min(1.0, caustic);

    // Subtle hue variation
    float hueVar = fbm(pos * 0.0008, t * 0.15) * 0.08;
    vec3 baseAdjusted = u_baseColor + vec3(-hueVar * 0.1, hueVar * 0.06, hueVar * 0.04);

    // Mix colors
    vec3 color = mix(baseAdjusted, u_lightColor, caustic);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function parseColor(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function CausticBackground({
  baseColor,
  lightColor,
  intensity = 0.4,
  speed = 1,
  mouseInfluence = 0.15,
}: CausticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const lastTrailTimeRef = useRef<number>(0);
  // Trail: array of {x, y, age, strength, vx, vy}
  const trailRef = useRef<Array<{ x: number; y: number; age: number; strength: number; vx: number; vy: number }>>([]);

  const base = parseColor(baseColor);
  const light = parseColor(lightColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glowCanvas = glowCanvasRef.current;
    if (!canvas || !glowCanvas) return;

    // Setup main canvas
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Setup glow canvas (same WebGL context setup)
    const glGlow = glowCanvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!glGlow) {
      console.error("WebGL not supported for glow canvas");
      return;
    }

    glRef.current = gl;

    // Helper to setup a WebGL program
    const setupProgram = (glCtx: WebGLRenderingContext) => {
      const vertexShader = createShader(glCtx, glCtx.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(glCtx, glCtx.FRAGMENT_SHADER, fragmentShaderSource);
      if (!vertexShader || !fragmentShader) return null;

      const program = createProgram(glCtx, vertexShader, fragmentShader);
      if (!program) return null;

      glCtx.useProgram(program);

      const positionBuffer = glCtx.createBuffer();
      glCtx.bindBuffer(glCtx.ARRAY_BUFFER, positionBuffer);
      glCtx.bufferData(
        glCtx.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        glCtx.STATIC_DRAW
      );

      const positionLocation = glCtx.getAttribLocation(program, "a_position");
      glCtx.enableVertexAttribArray(positionLocation);
      glCtx.vertexAttribPointer(positionLocation, 2, glCtx.FLOAT, false, 0, 0);

      return {
        program,
        timeLocation: glCtx.getUniformLocation(program, "u_time"),
        resolutionLocation: glCtx.getUniformLocation(program, "u_resolution"),
        baseColorLocation: glCtx.getUniformLocation(program, "u_baseColor"),
        lightColorLocation: glCtx.getUniformLocation(program, "u_lightColor"),
        intensityLocation: glCtx.getUniformLocation(program, "u_intensity"),
        trailLocation: glCtx.getUniformLocation(program, "u_trail"),
        trailVelLocation: glCtx.getUniformLocation(program, "u_trailVel"),
        trailCountLocation: glCtx.getUniformLocation(program, "u_trailCount"),
      };
    };

    const mainProgram = setupProgram(gl);
    const glowProgram = setupProgram(glGlow);

    if (!mainProgram || !glowProgram) return;

    programRef.current = mainProgram.program;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Main canvas at full resolution
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Glow canvas at lower resolution for performance (blur will hide it anyway)
      const glowScale = 0.5;
      glowCanvas.width = width * dpr * glowScale;
      glowCanvas.height = height * dpr * glowScale;
      glowCanvas.style.width = `${width}px`;
      glowCanvas.style.height = `${height}px`;
      glGlow.viewport(0, 0, glowCanvas.width, glowCanvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking - store actual pixel position and add to trail
    const handleMouseMove = (e: MouseEvent) => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Get position relative to canvas, scaled by DPR
      const newX = (e.clientX - rect.left) * dpr;
      const newY = (e.clientY - rect.top) * dpr;

      // Calculate velocity
      const vx = newX - mouseRef.current.x;
      const vy = newY - mouseRef.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      mouseRef.current = { x: newX, y: newY };

      // Add trail point if moving fast enough and enough time has passed
      const now = performance.now();
      if (speed > 3 && now - lastTrailTimeRef.current > 20) {
        lastTrailTimeRef.current = now;

        // Strength based on speed
        const strength = Math.min(1.0, speed / 25);

        trailRef.current.push({
          x: newX,
          y: newY,
          age: 0,
          strength,
          vx,
          vy,
        });

        // Keep max 32 trail points
        if (trailRef.current.length > 32) {
          trailRef.current.shift();
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    startTimeRef.current = performance.now();

    const render = () => {
      if (!gl || !mainProgram.program || !glGlow || !glowProgram.program) return;

      const elapsed = prefersReducedMotion
        ? 0
        : (performance.now() - startTimeRef.current) * 0.001 * speed;

      // Age trail points and remove old ones
      const ageRate = 0.012 * mouseInfluence; // How fast disturbances fade
      trailRef.current = trailRef.current.filter((point) => {
        point.age += ageRate;
        return point.age < 1.0;
      });

      // Prepare trail data for shader
      const trailData = new Float32Array(32 * 4); // vec4 array
      const trailVelData = new Float32Array(32 * 2); // vec2 array
      const trail = trailRef.current;

      for (let i = 0; i < Math.min(trail.length, 32); i++) {
        const p = trail[i];
        trailData[i * 4 + 0] = p.x;
        trailData[i * 4 + 1] = canvas.height - p.y; // Flip Y
        trailData[i * 4 + 2] = p.age;
        trailData[i * 4 + 3] = p.strength;
        trailVelData[i * 2 + 0] = p.vx;
        trailVelData[i * 2 + 1] = -p.vy; // Flip Y
      }

      // Render main canvas
      gl.useProgram(mainProgram.program);
      gl.uniform1f(mainProgram.timeLocation, elapsed);
      gl.uniform2f(mainProgram.resolutionLocation, canvas.width, canvas.height);
      gl.uniform3f(mainProgram.baseColorLocation, base[0], base[1], base[2]);
      gl.uniform3f(mainProgram.lightColorLocation, light[0], light[1], light[2]);
      gl.uniform1f(mainProgram.intensityLocation, intensity);
      gl.uniform4fv(mainProgram.trailLocation, trailData);
      gl.uniform2fv(mainProgram.trailVelLocation, trailVelData);
      gl.uniform1i(mainProgram.trailCountLocation, Math.min(trail.length, 32));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Render glow canvas (same effect, will be blurred via CSS)
      const glowScale = 0.5;

      // Scale trail data for glow canvas
      const glowTrailData = new Float32Array(32 * 4);
      for (let i = 0; i < Math.min(trail.length, 32); i++) {
        const p = trail[i];
        glowTrailData[i * 4 + 0] = p.x * glowScale;
        glowTrailData[i * 4 + 1] = glowCanvas.height - p.y * glowScale;
        glowTrailData[i * 4 + 2] = p.age;
        glowTrailData[i * 4 + 3] = p.strength;
      }

      glGlow.useProgram(glowProgram.program);
      glGlow.uniform1f(glowProgram.timeLocation, elapsed);
      glGlow.uniform2f(glowProgram.resolutionLocation, glowCanvas.width, glowCanvas.height);
      glGlow.uniform3f(glowProgram.baseColorLocation, base[0], base[1], base[2]);
      glGlow.uniform3f(glowProgram.lightColorLocation, light[0], light[1], light[2]);
      glGlow.uniform1f(glowProgram.intensityLocation, intensity * 1.2);
      glGlow.uniform4fv(glowProgram.trailLocation, glowTrailData);
      glGlow.uniform2fv(glowProgram.trailVelLocation, trailVelData);
      glGlow.uniform1i(glowProgram.trailCountLocation, Math.min(trail.length, 32));
      glGlow.drawArrays(glGlow.TRIANGLE_STRIP, 0, 4);

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [base, light, intensity, speed, mouseInfluence]);

  return (
    <>
      {/* Main sharp caustic layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Blurred glow layer on top */}
      <canvas
        ref={glowCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          filter: "blur(30px)",
          opacity: 0.7,
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
