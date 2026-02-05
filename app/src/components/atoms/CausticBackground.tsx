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

// Fragment shader - caustic effect
const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_baseColor;
  uniform vec3 u_lightColor;
  uniform float u_intensity;

  // Simplex 3D noise implementation
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = v_uv;
    vec2 pos = uv * u_resolution;

    // Apply mouse parallax
    pos += u_mouse * 30.0;

    float t = u_time * 0.08;

    // Scale for sparse, sweeping patterns
    float scale1 = 0.003;
    float scale2 = 0.005;

    // Primary noise layers
    float n1 = snoise(vec3(pos * scale1, t));
    float n2 = snoise(vec3(pos * scale1 + 100.0, t * 0.7 + 50.0));

    // Secondary detail layer
    float n3 = snoise(vec3(pos * scale2 + 200.0, t * 1.0 + 100.0));

    // Large-scale brightness variation
    float largeVar = snoise(vec3(pos * 0.001, t * 0.25)) * 0.5 + 0.5;

    // Variable line thickness
    float thicknessVar = snoise(vec3(pos * 0.0015, t * 0.3 + 500.0)) * 0.5 + 0.5;
    float lineMult = 6.0 + thicknessVar * 6.0;

    // Create lines at zero-crossings (sparse contours)
    float thresh1 = abs(n1);
    float thresh2 = abs(n2);
    float thresh3 = abs(n3 - 0.1);

    // Primary flowing light bands
    float line1 = max(0.0, 1.0 - thresh1 * lineMult);
    float line2 = max(0.0, 1.0 - thresh2 * lineMult);
    float primary = max(line1, line2);

    // Secondary thin accent lines
    float secondary = max(0.0, 1.0 - thresh3 * (lineMult * 1.2)) * 0.5;

    // Bright convergence where lines cross
    float convergence = line1 * line2 * 2.5;

    // Combine
    float combined = primary * 0.7 + secondary * 0.2 + convergence * 0.25;

    // Apply large-scale variation
    float modulated = combined * (0.5 + largeVar * 0.6);

    // Contrast curve
    float caustic = pow(modulated, 0.65) * u_intensity * 1.6;
    caustic = min(1.0, caustic);

    // Subtle hue shift
    float hueShift = snoise(vec3(pos * 0.001, t * 0.2)) * 0.1;
    vec3 baseAdjusted = u_baseColor + vec3(-hueShift * 0.08, hueShift * 0.06, hueShift * 0.04);

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
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  const base = parseColor(baseColor);
  const light = parseColor(lightColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;
    gl.useProgram(program);

    // Create fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const baseColorLocation = gl.getUniformLocation(program, "u_baseColor");
    const lightColorLocation = gl.getUniformLocation(program, "u_lightColor");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * mouseInfluence * 2,
        y: (e.clientY / window.innerHeight - 0.5) * mouseInfluence * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    startTimeRef.current = performance.now();

    const render = () => {
      if (!gl || !program) return;

      // Smooth mouse interpolation
      smoothMouseRef.current.x +=
        (mouseRef.current.x - smoothMouseRef.current.x) * 0.05;
      smoothMouseRef.current.y +=
        (mouseRef.current.y - smoothMouseRef.current.y) * 0.05;

      const elapsed = prefersReducedMotion
        ? 0
        : (performance.now() - startTimeRef.current) * 0.001 * speed;

      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(
        mouseLocation,
        smoothMouseRef.current.x,
        -smoothMouseRef.current.y
      );
      gl.uniform3f(baseColorLocation, base[0], base[1], base[2]);
      gl.uniform3f(lightColorLocation, light[0], light[1], light[2]);
      gl.uniform1f(intensityLocation, intensity);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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
  );
}
