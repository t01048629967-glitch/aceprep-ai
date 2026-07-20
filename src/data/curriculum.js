// Subject + unit/topic structure.
// This file is just the "table of contents" — actual concept explanations
// are AI-generated on demand and cached in Firestore (see /api/concepts).
// Add new subjects here by adding a new top-level key.

export const curriculum = {
  "algebra-1": {
    title: "Algebra 1",
    units: [
      {
        unit: "Unit 1: Foundations",
        topics: [
          { slug: "variables-expressions", title: "Variables and Expressions" },
          { slug: "order-of-operations", title: "Order of Operations" },
          { slug: "solving-linear-equations", title: "Solving Linear Equations" },
          { slug: "solving-inequalities", title: "Solving and Graphing Inequalities" },
        ],
      },
      {
        unit: "Unit 2: Linear Functions and Graphing",
        topics: [
          { slug: "slope", title: "Slope of a Line" },
          { slug: "slope-intercept-form", title: "Slope-Intercept Form" },
          { slug: "graphing-lines", title: "Graphing Linear Equations" },
          { slug: "writing-equations-of-lines", title: "Writing Equations of Lines" },
          { slug: "function-notation", title: "Function Notation and Evaluating Functions" },
        ],
      },
      {
        unit: "Unit 3: Systems of Equations and Inequalities",
        topics: [
          { slug: "systems-substitution", title: "Solving Systems by Substitution" },
          { slug: "systems-elimination", title: "Solving Systems by Elimination" },
          { slug: "systems-graphing", title: "Solving Systems by Graphing" },
          { slug: "systems-of-inequalities", title: "Systems of Inequalities" },
        ],
      },
      {
        unit: "Unit 4: Exponents and Polynomials",
        topics: [
          { slug: "laws-of-exponents", title: "Laws of Exponents" },
          { slug: "adding-subtracting-polynomials", title: "Adding and Subtracting Polynomials" },
          { slug: "multiplying-polynomials", title: "Multiplying Polynomials" },
          { slug: "factoring-basics", title: "Factoring Polynomials" },
        ],
      },
      {
        unit: "Unit 5: Quadratic Functions",
        topics: [
          { slug: "graphing-quadratics", title: "Graphing Quadratic Functions" },
          { slug: "solving-by-factoring", title: "Solving Quadratics by Factoring" },
          { slug: "quadratic-formula", title: "The Quadratic Formula" },
          { slug: "completing-the-square", title: "Completing the Square" },
        ],
      },
      {
        unit: "Unit 6: Radicals and Exponential Basics",
        topics: [
          { slug: "simplifying-radicals", title: "Simplifying Radical Expressions" },
          { slug: "rational-expressions-intro", title: "Intro to Rational Expressions" },
          { slug: "exponential-functions-intro", title: "Intro to Exponential Functions" },
        ],
      },
    ],
  },

  "algebra-2": {
    title: "Algebra 2",
    units: [
      {
        unit: "Unit 1: Equations, Inequalities, and Functions Review",
        topics: [
          { slug: "solving-equations-review", title: "Solving Equations Review" },
          { slug: "absolute-value-equations", title: "Absolute Value Equations and Inequalities" },
        ],
      },
      {
        unit: "Unit 2: Functions and Graphs",
        topics: [
          { slug: "function-transformations-a2", title: "Function Transformations" },
          { slug: "domain-and-range", title: "Domain and Range" },
          { slug: "piecewise-functions", title: "Piecewise Functions" },
          { slug: "inverse-functions-a2", title: "Inverse Functions" },
        ],
      },
      {
        unit: "Unit 3: Polynomial Functions",
        topics: [
          { slug: "dividing-polynomials", title: "Dividing Polynomials (Long and Synthetic Division)" },
          { slug: "remainder-factor-theorem", title: "Remainder Theorem and Factor Theorem" },
          { slug: "graphing-polynomials", title: "Graphing Polynomial Functions" },
          { slug: "finding-zeros", title: "Finding Zeros of Polynomial Functions" },
        ],
      },
      {
        unit: "Unit 4: Rational and Radical Functions",
        topics: [
          { slug: "simplifying-rational-expressions", title: "Simplifying Rational Expressions" },
          { slug: "solving-rational-equations", title: "Solving Rational Equations" },
          { slug: "radical-functions", title: "Radical Functions and Equations" },
        ],
      },
      {
        unit: "Unit 5: Exponential and Logarithmic Functions",
        topics: [
          { slug: "exponential-growth-decay-a2", title: "Exponential Growth and Decay" },
          { slug: "logarithms-intro", title: "Introduction to Logarithms" },
          { slug: "log-properties-a2", title: "Properties of Logarithms" },
          { slug: "solving-exponential-log-equations", title: "Solving Exponential and Logarithmic Equations" },
        ],
      },
      {
        unit: "Unit 6: Sequences and Series",
        topics: [
          { slug: "arithmetic-sequences", title: "Arithmetic Sequences and Series" },
          { slug: "geometric-sequences", title: "Geometric Sequences and Series" },
        ],
      },
      {
        unit: "Unit 7: Intro to Trigonometry",
        topics: [
          { slug: "right-triangle-trig", title: "Right Triangle Trigonometry" },
          { slug: "unit-circle-a2", title: "Intro to the Unit Circle" },
        ],
      },
      {
        unit: "Unit 8: Probability and Statistics Basics",
        topics: [
          { slug: "probability-basics", title: "Basic Probability" },
          { slug: "data-distributions-a2", title: "Data Distributions and Summary Statistics" },
        ],
      },
    ],
  },

  "ap-precalc": {
    title: "AP Precalculus",
    units: [
      {
        unit: "Unit 1: Polynomial and Rational Functions",
        topics: [
          { slug: "polynomial-functions", title: "Polynomial Functions and End Behavior" },
          { slug: "rational-functions", title: "Rational Functions and Asymptotes" },
          { slug: "function-transformations", title: "Function Transformations" },
          { slug: "inverse-functions", title: "Inverse Functions" },
        ],
      },
      {
        unit: "Unit 2: Exponential and Logarithmic Functions",
        topics: [
          { slug: "exponential-functions", title: "Exponential Growth and Decay" },
          { slug: "logarithmic-functions", title: "Logarithmic Functions" },
          { slug: "log-properties", title: "Properties of Logarithms" },
        ],
      },
      {
        unit: "Unit 3: Trigonometric and Polar Functions",
        topics: [
          { slug: "unit-circle", title: "The Unit Circle and Radian Measure" },
          { slug: "trig-functions", title: "Trigonometric Functions and Graphs" },
          { slug: "trig-identities", title: "Trigonometric Identities" },
          { slug: "polar-coordinates", title: "Polar Coordinates" },
        ],
      },
    ],
  },

  "ap-calc-bc": {
    title: "AP Calculus BC",
    units: [
      {
        unit: "Unit 1: Limits and Continuity",
        topics: [
          { slug: "intro-limits", title: "Introduction to Limits" },
          { slug: "limit-laws", title: "Limit Laws and Techniques" },
          { slug: "continuity", title: "Continuity" },
          { slug: "ivt", title: "Intermediate Value Theorem" },
        ],
      },
      {
        unit: "Unit 2: Differentiation - Basic Rules",
        topics: [
          { slug: "derivative-definition", title: "Definition of the Derivative" },
          { slug: "power-rule", title: "Power Rule and Basic Derivative Rules" },
          { slug: "product-quotient-rule", title: "Product Rule and Quotient Rule" },
          { slug: "chain-rule", title: "Chain Rule" },
        ],
      },
      {
        unit: "Unit 3: Differentiation - Composite, Implicit, Inverse",
        topics: [
          { slug: "implicit-differentiation", title: "Implicit Differentiation" },
          { slug: "inverse-derivatives", title: "Derivatives of Inverse Functions" },
          { slug: "related-rates", title: "Related Rates" },
        ],
      },
      {
        unit: "Unit 4: Contextual Applications of Differentiation",
        topics: [
          { slug: "motion-derivatives", title: "Position, Velocity, Acceleration" },
          { slug: "lhopital", title: "L'Hôpital's Rule" },
        ],
      },
      {
        unit: "Unit 5: Analytical Applications of Differentiation",
        topics: [
          { slug: "mvt", title: "Mean Value Theorem" },
          { slug: "extrema", title: "Finding Extrema and Critical Points" },
          { slug: "concavity", title: "Concavity and Inflection Points" },
          { slug: "optimization", title: "Optimization Problems" },
        ],
      },
      {
        unit: "Unit 6: Integration and Accumulation of Change",
        topics: [
          { slug: "riemann-sums", title: "Riemann Sums and Definite Integrals" },
          { slug: "ftc", title: "Fundamental Theorem of Calculus" },
          { slug: "antiderivatives", title: "Antiderivatives and Indefinite Integrals" },
          { slug: "u-substitution", title: "U-Substitution" },
        ],
      },
      {
        unit: "Unit 7: Differential Equations",
        topics: [
          { slug: "diff-eq-intro", title: "Introduction to Differential Equations" },
          { slug: "slope-fields", title: "Slope Fields" },
          { slug: "separation-variables", title: "Separation of Variables" },
        ],
      },
      {
        unit: "Unit 8: Applications of Integration",
        topics: [
          { slug: "area-between-curves", title: "Area Between Curves" },
          { slug: "volume-cross-sections", title: "Volume by Cross Sections" },
          { slug: "volume-revolution", title: "Volume by Revolution (Disk/Washer)" },
        ],
      },
      {
        unit: "Unit 9: Parametric, Polar, and Vector-Valued Functions",
        topics: [
          { slug: "parametric-derivatives", title: "Derivatives of Parametric Functions" },
          { slug: "polar-area", title: "Area in Polar Coordinates" },
          { slug: "vector-valued", title: "Vector-Valued Functions" },
        ],
      },
      {
        unit: "Unit 10: Infinite Sequences and Series",
        topics: [
          { slug: "sequences-series-intro", title: "Introduction to Sequences and Series" },
          { slug: "convergence-tests", title: "Convergence Tests (Ratio, Integral, Comparison)" },
          { slug: "taylor-series", title: "Taylor and Maclaurin Series" },
          { slug: "power-series", title: "Power Series and Radius of Convergence" },
        ],
      },
    ],
  },

  "ap-statistics": {
    title: "AP Statistics",
    units: [
      {
        unit: "Unit 1: Exploring One-Variable Data",
        topics: [
          { slug: "describing-distributions", title: "Describing Distributions (Shape, Center, Spread)" },
          { slug: "measures-of-center", title: "Mean, Median, and Measures of Center" },
          { slug: "measures-of-spread", title: "Standard Deviation and Measures of Spread" },
          { slug: "boxplots-outliers", title: "Boxplots and Outliers" },
        ],
      },
      {
        unit: "Unit 2: Exploring Two-Variable Data",
        topics: [
          { slug: "scatterplots-correlation", title: "Scatterplots and Correlation" },
          { slug: "linear-regression", title: "Linear Regression" },
          { slug: "residuals", title: "Residuals and Residual Plots" },
        ],
      },
      {
        unit: "Unit 3: Collecting Data",
        topics: [
          { slug: "sampling-methods", title: "Sampling Methods" },
          { slug: "experimental-design", title: "Experimental Design" },
          { slug: "bias-in-sampling", title: "Sources of Bias" },
        ],
      },
      {
        unit: "Unit 4: Probability and Random Variables",
        topics: [
          { slug: "probability-rules", title: "Probability Rules" },
          { slug: "conditional-probability", title: "Conditional Probability and Independence" },
          { slug: "discrete-random-variables", title: "Discrete Random Variables" },
          { slug: "binomial-geometric", title: "Binomial and Geometric Distributions" },
        ],
      },
      {
        unit: "Unit 5: Sampling Distributions",
        topics: [
          { slug: "sampling-distribution-proportions", title: "Sampling Distribution of a Sample Proportion" },
          { slug: "sampling-distribution-means", title: "Sampling Distribution of a Sample Mean" },
          { slug: "central-limit-theorem", title: "Central Limit Theorem" },
        ],
      },
      {
        unit: "Unit 6: Inference for Proportions",
        topics: [
          { slug: "confidence-intervals-proportions", title: "Confidence Intervals for Proportions" },
          { slug: "significance-tests-proportions", title: "Significance Tests for Proportions" },
        ],
      },
      {
        unit: "Unit 7: Inference for Means",
        topics: [
          { slug: "confidence-intervals-means", title: "Confidence Intervals for Means" },
          { slug: "significance-tests-means", title: "Significance Tests for Means" },
          { slug: "t-distribution", title: "The t-Distribution" },
        ],
      },
      {
        unit: "Unit 8: Inference for Categorical Data (Chi-Square)",
        topics: [
          { slug: "chi-square-goodness-of-fit", title: "Chi-Square Goodness of Fit Test" },
          { slug: "chi-square-independence", title: "Chi-Square Test for Independence" },
        ],
      },
      {
        unit: "Unit 9: Inference for Slopes",
        topics: [
          { slug: "inference-for-slope", title: "Inference for the Slope of a Regression Line" },
        ],
      },
    ],
  },

  "ap-chemistry": {
    title: "AP Chemistry",
    units: [
      {
        unit: "Unit 1: Atomic Structure and Properties",
        topics: [
          { slug: "atomic-structure", title: "Atomic Structure and Electron Configuration" },
          { slug: "periodic-trends", title: "Periodic Trends" },
          { slug: "photoelectron-spectroscopy", title: "Photoelectron Spectroscopy (PES)" },
        ],
      },
      {
        unit: "Unit 2: Molecular and Ionic Compound Structure",
        topics: [
          { slug: "bonding-types", title: "Types of Chemical Bonds" },
          { slug: "lewis-structures", title: "Lewis Structures" },
          { slug: "vsepr", title: "VSEPR Theory and Molecular Geometry" },
        ],
      },
      {
        unit: "Unit 3: Intermolecular Forces and Properties",
        topics: [
          { slug: "intermolecular-forces", title: "Intermolecular Forces" },
          { slug: "states-of-matter", title: "States of Matter and Phase Changes" },
          { slug: "solutions-concentration", title: "Solutions and Concentration" },
        ],
      },
      {
        unit: "Unit 4: Chemical Reactions",
        topics: [
          { slug: "balancing-equations", title: "Balancing Chemical Equations" },
          { slug: "stoichiometry", title: "Stoichiometry" },
          { slug: "reaction-types", title: "Types of Chemical Reactions" },
        ],
      },
      {
        unit: "Unit 5: Kinetics",
        topics: [
          { slug: "reaction-rates", title: "Reaction Rates" },
          { slug: "rate-laws", title: "Rate Laws and Reaction Order" },
          { slug: "reaction-mechanisms", title: "Reaction Mechanisms" },
        ],
      },
      {
        unit: "Unit 6: Thermodynamics",
        topics: [
          { slug: "enthalpy", title: "Enthalpy and Heat of Reaction" },
          { slug: "entropy-gibbs", title: "Entropy and Gibbs Free Energy" },
          { slug: "calorimetry", title: "Calorimetry" },
        ],
      },
      {
        unit: "Unit 7: Equilibrium",
        topics: [
          { slug: "equilibrium-constant", title: "The Equilibrium Constant (K)" },
          { slug: "ice-tables", title: "ICE Tables" },
          { slug: "le-chateliers-principle", title: "Le Châtelier's Principle" },
        ],
      },
      {
        unit: "Unit 8: Acids and Bases",
        topics: [
          { slug: "acid-base-theories", title: "Acid-Base Theories" },
          { slug: "ph-poh", title: "pH and pOH Calculations" },
          { slug: "titrations", title: "Titrations and Buffers" },
        ],
      },
      {
        unit: "Unit 9: Electrochemistry",
        topics: [
          { slug: "redox-reactions", title: "Oxidation-Reduction (Redox) Reactions" },
          { slug: "electrochemical-cells", title: "Electrochemical Cells" },
        ],
      },
    ],
  },

  "ap-physics-1": {
    title: "AP Physics 1",
    units: [
      {
        unit: "Unit 1: Kinematics",
        topics: [
          { slug: "position-velocity-acceleration-p1", title: "Position, Velocity, and Acceleration" },
          { slug: "kinematic-equations", title: "Kinematic Equations (1D Motion)" },
          { slug: "projectile-motion", title: "Projectile Motion" },
        ],
      },
      {
        unit: "Unit 2: Dynamics (Newton's Laws)",
        topics: [
          { slug: "newtons-first-law", title: "Newton's First Law" },
          { slug: "newtons-second-law", title: "Newton's Second Law" },
          { slug: "newtons-third-law", title: "Newton's Third Law" },
          { slug: "friction", title: "Friction" },
        ],
      },
      {
        unit: "Unit 3: Circular Motion and Gravitation",
        topics: [
          { slug: "uniform-circular-motion", title: "Uniform Circular Motion" },
          { slug: "newtons-law-of-gravitation", title: "Newton's Law of Universal Gravitation" },
        ],
      },
      {
        unit: "Unit 4: Energy",
        topics: [
          { slug: "work-energy-theorem", title: "Work and the Work-Energy Theorem" },
          { slug: "kinetic-potential-energy", title: "Kinetic and Potential Energy" },
          { slug: "conservation-of-energy", title: "Conservation of Energy" },
        ],
      },
      {
        unit: "Unit 5: Momentum",
        topics: [
          { slug: "momentum-impulse", title: "Momentum and Impulse" },
          { slug: "conservation-of-momentum", title: "Conservation of Momentum" },
          { slug: "collisions", title: "Elastic and Inelastic Collisions" },
        ],
      },
      {
        unit: "Unit 6: Simple Harmonic Motion",
        topics: [
          { slug: "shm-basics", title: "Simple Harmonic Motion Basics" },
          { slug: "springs-pendulums", title: "Springs and Pendulums" },
        ],
      },
      {
        unit: "Unit 7: Torque and Rotational Motion",
        topics: [
          { slug: "torque", title: "Torque" },
          { slug: "rotational-inertia", title: "Rotational Inertia" },
          { slug: "angular-momentum", title: "Angular Momentum" },
        ],
      },
    ],
  },

  "ap-physics-2": {
    title: "AP Physics 2",
    units: [
      {
        unit: "Unit 1: Fluids",
        topics: [
          { slug: "fluid-pressure", title: "Fluid Pressure and Density" },
          { slug: "buoyancy", title: "Buoyancy and Archimedes' Principle" },
          { slug: "fluid-dynamics", title: "Fluid Flow and Bernoulli's Equation" },
        ],
      },
      {
        unit: "Unit 2: Thermodynamics",
        topics: [
          { slug: "temperature-heat", title: "Temperature and Heat" },
          { slug: "ideal-gas-law", title: "The Ideal Gas Law" },
          { slug: "laws-of-thermodynamics", title: "Laws of Thermodynamics" },
        ],
      },
      {
        unit: "Unit 3: Electric Force, Field, and Potential",
        topics: [
          { slug: "coulombs-law", title: "Coulomb's Law" },
          { slug: "electric-field", title: "Electric Fields" },
          { slug: "electric-potential", title: "Electric Potential and Potential Energy" },
        ],
      },
      {
        unit: "Unit 4: Electric Circuits",
        topics: [
          { slug: "ohms-law", title: "Ohm's Law" },
          { slug: "series-parallel-circuits", title: "Series and Parallel Circuits" },
          { slug: "capacitors", title: "Capacitors" },
        ],
      },
      {
        unit: "Unit 5: Magnetism and Electromagnetic Induction",
        topics: [
          { slug: "magnetic-fields", title: "Magnetic Fields and Forces" },
          { slug: "electromagnetic-induction", title: "Electromagnetic Induction (Faraday's Law)" },
        ],
      },
      {
        unit: "Unit 6: Optics",
        topics: [
          { slug: "reflection-refraction", title: "Reflection and Refraction" },
          { slug: "lenses-mirrors", title: "Lenses and Mirrors" },
          { slug: "wave-optics", title: "Interference and Diffraction" },
        ],
      },
      {
        unit: "Unit 7: Quantum, Atomic, and Nuclear Physics",
        topics: [
          { slug: "photoelectric-effect", title: "The Photoelectric Effect" },
          { slug: "atomic-models", title: "Atomic Models and Energy Levels" },
          { slug: "nuclear-physics", title: "Nuclear Physics and Radioactivity" },
        ],
      },
    ],
  },
};

export function getCourseList() {
  return Object.entries(curriculum).map(([id, data]) => ({
    id,
    title: data.title,
  }));
}

export function getCourse(courseId) {
  return curriculum[courseId] || null;
}

export function findTopic(courseId, topicSlug) {
  const course = curriculum[courseId];
  if (!course) return null;
  for (const unit of course.units) {
    const found = unit.topics.find((t) => t.slug === topicSlug);
    if (found) return { ...found, unit: unit.unit, courseId, courseTitle: course.title };
  }
  return null;
}