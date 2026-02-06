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

// Fragment shader - caustics via iterative domain-warped simplex noise
// Based on technique from shadertoy.com/view/3d3yRj
const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_baseColor;
  uniform vec3 u_lightColor;
  uniform float u_intensity;

  // Mouse trail
  uniform vec4 u_trail[32];
  uniform int u_trailCount;

  //
  // 3D Simplex noise with gradient (returns vec4: xyz=gradient, w=value)
  // Based on Ashima Arts implementation
  //
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  vec4 snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix contributions from the four corners
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    vec4 m2 = m * m;
    vec4 m4 = m2 * m2;

    // Gradient computation
    vec3 grad =
      -8.0 * (m2.x * m.x * x0 * dot(x0, p0) + m2.y * m.y * x1 * dot(x1, p1) +
              m2.z * m.z * x2 * dot(x2, p2) + m2.w * m.w * x3 * dot(x3, p3));
    grad += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3;
    grad *= 42.0;

    float value = 42.0 * dot(m4, vec4(dot(x0,p0), dot(x1,p1), dot(x2,p2), dot(x3,p3)));

    return vec4(grad, value);
  }

  // Caustic pattern using iterative domain warping
  // Sample noise -> offset by gradient -> repeat
  // This naturally creates the bright convergent bands of caustics
  float waterCaustic(vec3 pos) {
    vec4 n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);

    return n.w;
  }

  // Simple 2D noise for large-scale variation
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise2d(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 4; i++) {
      v += a * noise2d(p);
      p = p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 pos = uv * u_resolution;

    // Mouse trail distortion
    vec2 totalDistort = vec2(0.0);

    for(int i = 0; i < 32; i++) {
      if(i >= u_trailCount) break;

      vec2 trailPos = u_trail[i].xy;
      float age = u_trail[i].z;
      float strength = u_trail[i].w;

      vec2 toPixel = pos - trailPos;
      float dist = length(toPixel);

      float radius = 50.0 + age * 120.0;
      float fade = (1.0 - age * age) * strength;

      if(dist < radius && fade > 0.001) {
        float falloff = 1.0 - smoothstep(0.0, radius, dist);
        float effect = falloff * fade;
        vec2 pushDir = dist > 0.5 ? normalize(toPixel) : vec2(0.0);
        float pushAmount = effect * 18.0 * falloff;
        totalDistort += pushDir * pushAmount;
      }
    }

    pos += totalDistort;

    float t = u_time;

    // Convert to caustic space - 3D position with time as Y axis
    // Scale controls cell size, time speed controls animation rate
    vec3 causticPos = vec3(pos * 0.004, t * 0.35);

    // Two layers at different scales for complexity
    float w1 = waterCaustic(causticPos * 1.6);
    float w2 = waterCaustic(causticPos * 1.2 + vec3(5.0, 0.0, 8.0));
    float w = mix(w1, w2, 0.5);

    // Map noise to brightness
    // w is in roughly [-1, 1] from simplex noise after domain warping
    // Direct mapping: shift and scale to get good contrast
    float brightness = w * 0.5 + 0.5; // map to [0, 1]

    // Apply contrast curve to push darks darker and brights brighter
    brightness = smoothstep(0.15, 0.75, brightness);
    brightness *= u_intensity * 1.3;

    // Large-scale variation
    float largeVar = fbm(pos * 0.0005 + t * 0.02) * 0.15 + 0.92;
    brightness *= largeVar;

    // Color mixing
    float hueVar = fbm(pos * 0.0004 + t * 0.01) * 0.06;
    vec3 darkColor = u_baseColor * (0.88 + hueVar * 0.2);
    vec3 color = mix(darkColor, u_lightColor, brightness);

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
  const lastTrailTimeRef = useRef<number>(0);
  const trailRef = useRef<Array<{ x: number; y: number; age: number; strength: number }>>([]);

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

      // Calculate speed
      const dx = newX - mouseRef.current.x;
      const dy = newY - mouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current = { x: newX, y: newY };

      // Add trail point if moving fast enough and enough time has passed
      const now = performance.now();
      if (speed > 3 && now - lastTrailTimeRef.current > 20) {
        lastTrailTimeRef.current = now;

        const strength = Math.min(1.0, speed / 25);

        trailRef.current.push({
          x: newX,
          y: newY,
          age: 0,
          strength,
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
      const trailData = new Float32Array(32 * 4);
      const trail = trailRef.current;

      for (let i = 0; i < Math.min(trail.length, 32); i++) {
        const p = trail[i];
        trailData[i * 4 + 0] = p.x;
        trailData[i * 4 + 1] = canvas.height - p.y; // Flip Y
        trailData[i * 4 + 2] = p.age;
        trailData[i * 4 + 3] = p.strength;
      }

      // Render main canvas
      gl.useProgram(mainProgram.program);
      gl.uniform1f(mainProgram.timeLocation, elapsed);
      gl.uniform2f(mainProgram.resolutionLocation, canvas.width, canvas.height);
      gl.uniform3f(mainProgram.baseColorLocation, base[0], base[1], base[2]);
      gl.uniform3f(mainProgram.lightColorLocation, light[0], light[1], light[2]);
      gl.uniform1f(mainProgram.intensityLocation, intensity);
      gl.uniform4fv(mainProgram.trailLocation, trailData);
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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Blurred glow layer on top */}
      <canvas
        ref={glowCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
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
