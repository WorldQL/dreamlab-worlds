import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/InventoryItem',
    args: {
      width: 200,
      height: 200,
      displayName: 'Basic Bow',
      animationName: 'bow',
      spriteSource:
        'https://s3-assets.dreamlab.gg/uploaded-from-editor/bow-1702293278974.png',
      damage: 1,
      lore: "Once wielded by 'Sharp-Eye' Sam, the fastest archer in the West, this bow's arrows are said to whistle with the winds of the prairie and never miss a zombie's heart.",
      bone: 'handRight',
      anchorX: 0.5,
      anchorY: 0.5,
      rotation: 0,
      projectileType: 'SINGLE_SHOT',
    },
    transform: { position: { x: 800, y: 300 }, rotation: 0, zIndex: 0 },
    uid: 'hed17ymwbvrywm2ib5ei7pf4',
  },
  {
    entity: '@dreamlab/InventoryItem',
    args: {
      width: 200,
      height: 200,
      displayName: 'Scatter Shot Shotgun',
      animationName: 'shoot',
      spriteSource:
        'https://s3-assets.dreamlab.gg/uploaded-from-editor/hand_cannon-1702293310960.png',
      damage: 1,
      lore: "Forged in a lawless frontier town, this shotgun's scatter shot was the bane of undead hordes, turning any cowboy into a one-person army against the zombie outbreak.",
      bone: 'handLeft',
      anchorX: 0.29,
      anchorY: 0.58,
      rotation: 45,
      projectileType: 'SCATTER_SHOT',
    },
    transform: { position: { x: 1_300, y: 300 }, rotation: 0, zIndex: 0 },
    uid: 'clxd8mnwzde5zw6l9lz3jx31',
  },
  {
    entity: '@dreamlab/InventoryItem',
    args: {
      width: 200,
      height: 200,
      displayName: 'Burst Revolver',
      animationName: 'shoot',
      spriteSource:
        'https://s3-assets.dreamlab.gg/uploaded-from-editor/classic_revolver-1702293335440.png',
      damage: 1,
      lore: "Crafted by the legendary gunsmith 'Bullseye' Betty, this revolver's rapid bursts made it a favorite among cowboys holding the line in the great zombie sieges of the Old West.",
      bone: 'handLeft',
      anchorX: 0.24,
      anchorY: 0.6,
      rotation: 60,
      projectileType: 'BURST_SHOT',
    },
    transform: { position: { x: 1_800, y: 300 }, rotation: 0, zIndex: 0 },
    uid: 'dyvqv4qv8z1i3oou0334gd4a',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 200, height: 100 },
    transform: { position: { x: 800, y: 475 }, rotation: 0, zIndex: 0 },
    uid: 'fscrggsjjdnkqe4t753qm02q',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 200, height: 100 },
    transform: { position: { x: 1_300, y: 475 }, rotation: 0, zIndex: 0 },
    uid: 'pxuhvvyt5yf3q8jxqo5dni2y',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 200, height: 100 },
    transform: { position: { x: 1_800, y: 475 }, rotation: 0, zIndex: 0 },
    uid: 'nvoqs8v3heo33ka8j83z1svk',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_004.872_510_417_335_2,
      height: 2_004.872_510_417_335_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house-1702315676825.png',
      },
    },
    transform: {
      position: { x: -3_978.302_828_128_957, y: 228.995_969_219_494_1 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'dzbswpsob31y0l3xfkaomam5',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 707.991_266_440_216_6,
      height: 707.991_266_440_216_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/well-1702315700504.png',
      },
    },
    transform: {
      position: { x: -858.697_537_083_762_2, y: 272.905_102_513_001 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'tyh7kgvgmxvj6piaa21b9rz1',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_715.678_829_129_712_5,
      height: 2_066.251_374_129_72,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/saloon-1702315686818.png',
      },
    },
    transform: {
      position: { x: 6_386.639_163_712_140_5, y: -104.669_100_491_762_78 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'kefez2nqgl39tt5xbkbt5cil',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_788.512_008_491_725_3,
      height: 1_892.707_951_630_635_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house2-1702315679205.png',
      },
    },
    transform: {
      position: { x: 11_592.249_455_811_052, y: 162.681_577_412_231_66 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'n0ebhp9ac5zk9g6rl5va8znu',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_187.340_747_526_566_7,
      height: 1_187.340_747_526_566_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstorm-1702315724505.png',
      },
    },
    transform: {
      position: { x: 13_149.115_374_475_236, y: -530.073_478_551_811 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'd5z5iy7cd9xf03vabrzw9pes',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_921.764_972_325_592_7,
      height: 2_921.764_972_325_592_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/clouds3-1702315741331.png',
      },
    },
    transform: {
      position: { x: 12_910.489_643_368_52, y: -1_492.452_960_710_683 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'tmn4qpwlijfyz5cbf8umr4cz',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_300.622_938_805_427,
      height: 2_300.622_938_805_427,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house3-1702315681242.png',
      },
    },
    transform: {
      position: { x: 9_449.184_532_799_854, y: -274.448_707_573_419_4 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'o63fkph34lc455bn5mukqmtn',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_611.139_611_579_333_2,
      height: 1_611.139_611_579_333_2,
      spriteSource: {
        url: 'https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1701998278789.png',
      },
    },
    transform: {
      position: { x: -896.330_854_406_849_5, y: -1_178.270_335_195_914_9 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'utjss59qijl87o93ewt2dj5h',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 946.381_458_409_673_2,
      height: 946.381_458_409_673_2,
      spriteSource: {
        url: 'https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1702241095704.png',
      },
    },
    transform: {
      position: { x: 1_305.766_507_421_335_5, y: 388.311_077_063_489 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'wo7xyvz6d6hp1hh0eeh72zwn',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 2_804.238_443_087_931, height: 2_804.238_443_087_931 },
    transform: {
      position: { x: 1_443.086_688_258_598_8, y: -1_605.093_100_290_853 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'zaffccj7z3d8tskq1j2mtj5l',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_662.733_602_052_034_5,
      height: 921.802_858_189_813,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/desert1-1702315672978.png',
      },
    },
    transform: {
      position: { x: -1_999.629_784_257_388_8, y: 3_925.182_452_074_518 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ntrqii9ndfog7icdgdjfwvvf',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_373.433_492_121_656_4,
      height: 1_373.433_492_121_656_4,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/ground1-1702315694241.png',
      },
    },
    transform: {
      position: { x: -1_664.687_683_035_444_5, y: 4_806.431_459_243_002 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'sc10rxezt5ismhmltrdisi6r',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 946.662_583_559_627_8,
      height: 946.662_583_559_627_8,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/underground-1702315769040.png',
      },
    },
    transform: {
      position: { x: -220.898_469_714_630_64, y: 1_375.568_519_686_611_6 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'wq3s1zsgqkf17ylmmzeaglxe',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 953.599_434_919_469_8,
      height: 953.599_434_919_469_8,
      spriteSource: {
        url: 'https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1702241555772.png',
      },
    },
    transform: {
      position: { x: -218.638_125_070_991, y: 429.881_721_100_976_16 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'qf53dgdwhi2ib8m300hj3poq',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 100, height: 100 },
    transform: {
      position: { x: -871.441_268_308_862_8, y: 1_231.276_713_611_232 },
      rotation: -0.206_796_411_342_602_4,
      zIndex: 100,
    },
    uid: 'vhvy2t374m149nq8gt1nmm7s',
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 334.269_441_159_051_9,
      height: 334.269_441_159_051_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/brick-1702315735760.png',
      },
    },
    transform: {
      position: { x: -2_406.426_852_214_552, y: 3_432.707_453_191_316_3 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'p8ar1ycsx4f65gdbmm4k3wnt',
  },
  {
    entity: '@dreamlab/Region',
    args: { width: 4_000, height: 1_100 },
    transform: { position: { x: 0, y: 4_000 }, rotation: 0, zIndex: 0 },
  },
  {
    entity: '@dreamlab/Region',
    args: { width: 4_000, height: 1_100 },
    transform: { position: { x: -5_000, y: 4_000 }, rotation: 0, zIndex: 0 },
  },
  {
    entity: '@dreamlab/Region',
    args: { width: 4_000, height: 1_100 },
    transform: { position: { x: 5_000, y: 4_000 }, rotation: 0, zIndex: 0 },
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 21_782.984_885_701_66, height: 123.833_289_093_368_42 },
    transform: {
      position: { x: 10_190.106_266_031_516, y: 611.725_906_925_612_7 },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'jtgnqqzvcf81bfn8dvxve5ld',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 3_000, height: 100 },
    transform: { position: { x: -1_000, y: 2_170 }, rotation: 90, zIndex: 0 },
    uid: 'eydc375n6kgxu4sdunbusbye',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 3_000, height: 100 },
    transform: { position: { x: -650, y: 2_170 }, rotation: 90, zIndex: 0 },
    uid: 'ruvttcm884ct5luzv67270av',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 25_000, height: 200 },
    transform: { position: { x: 550, y: 4_620 }, rotation: 0, zIndex: 0 },
    uid: 'cxmz94liwbz7uda4pjdkk2sj',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 190.495_376_623_239_28, height: 1_128.178_820_080_632_2 },
    transform: {
      position: { x: 14_503.081_973_728_47, y: -30.549_843_520_664_07 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ks16ze1amc8kmjn0rpr1xpws',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 66.161_591_278_199_92, height: 179.704_686_171_067_12 },
    transform: {
      position: { x: -679.563_843_978_362_9, y: 467.181_407_017_595_86 },
      rotation: -0.903_440_835_362_379,
      zIndex: 100,
    },
    uid: 'svegk6cwg7n3v1p7a4quj17l',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 69.386_495_056_802_23, height: 170.463_824_834_256_23 },
    transform: {
      position: { x: -1_016.472_633_128_985_2, y: 464.254_403_724_792_1 },
      rotation: -0.689_757_852_130_013_4,
      zIndex: 100,
    },
    uid: 'pkxc7i1gtw14twq7pr4jli17',
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 660.885_860_373_887_2, height: 95.854_478_059_893_15 },
    transform: {
      position: { x: 1_364.564_350_364_653_4, y: 4_142.044_253_543_931 },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'nj4dl05qu36qzg7hyf9750dc',
  },
]
