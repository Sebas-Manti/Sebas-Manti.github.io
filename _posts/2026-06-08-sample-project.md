---
layout: post-project
title: "Example: KPZ Numerical Simulation"
date: 2026-06-08
post_type: project
github_repo: "Sebas-Manti/kpz-simulation"
repo_description: "Finite difference schemes for the KPZ equation with space-time white noise"
repo_language: "Python / Julia"
excerpt: "A computational exploration of the KPZ equation — convergence of discretizations and scaling limits."
tags: [kpz, numerics, python]
---

This is a placeholder project post to show the format. Replace the `github_repo`, `repo_description`, and `repo_language` fields in the front matter with your actual repository details.

---

The **KPZ equation**

$$\partial_t h = \partial_x^2 h + (\partial_x h)^2 + \xi$$

is formally ill-posed: in dimension $d = 1$ the solution $h(t,\cdot)$ is only Hölder-$\frac{1}{2}^-$, so $\partial_x h$ is a distribution and the nonlinear term $(\partial_x h)^2$ does not make literal sense. Numerical discretizations handle this implicitly through a Wick-type subtraction.

This project explores several finite-difference schemes and their convergence to the Cole–Hopf solution.

**To add your own project post:** create a file in `_posts/` with `layout: post-project` and fill in the `github_repo` front matter field. The project card at the top is generated automatically.
