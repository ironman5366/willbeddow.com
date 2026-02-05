"use client";

import React, { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Voronoi distance for caustic cells
  vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                          dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  float voronoi(vec2 x, float time) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float md = 8.0;
    vec2 mg;

    for(int j = -1; j <= 1; j++) {
      for(int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        o = 0.5 + 0.5 * sin(time * 0.5 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if(d < md) {
          md = d;
          mg = g;
        }
      }
    }
    return md;
  }

  // Create caustic pattern by layering
  float caustic(vec2 uv, float time) {
    float c = 0.0;

    // Multiple layers of voronoi at different scales and speeds
    float v1 = voronoi(uv * 3.0, time * 0.8);
    float v2 = voronoi(uv * 5.0 + vec2(10.0), time * 1.1);
    float v3 = voronoi(uv * 8.0 + vec2(20.0), time * 0.6);

    // Combine with different weights
    c = v1 * 0.5 + v2 * 0.3 + v3 * 0.2;

    // Create bright caustic lines by inverting and sharpening
    c = 1.0 - c;
    c = pow(c, 2.5);

    // Add some noise for organic feel
    float n = snoise(uv * 4.0 + time * 0.2) * 0.15;
    c += n;

    return clamp(c, 0.0, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Correct aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvCorrected = vec2(uv.x * aspect, uv.y);

    // Mouse influence - subtle displacement
    vec2 mouseInfluence = (u_mouse - 0.5) * 0.3;
    uvCorrected += mouseInfluence * 0.5;

    // Time for animation
    float time = u_time;

    // Generate caustic pattern
    float c = caustic(uvCorrected, time);

    // Ocean color palette
    vec3 deepColor = vec3(0.157, 0.345, 0.263);   // #285943 - Deep emerald
    vec3 midColor = vec3(0.467, 0.686, 0.612);    // #77AF9C - Teal
    vec3 lightColor = vec3(0.843, 1.0, 0.945);    // #D7FFF1 - Sand/light
    vec3 brightColor = vec3(0.95, 1.0, 0.98);     // Bright caustic highlights

    // Create gradient base with depth
    float depthGradient = uv.y * 0.3 + 0.7;
    vec3 baseColor = mix(midColor, lightColor, depthGradient);

    // Add subtle wave movement to base
    float wave = sin(uv.x * 10.0 + time * 0.5) * 0.02;
    wave += sin(uv.x * 7.0 - time * 0.3) * 0.015;
    baseColor = mix(baseColor, lightColor, wave + 0.02);

    // Apply caustics
    vec3 causticColor = mix(baseColor, brightColor, c * 0.7);

    // Add subtle darker areas for depth
    float darkNoise = snoise(uvCorrected * 2.0 - time * 0.1) * 0.5 + 0.5;
    darkNoise = pow(darkNoise, 3.0);
    causticColor = mix(causticColor, midColor, darkNoise * 0.15);

    // Slight vignette for depth
    float vignette = 1.0 - length((uv - 0.5) * 0.8);
    vignette = smoothstep(0.2, 1.0, vignette);
    causticColor = mix(causticColor * 0.9, causticColor, vignette);

    gl_FragColor = vec4(causticColor, 1.0);
  }
`;

export default function CausticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    // Compile shaders
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Set up geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    // Handle resize
    function resize() {
      if (!canvas || !gl) return;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Handle mouse movement
    function handleMouseMove(e: MouseEvent) {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    }
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const startTime = performance.now();
    function render() {
      if (!gl || !program) return;

      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      const time = (performance.now() - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas!.width, canvas!.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    }
    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl && program) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
