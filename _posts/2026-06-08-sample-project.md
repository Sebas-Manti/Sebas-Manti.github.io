---
layout: post-project
title: "Parallel SPH Fluid Simulation — from Python to ARM NEON"
date: 2026-06-08
post_type: project
github_repo: "Sebas-Manti/HPC_Proyecto"
repo_description: "2D fluid simulation via Smoothed Particle Hydrodynamics with four progressive implementations — from pure Python to C++ SIMD, achieving a 4192× speedup"
repo_language: "Python · C++ · CMake"
excerpt: "Building the same fluid simulator four times, each time faster, until ARM NEON made it 4192× quicker than where we started."
tags: [simulation, hpc, fluid dynamics, c++, python]
---

This project started as a scientific computing assignment and became something I kept pushing further than required. The goal: simulate 2D fluid dynamics using **Smoothed Particle Hydrodynamics (SPH)** and make it fast; progressively, one implementation at a time.

## What is SPH?

SPH is a mesh-free method for simulating fluids. Instead of discretizing space onto a grid, you represent the fluid as a collection of particles, each carrying mass, velocity, pressure, and density. The key idea is that any quantity at a point can be estimated by a weighted average over nearby particles:

$$f(\mathbf{r}) \approx \sum_j \frac{m_j}{\rho_j} f(\mathbf{r}_j)\, W(\|\mathbf{r} - \mathbf{r}_j\|,\, h)$$

where $W$ is a smooth kernel with compact support $h$. The Navier–Stokes equations then reduce to sums over particle neighbors. Density, pressure, and viscous forces are all computed this way:

$$\rho_i = \sum_j m \cdot W(\|\mathbf{r}_i - \mathbf{r}_j\|, h)$$

$$\mathbf{F}_i^{\text{press}} = -m \sum_j \frac{p_i + p_j}{2\rho_j} \nabla W_{\text{spiky}}(\|\mathbf{r}_i - \mathbf{r}_j\|, h)$$

The method is elegant, but naive implementations scale as $O(N^2)$, every particle checks every other particle. That's where the interesting engineering starts.

## Four implementations, one simulation

The project builds the same dam-break scenario four times, each addressing a different bottleneck:

**1. Python naïve — $O(N^2)$**  
A double loop over all particle pairs. Clean reference implementation, unusably slow at scale: **62.9 s** for 450 particles over 100 steps.

**2. Python with spatial hashing — $O(N)$**  
Particles are bucketed into a uniform hash grid with cell size $2h$. Each particle only queries its $3 \times 3$ neighborhood — turning the neighbor search from $O(N)$ to $O(1)$ per particle. **4.5× faster** than naïve.

**3. C++ scalar with pybind11**  
The same logic rewritten in C++17 with a Structure of Arrays (SoA) layout for cache locality, exposed to Python as a zero-copy NumPy view via pybind11. **683× faster** than the Python naïve baseline.

**4. C++ with ARM NEON SIMD**  
The inner density loop processes 4 particles simultaneously using 128-bit NEON registers (`float32x4_t`). The horizontal reduction at the end collapses the 4-lane accumulator into a single density value. Result: **4192× faster** than where we started.

| Implementation | Time (100 steps, 450p) | Speedup |
|---|---|---|
| Python naïve | 62.9 s | 1× |
| Python hashed | 14.0 s | 4.5× |
| C++ scalar | 0.09 s | 683× |
| C++ NEON | 0.015 s | **4192×** |

## What I learned

The jump from Python to C++ scalar (683×) is mostly about eliminating interpreter overhead and improving memory access patterns. The jump from scalar to NEON (6× additional) is about actually using the hardware, the M3 can process 4 floats per cycle, and the scalar code was leaving that on the table.

The part that surprised me most was how much the SoA layout mattered before any SIMD. Storing all $x$-coordinates contiguously, all $y$-coordinates contiguously, and so on — rather than as structs of $(x, y, \rho, p, \ldots)$ per particle — made the cache behavior dramatically better even without any vectorization.

The code, benchmarks, and a final report are all in the repository.
