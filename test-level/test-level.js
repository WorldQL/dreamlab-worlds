export default [
  {
    entityFn: "createSolid",
    args: [1290, 50],
    transform: {
      position: [0, 295],
    },
  },
  {
    entityFn: "createSolid",
    args: [50, 400],
    transform: {
      position: [620, 70],
    },
  },
  {
    entityFn: "createSolid",
    args: [50, 400],
    transform: {
      position: [-620, 70],
    },
  },
  {
    entityFn: "createSolid",
    args: [100, 100],
    transform: {
      position: [-400, 120],
      rotation: 45,
    },
  },
  {
    entityFn: "createNonsolid",
    args: [100, 100],
    transform: {
      position: [400, 120],
      rotation: -45,
    },
  },
];
