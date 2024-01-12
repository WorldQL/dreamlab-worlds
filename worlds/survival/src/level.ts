import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Background',
    args: {
      opacity: 1,
      fadeTime: 0.2,
      scale: {
        x: 1,
        y: 1,
      },
      parallax: {
        x: -0.2,
        y: -0.2,
      },
    },
    transform: {
      position: {
        x: 51.733_844_250_821_335,
        y: 246.233_125_663_221_47,
      },
      rotation: 0,
      zIndex: -100,
    },
    uid: 'mh2ljjcjspf3swctrfumet1t',
    tags: [],
  },
  {
    entity: '@dreamlab/BackgroundTrigger',
    args: {
      width: 28_881.511_852_279_044,
      height: 3_684.631_902_479_024_6,
      onEnter: {
        action: 'set',
        textureURL:
          'https://s3-assets.dreamlab.gg/uploaded-from-editor/sky2XY-1703001940523.png',
      },
      onLeave: {
        action: 'clear',
      },
    },
    transform: {
      position: {
        x: 759.809_374_979_273_3,
        y: 292.561_482_326_888_84,
      },
      rotation: 0,
      zIndex: -100,
    },
    uid: 'd6yo1be0iq3p41fwp9khe3qv',
    tags: ['editorLocked'],
  },
  {
    entity: '@dreamlab/Region',
    args: {
      width: 4_000,
      height: 1_100,
      id: 'center',
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/workshop-1703001965089.png',
      },
      zombieTypes: [
        {
          width: 80,
          height: 260,
          maxHealth: 4,
          speed: 2,
          knockback: 0.5,
        },
      ],
      bounds: { width: 4_000, height: 1_100 },
      center: { x: 0, y: 4_000 },
      difficulty: 2,
      waves: 2,
      waveInterval: Math.random() * (15 - 5) + 5,
      endCooldown: 60,
    },
    transform: { position: { x: 5_000, y: 4_000 }, rotation: 0, zIndex: 0 },
  },

  {
    entity: '@dreamlab/InventoryItem',
    args: {
      width: 190.008_550_140_466_7,
      height: 190.008_550_140_466_7,
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
    transform: {
      position: {
        x: 1_345.507_097_305_847,
        y: 203.764_887_378_679_65,
      },
      rotation: 0,
      zIndex: 9,
    },
    uid: 'hed17ymwbvrywm2ib5ei7pf4',
    tags: [],
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
    transform: {
      position: {
        x: 1_663.690_846_732_47,
        y: 210.222_290_843_676_9,
      },
      rotation: 0,
      zIndex: 9,
    },
    uid: 'clxd8mnwzde5zw6l9lz3jx31',
    tags: [],
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
    transform: {
      position: {
        x: 1_949.727_228_861_308_5,
        y: 216.902_436_517_808_6,
      },
      rotation: 0,
      zIndex: 9,
    },
    uid: 'dyvqv4qv8z1i3oou0334gd4a',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_258.409_673_873_213_3,
      height: 1_123.195_309_637_229_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/workshop-1703001965089.png',
      },
    },
    transform: {
      position: {
        x: 2_012.181_325_670_412,
        y: 35.356_678_702_773_706,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'sr6mkpvzlhnw2kfd3r2ivvh7',
    tags: ['editorLocked'],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 797.857_277_357_713_9,
      height: 256.910_369_027_138_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/counter-1703001788599.png',
      },
    },
    transform: {
      position: {
        x: 1_648.050_005_551_906_5,
        y: 445.691_686_992_772_13,
      },
      rotation: 0,
      zIndex: 1,
    },
    uid: 'h74n0wgd5eetq0k9ktrjkc2i',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 219.040_637_003_813_57,
      height: 349.005_554_424_516_84,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/shopkeep-1703001936455.png',
      },
    },
    transform: {
      position: {
        x: 1_800.361_015_595_850_9,
        y: 323.937_686_742_565_06,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'g50oquj9myvwl7to8tdv4mmu',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_257.676_804_690_362_6,
      height: 827.995_602_784_903_1,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/shed-1703001927711.png',
      },
    },
    transform: {
      position: {
        x: 3_781.154_460_222_077,
        y: 171.517_444_007_150_9,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'ngdju3e3ti4mr920f127v5s8',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_467.256_746_278_020_7,
      height: 1_353.316_233_052_401,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/saloon-1703001917222.png',
      },
    },
    transform: {
      position: {
        x: 5_724.951_310_706_87,
        y: -79.471_126_491_747_55,
      },
      rotation: 0,
      zIndex: -3,
    },
    uid: 'h216rerpcxjas8udy35z0otr',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_373.392_201_915_299_7,
      height: 1_587.834_371_564_676_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house3-1703001875315.png',
      },
    },
    transform: {
      position: {
        x: 8_705.546_716_796_99,
        y: -206.920_658_820_373_92,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'myl4nnpbn750hy90u15y35za',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 496.819_804_619_479_3,
      height: 443.139_917_112_52,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/boxes-1703001772268.png',
      },
    },
    transform: {
      position: {
        x: 6_653.649_634_525_363,
        y: 249.292_179_995_467_5,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'llrzb3m3x4anift4bordescf',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 522.975_448_882_374_6,
      height: 438.695_492_854_525_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/boxes-1703001772268.png',
      },
    },
    transform: {
      position: {
        x: 6_960.540_540_124_339,
        y: 337.302_714_180_402_23,
      },
      rotation: 1.283_353_845_949_06,
      zIndex: -5,
    },
    uid: 'pojzf369qn8lcenlcjv2uodc',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 148.112_058_465_285_37,
      height: 209.013_398_294_762_65,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/barrel-1703001768203.png',
      },
    },
    transform: {
      position: {
        x: 6_829.548_699_499_651,
        y: 448.873_853_538_312_4,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'gcyhibd2cibggcg54nfv3mry',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 149.025_360_279_572_85,
      height: 199.047_991_738_366_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/barrel-1703001768203.png',
      },
    },
    transform: {
      position: {
        x: 6_963.547_771_816_422,
        y: 478.589_850_825_873_2,
      },
      rotation: 11.028_347_162_303_165,
      zIndex: 1,
    },
    uid: 'whoof3timsjmzwyvfkzyc3zg',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 152.009_744_214_374_22,
      height: 212.911_084_043_848_97,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/barrel-1703001768203.png',
      },
    },
    transform: {
      position: {
        x: 6_712.516_860_113_205,
        y: 413.792_205_126_985_5,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 't6wnpy8qkod3kd18mgm1t7xh',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 152.009_744_214_372_4,
      height: 197.320_341_047_503_12,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/barrel-1703001768203.png',
      },
    },
    transform: {
      position: {
        x: 6_707.737_426_302_45,
        y: 239.424_601_138_079_77,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'kaabn43tr62a0ddnngq55ond',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 116.930_572_472_592_76,
      height: 170.036_540_803_897_54,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/barrel-1703001768203.png',
      },
    },
    transform: {
      position: {
        x: 6_711.646_461_836_392_5,
        y: 8.432_887_221_991_052,
      },
      rotation: 1.096_713_523_153_282_7,
      zIndex: -5,
    },
    uid: 'zrx40on7nse31h307ktq3yft',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 433.768_600_407_753_64,
      height: 625.459_766_312_184_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/well-1703001959001.png',
      },
    },
    transform: {
      position: {
        x: -847.262_829_219_887_6,
        y: 282.977_925_542_739_97,
      },
      rotation: 0,
      zIndex: 1,
    },
    uid: 'msagioi5jps0lm0nwg00px44',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 316.512_683_433_996_7,
      height: 227.680_003_812_392_84,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/wellFront-1703001962312.png',
      },
    },
    transform: {
      position: {
        x: -824.955_112_652_285_2,
        y: 485.393_096_811_479_9,
      },
      rotation: 0,
      zIndex: 11,
    },
    uid: 'h3pdiqjsgds2ok0zcua5pwdb',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_356.458_774_134_411_2,
      height: 781.973_203_410_475_8,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house-1703001870225.png',
      },
    },
    transform: {
      position: {
        x: -10_524.368_529_466_436,
        y: 244.502_496_308_321_75,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'sibvvyq8r6lo4fsmftrswusj',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_754.280_911_968_791_8,
      height: 840.438_489_646_772_4,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house2-1703001872910.png',
      },
    },
    transform: {
      position: {
        x: -8_649.729_290_272_235,
        y: 174.271_216_177_771_58,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'qv6nf24k6kj68zozykuvcx4w',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_513.166_428_999_726,
      height: 1_729.110_840_438_49,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/house4-1703001877174.png',
      },
    },
    transform: {
      position: {
        x: -5_700.024_509_230_472,
        y: -272.268_845_749_052_5,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'u85796q87d5u298wi1hsuhri',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 87.373_807_000_266_42,
      height: 44.730_381_373_072_305,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave11-1703001861494.png',
      },
    },
    transform: {
      position: {
        x: -332.591_058_131_350_8,
        y: 8_219.614_296_722_159,
      },
      rotation: 10.613_308_631_731_112,
      zIndex: -6,
    },
    uid: 'cd0clqrwkrjwwi75o1xg0274',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 67.973_629_482_686_19,
      height: 76.674_898_428_336_75,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave10-1703001859643.png',
      },
    },
    transform: {
      position: {
        x: 1_351.950_478_769_681_5,
        y: 8_292.377_892_530_132,
      },
      rotation: 3.933_842_595_833_153_3,
      zIndex: -6,
    },
    uid: 'ip1snc6ns7tk06ocqsetbytr',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 100,
      height: 100,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave8-1703001855620.png',
      },
    },
    transform: {
      position: {
        x: 2_736.732_729_091_514,
        y: 8_275.419_976_218_203,
      },
      rotation: -0.491_827_051_371_752_14,
      zIndex: -6,
    },
    uid: 'ipssvfg8j09weex4p2sk7iao',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 266.139_166_671_528_1,
      height: 232.399_512_778_822_1,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave6-1703001847085.png',
      },
    },
    transform: {
      position: {
        x: 2_435.386_345_438_057,
        y: 8_244.829_178_145_274,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'f1nsoa4dwiobt521xsweh8kn',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 140.596_589_303_326_7,
      height: 163.094_293_469_874_17,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave9-1703001857904.png',
      },
    },
    transform: {
      position: {
        x: -2_508.664_181_718_039_3,
        y: 8_255.020_172_648_901,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'wwpixcxl0oartfwl9tuzmzjo',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 281.751_688_843_534_8,
      height: 268.026_796_603_584_44,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave-1703001836190.png',
      },
    },
    transform: {
      position: {
        x: -962.778_456_807_015_5,
        y: 8_244.623_069_170_018,
      },
      rotation: 0,
      zIndex: 12,
    },
    uid: 'l8xqseb9bugx3iid9xhuxqw8',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 97.101_151_777_327_69,
      height: 98.802_273_651_021_1,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave3-1703001839817.png',
      },
    },
    transform: {
      position: {
        x: 699.247_788_490_318_3,
        y: 8_276.735_124_156_181,
      },
      rotation: 0,
      zIndex: -6,
    },
    uid: 'nz0c8gzrwpsnjfi6wl5s20zq',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 180.229_155_347_793_5,
      height: 221.254_567_614_621_92,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave3-1703001839817.png',
      },
    },
    transform: {
      position: {
        x: 912.918_804_092_345,
        y: 8_232.110_948_343_74,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'pgq32a1pobbrd2dzzy1nb8xm',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 237.944_874_664_885_76,
      height: 236.135_343_908_910_73,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave8-1703001855620.png',
      },
    },
    transform: {
      position: {
        x: 47.145_538_377_595_81,
        y: 8_228.219_021_095_045,
      },
      rotation: -5.098_094_121_621_01,
      zIndex: -2,
    },
    uid: 'mijap11ov7331nhikoblspcp',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 183.715_201_702_594_87,
      height: 214.825_120_881_925_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave10-1703001859643.png',
      },
    },
    transform: {
      position: {
        x: 1_925.151_960_945_581_8,
        y: 8_228.896_224_979_96,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'qotbf7lno3sx89344kwtnjpn',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 288.318_284_599_517_94,
      height: 282.807_687_619_420_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave6-1703001847085.png',
      },
    },
    transform: {
      position: {
        x: -2_252.601_956_023_573_6,
        y: 8_217.156_709_388_015,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'vdw1hx7jugoimes5blk75tdl',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 86.281_977_993_065_08,
      height: 110.722_929_967_558_23,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave3-1703001839817.png',
      },
    },
    transform: {
      position: {
        x: -2_976.874_853_833_026,
        y: 8_274.822_209_174_205,
      },
      rotation: 1.213_223_246_785_825,
      zIndex: -6,
    },
    uid: 'l2k3xt2lvkwhq7faa488ozl9',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 254.400_323_955_193_93,
      height: 264.005_794_674_021_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave4-1703001841648.png',
      },
    },
    transform: {
      position: {
        x: 1_043.367_433_459_199_2,
        y: 8_239.844_661_754_054,
      },
      rotation: 0,
      zIndex: 11,
    },
    uid: 'h7k83o20k4oe41isyj4a28pa',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 243.231_815_943_434_4,
      height: 224.511_840_298_429_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave2-1703001838061.png',
      },
    },
    transform: {
      position: {
        x: -2_064.896_300_325_524,
        y: 8_224.041_520_816_238,
      },
      rotation: 9.861_153_109_249_459,
      zIndex: -2,
    },
    uid: 'frefsf906yhf0i2dsgzbq2df',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 261.370_322_547_947_6,
      height: 318.366_406_914_688_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave12-1703001863530.png',
      },
    },
    transform: {
      position: {
        x: 1_619.876_543_948_018_5,
        y: 8_213.849_360_005_463,
      },
      rotation: 0,
      zIndex: 12,
    },
    uid: 'rflfs78o20wqvhhgghkf1ekf',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 344.908_481_654_708_8,
      height: 224.750_335_995_101_52,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave11-1703001861494.png',
      },
    },
    transform: {
      position: {
        x: -3_485.868_652_050_562_6,
        y: 8_230.814_952_084_795,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'mase92yh2l719fhmqrdsr6h7',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 232.277_893_998_541_9,
      height: 281.120_584_642_42,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave10-1703001859643.png',
      },
    },
    transform: {
      position: {
        x: -4_190,
        y: 8_230,
      },
      rotation: 0,
      zIndex: 12,
    },
    uid: 'h25kxrgiaeo565xzjavosz8s',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 187.451_715_600_132_96,
      height: 211.693_057_247_925_03,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave5-1703001843591.png',
      },
    },
    transform: {
      position: {
        x: -535.608_498_851_238_2,
        y: 8_222.578_407_913_728,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'czvipk1i8bbunlh86x9iytgp',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 41_272.820_261_272_005,
      height: 436.729_961_065_637_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/groundX-1703001868400.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -1_581.683_397_589_400_6,
        y: 8_528.509_693_104_008,
      },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'qbk45uaqlwagsgsy23zto0kz',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 711.902_244_504_418_3,
      height: 635.515_168_066_355_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/stonePlatform1-1703004877657.png',
      },
    },
    transform: {
      position: {
        x: -1_277.224_473_648_404_2,
        y: 6_217.912_440_675_544,
      },
      rotation: -0.726_190_044_634_089,
      zIndex: -3,
    },
    uid: 'zhxl9z0rowv35d3yykbmupuq',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 40_373.928_601_599_48,
      height: 680.062_369_551_245_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/ground3X-1703262997778.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 833.852_161_285_288_3,
        y: 906.356_802_880_488_4,
      },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'iosovfvg4oio488rpe9hydu0',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 40_331.759_838_026_206,
      height: 907.267_020_389_057,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/blackXY-1703001770204.png',
      },
    },
    transform: {
      position: {
        x: 866.712_268_665_593,
        y: 1_694.073_738_675_302_8,
      },
      rotation: 0,
      zIndex: 11,
    },
    uid: 'ts7jaer1lwt9nxb1v5cnn181',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 166.186_620_847_072_4,
      height: 346.862_796_833_776_26,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/shopkeeper2-1703001938327.png',
      },
    },
    transform: {
      position: {
        x: -2_374.673_406_799_143,
        y: 390.852_553_338_126_4,
      },
      rotation: 0,
      zIndex: -7,
    },
    uid: 'hkmd4qs7bzeey65zhdynhxwh',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 947.081_236_454_500_4,
      height: 512.232_583_532_131_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/martkeStall2-1703001892985.png',
      },
    },
    transform: {
      position: {
        x: -2_554.287_611_694_156,
        y: 324.515_347_383_213_34,
      },
      rotation: 0,
      zIndex: 1,
    },
    uid: 'jh8psbu111umjqvol0xy7rgd',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -845.549_641_280_099_4,
        y: 2_380.877_410_941_358_4,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'jzbcrtqlezniqgilmsu9p7g4',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -845.799_028_062_333_3,
        y: 2_879.131_229_216_744,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'p4iicl1iy6znrhnlw8l7zzr5',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -845.557_556_847_381_6,
        y: 3_377.615_477_762_58,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'c3n1xuqxptpjxy1qa232ner4',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -845.557_556_847_381_6,
        y: 3_876.036_726_047_462,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'i7gq3jg7wyohgo2jixoi5uya',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -846.183_707_893_052_1,
        y: 4_374.301_947_710_202,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'rs42pqq0nl76vwu7vhvsblif',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -845.979_720_435_771_9,
        y: 4_872.788_564_881_131,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'psggcsciapxc0w5j8rnhyk18',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -844.394_882_558_230_2,
        y: 5_371.032_192_867_339,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'nn5pevm8yu1h8906tkbmsvky',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 421.580_474_934_036_94,
      height: 498.499_591_331_940_34,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bricksY-1703284359242.png',
      },
    },
    transform: {
      position: {
        x: -843.587_460_101_559_6,
        y: 5_869.410_479_774_948,
      },
      rotation: 0,
      zIndex: 11,
    },
    uid: 'fggkg56ru7tvvhv94mjo9z13',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 381.042_903_975_667_74,
      height: 307.008_188_890_337_8,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/stonePlatform1-1703004877657.png',
      },
    },
    transform: {
      position: {
        x: -835.276_843_533_451,
        y: 6_112.274_738_133_623,
      },
      rotation: 26.585_102_037_485_2,
      zIndex: 10,
    },
    uid: 'bdbtro2yhfmeucaoqvzn46ne',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_778.924_988_889_837,
      height: 167.401_055_408_890_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -5_863.667_546_174_143,
        y: 8_092.981_530_343_009,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'y72truf941i2cto7og3m0h9c',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_007.310_651_525_702_4,
      height: 323.761_923_945_458_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform47-1703289214986.png',
      },
    },
    transform: {
      position: {
        x: -7_871.463_139_265_084_5,
        y: 7_948.627_044_293_755,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'ajj65ei17nptuxcmdt7c3j4c',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 573.056_080_778_140_3,
      height: 674.299_203_426_592_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform44-1703375415181.png',
      },
    },
    transform: {
      position: {
        x: -6_787.649_109_451_249,
        y: 7_494.312_448_694_727,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'hspeadfvyu4p7n3rs7el13fd',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 573.056_080_778_140_3,
      height: 674.299_203_426_592_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform45-1703375406684.png',
      },
    },
    transform: {
      position: {
        x: -7_473.683_276_737_472,
        y: 7_165.498_989_722_008,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'ku296tz0n0kz4l7gojfhxvu9',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_889.468_220_614_463_5,
      height: 170.643_092_685_200_83,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -5_182.690_395_857_981,
        y: 6_961.853_648_688_164,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'tob6ecgcccdz1ggayx0g2ti1',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 993.007_662_575_184_8,
      height: 539.556_454_082_347,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform36-1703375910696.png',
      },
    },
    transform: {
      position: {
        x: -4_274.842_782_989_425,
        y: 5_518.274_075_995_303,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'y93q5yfmd1o61l57hmti17pg',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_889.468_220_614_463_5,
      height: 170.643_092_685_200_83,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -2_490.315_665_312_246_4,
        y: 5_510.351_824_371_257,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'otza7y33t1a5bq9h6p4mg0f2',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 633.780_948_769_008_8,
      height: 233.141_988_442_645_04,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform47-1703289214986.png',
      },
    },
    transform: {
      position: {
        x: -2_791.618_391_446_641,
        y: 6_682.462_194_963_722,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'avw046m1q6l8rfqd05mi3adq',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 4_352.838_829_466_731,
      height: 164.911_609_498_641_16,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -10_601.830_778_467_354,
        y: 7_280.722_298_978_726,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'k0bpdq7b3mrmlia3culyrb9a',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 725.098_983_544_043_2,
      height: 446.052_769_287_493,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform37-1703376090016.png',
      },
    },
    transform: {
      position: {
        x: -16_074.267_392_221_29,
        y: 8_187.787_601_826_877,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'hehv7gk2cgd1hchrw9jsykjy',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_266.163_310_508_644,
      height: 770.471_903_702_563_4,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform3-1703001903285.png',
      },
    },
    transform: {
      position: {
        x: -14_210.809_656_962_912,
        y: 7_875.723_023_417_897,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'nct7ryrinc8tbmqibt5t5j2e',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 455.020_189_099_868_73,
      height: 497.318_507_830_475_94,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform46-1703375411980.png',
      },
    },
    transform: {
      position: {
        x: -14_067.319_360_634_956,
        y: 7_195.602_352_534_346,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'uqj53tcxrgmd0czpvvrcbwpz',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_738.003_199_950_81,
      height: 228.237_436_353_952_03,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -15_634.154_140_328_066,
        y: 6_911.596_493_161_001_5,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'o6onkglejok33isa719gbe5a',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_119.811_566_406_657_2,
      height: 487.812_480_539_225_36,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform34-1703376107235.png',
      },
    },
    transform: {
      position: {
        x: -12_613.374_380_344_208,
        y: 8_147.453_737_133_925,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'tl9a3gwlhc4wtlui496mzpp7',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 633.780_948_769_008_8,
      height: 233.141_988_442_645_04,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform47-1703289214986.png',
      },
    },
    transform: {
      position: {
        x: 3_162.227_012_007_072_5,
        y: 8_131.515_834_594_526,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'rp1de75gq7wpa26j7iavugz8',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 2_209.352_936_389_067_5,
      height: 227.486_870_169_444_05,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 5_231.255_312_717_676,
        y: 7_817.065_004_717_791,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'wbc20rsjgmpc2aa4wafv53cd',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 693.885_959_911_171_1,
      height: 449.256_383_010_444_55,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform34-1703376107235.png',
      },
    },
    transform: {
      position: {
        x: 6_969.738_544_065_543_5,
        y: 7_496.021_628_290_568_5,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'dfkiz3isrbplbtle05z65y57',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_105.218_343_854_346_1,
      height: 230.998_551_597_326_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform6X-1703291285081.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 5_606.400_844_375_017,
        y: 7_710.050_158_772_578,
      },
      rotation: -0.107_056_275_050_469_26,
      zIndex: -6,
    },
    uid: 'x44tmcexqlxdworhmf8nxz9b',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_137.148_522_771_488_4,
      height: 659.256_441_798_203,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform36-1703375910696.png',
      },
    },
    transform: {
      position: {
        x: 5_311.249_296_213_313,
        y: 6_688.008_911_406_981,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'vx0nvs3hsjw6gluoc8wuc56r',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 693.885_959_911_171_1,
      height: 449.256_383_010_444_55,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform44-1703375415181.png',
      },
    },
    transform: {
      position: {
        x: 7_380.438_872_146_19,
        y: 7_127.587_243_672_217_5,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'bhysssc9y0lzmjc5g7uqmwpn',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 398.602_610_562_446,
      height: 373.748_244_275_670_9,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform45-1703375406684.png',
      },
    },
    transform: {
      position: {
        x: 6_616.145_521_674_091_5,
        y: 6_786.571_416_530_115,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'keg48d1g71g17zc9apuig34v',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 694.691_941_885_446_8,
      height: 565.086_675_944_707_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform46-1703375411980.png',
      },
    },
    transform: {
      position: {
        x: 5_730.452_016_392_335,
        y: 6_081.533_241_670_999,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'a4ndhbeyycj3r1znc4s8q6uw',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 878.959_424_170_826_4,
      height: 425.581_527_827_926_04,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform35-1703375427203.png',
      },
    },
    transform: {
      position: {
        x: 7_066.697_443_053_792,
        y: 5_914.379_973_326_251,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'uelsg681pk00ge7l5cm8mww6',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 878.959_424_170_826_4,
      height: 425.581_527_827_926_1,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform34-1703376107235.png',
      },
    },
    transform: {
      position: {
        x: 8_558.224_274_690_681,
        y: 5_552.660_957_361_417,
      },
      rotation: -17.565_413_350_422_148,
      zIndex: -5,
    },
    uid: 'zgv2gt11g15yvby2lyj2nfu4',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 3_082.038_283_732_304_5,
      height: 229.964_986_914_302_24,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/xyz-1703001967292.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 3_316.712_389_301_116_7,
        y: 6_488.727_331_568_292,
      },
      rotation: 0,
      zIndex: -5,
    },
    uid: 'wdvmt10t9oq2uwftil2cukod',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 34_298.073_191_319_77,
      height: 781.649_076_517_416_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/townBG2X-1703001949245.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -2_206.194_909_316_813,
        y: 171.387_125_683_481_88,
      },
      rotation: 0,
      zIndex: -11,
    },
    uid: 'rzderw50hhlz49s0cs3o7z9i',
    tags: ['editorLocked'],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 34_323.333_113_456_465,
      height: 338.899_076_517_150_43,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/townBG1X-1703001946840.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -2_216.775_398_089_648_7,
        y: 421.991_219_846_084_6,
      },
      rotation: 0,
      zIndex: -10,
    },
    uid: 'smuszccpapv7hud59dziit3q',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 6_480.862_900_786_258,
      height: 4_160.813_370_802_238,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstormXY-1703001923602.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -16_317.490_768_221_965,
        y: -1_300.704_918_019_300_7,
      },
      rotation: 0,
      zIndex: -1,
    },
    uid: 'muuyilyvv4skqlhj3omajdov',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_287.405_672_823_219,
      height: 4_354.951_846_965_699,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstormGradientRight-1703438789434.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -12_435.988_226_413_152,
        y: -1_202.413_666_153_350_3,
      },
      rotation: 0,
      zIndex: -1,
    },
    uid: 'dp5k2hi7yevkot2bqmq945ea',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 798.383_888_616_120_2,
      height: 800.436_870_878_305_4,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/marketStall1-1703001885700.png',
      },
    },
    transform: {
      position: {
        x: -1_466.008_597_526_033_6,
        y: 226.578_576_279_350_5,
      },
      rotation: 0,
      zIndex: -11,
    },
    uid: 'ojsycwdtufktcsx1pfcfmqwx',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 1_291.884_214_853_384,
      height: 2_855.727_557_283_18,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstormGradientLeft-1703001919439.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 10_923.020_218_390_337,
        y: -771.665_743_811_995_6,
      },
      rotation: 0,
      zIndex: -1,
    },
    uid: 'grv7enww1yetg3frz3oeq9j0',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 3_520.511_483_367_567,
      height: 2_851.322_427_400_749_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstormXY-1703001923602.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: 13_326.715_383_304_123,
        y: -774.601_024_855_985_8,
      },
      rotation: 0,
      zIndex: -1,
    },
    uid: 'nle4w6feddprus5a0x4616ex',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 37_791.116_574_493_07,
      height: 529.784_182_938_716_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/desert2-1703437385249.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -3_118.563_954_308_983_7,
        y: 8_064.106_344_724_404,
      },
      rotation: 0,
      zIndex: -10,
    },
    uid: 'wpgw81grjrvo8xrq0difd7mn',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 66.960_662_075_282_02,
      height: 35.035_934_550_213_824,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/grave11-1703001861494.png',
      },
    },
    transform: {
      position: {
        x: -2_716.782_604_058_794_7,
        y: 8_226.132_331_626_031,
      },
      rotation: 10.060_689_795_322_29,
      zIndex: -6,
    },
    uid: 'omvb5bb0aqbbydnqabqxy8by',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 565.127_746_959_027_7,
      height: 136.516_324_255_523_6,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform6X-1703291285081.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -2_790.918_621_660_406_6,
        y: 6_529.069_375_048_110_5,
      },
      rotation: -0.107_056_275_050_469_26,
      zIndex: -6,
    },
    uid: 'ru8toq2q49f88q7awkwc7w5j',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 989.501_213_834_157_2,
      height: 516.215_039_577_837_2,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/platform2-1703001900992.png',
      },
    },
    transform: {
      position: {
        x: -6_114.587_442_546_614,
        y: 5_919.750_285_343_454,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'n6pbctsq55f9ambj6we0vkva',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 100,
      height: 100,
    },
    transform: {
      position: {
        x: -7_471.060_959_709_848,
        y: 8_165.895_758_185_566,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'owoa0xinqwudy5uwxoq3y6q8',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 41_214.335_807_386_6,
      height: 2_145.448_273_499_58,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/stoneXY-1703444958077.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -1_526.329_338_635_132_4,
        y: 9_591.162_509_350_253,
      },
      rotation: 0,
      zIndex: -4,
    },
    uid: 'rvebkrmhjf96o5432nzbfbwy',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 87.640_274_778_565_53,
      height: 87.640_274_778_565_53,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/bird-1703445269470.png',
      },
    },
    transform: {
      position: {
        x: 993.636_425_797_249_8,
        y: -2_169.003_993_746_393_5,
      },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'p667rdat1kdd78j6xtobxsec',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 95.696_183_603_696_11,
      height: 240.739_106_604_549_08,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/boy1-1703445894865.png',
      },
    },
    transform: {
      position: {
        x: 1_066.136_813_821_461,
        y: 318.291_896_156_991_47,
      },
      rotation: 0,
      zIndex: -7,
    },
    uid: 'ai0zea5pfqql9izvzqguj1ik',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 61.263_930_354_925_83,
      height: 123.524_551_886_133_79,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/girl1-1703445910095.png',
      },
    },
    transform: {
      position: {
        x: -1_579.187_907_698_442_4,
        y: 238.063_039_785_010_83,
      },
      rotation: 0,
      zIndex: -11,
    },
    uid: 'tzyfbga57f2pjfkh75l9t5zq',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 314.305_015_072_622_6,
      height: 227.390_791_997_807_7,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/clothesline-1703445912337.png',
      },
    },
    transform: {
      position: {
        x: -4_473.417_511_827_125,
        y: 214.034_709_215_883_6,
      },
      rotation: 0,
      zIndex: -11,
    },
    uid: 't2waynwdosh1nzk47bx6kd4z',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 35_686.513_048_287_07,
      height: 6_262.455_193_203_618,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/sky3XY-1703443714062.png',
        tile: true,
      },
    },
    transform: {
      position: {
        x: -1_451.775_237_842_517_5,
        y: 5_275.294_572_859_24,
      },
      rotation: 0,
      zIndex: -12,
    },
    uid: 'lwpukbepq4az4vo98ls7t7ii',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 347.514_511_873_350_8,
      height: 523.240_105_540_897_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/cactus1-1703001776754.png',
      },
    },
    transform: {
      position: {
        x: -10_440.592_840_600_986,
        y: 8_107.368_736_973_895,
      },
      rotation: 0,
      zIndex: 11,
    },
    uid: 'gvgc2bcaqkcrwkeg89gts7bs',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 463.609_498_680_738_85,
      height: 444.084_432_717_677_4,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/cactus2-1703001779132.png',
      },
    },
    transform: {
      position: {
        x: -1_609.338_982_623_614_8,
        y: 8_152.030_346_471_955,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 't1pwqxfj69y5z8qucxjb28od',
    tags: [],
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: {
      width: 468.941_952_506_596_86,
      height: 552.846_965_699_208_3,
      spriteSource: {
        url: 'https://s3-assets.dreamlab.gg/uploaded-from-editor/cactus3-1703001780890.png',
      },
    },
    transform: {
      position: {
        x: 7_227.579_494_759_503,
        y: 8_092.427_444_096_628,
      },
      rotation: 0,
      zIndex: -2,
    },
    uid: 'hr3cinmqhfq4thzwcteyzzc7',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_295.294_420_413_703,
      height: 50.246_984_077_163_006,
    },
    transform: {
      position: {
        x: 5_715.533_437_927_633,
        y: 474.345_563_864_996_05,
      },
      rotation: 0,
      zIndex: 111,
    },
    uid: 'wf2mci66nkb3phiksafpgd8g',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_347.387_996_889_701_8,
      height: 38.573_083_026_879_43,
    },
    transform: {
      position: {
        x: 5_712.399_183_816_415,
        y: -92.854_277_794_795_62,
      },
      rotation: 0,
      zIndex: 112,
    },
    uid: 'rpkpv7lte1yg7oiah61ebjcf',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 959.179_186_515_209,
      height: 49.395_382_924_147_61,
    },
    transform: {
      position: {
        x: 3_773.707_435_818_41,
        y: 54.540_187_191_351_78,
      },
      rotation: 0,
      zIndex: 108,
    },
    uid: 'jdkgdemfo2pg58z3ghrsw4uk',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 138.365_701_722_243_1,
      height: 25.943_569_072_920_468,
    },
    transform: {
      position: {
        x: 4_325.363_190_722_178,
        y: 253.521_058_077_170_4,
      },
      rotation: 0,
      zIndex: 107,
    },
    uid: 'v168citrbja2uqtpvyqg1hbg',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 763.519_473_074_717_6,
      height: 22.445_574_953_518_815,
    },
    transform: {
      position: {
        x: 1_648.875_792_997_306,
        y: 341.776_261_640_562_6,
      },
      rotation: 0,
      zIndex: 101,
    },
    uid: 'p9jk8lm4514j3d64p25ozgsn',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 785.635_764_016_124_1,
      height: 30.633_931_843_165_73,
    },
    transform: {
      position: {
        x: 2_691.893_304_215_517,
        y: 57.726_224_015_707_63,
      },
      rotation: 0,
      zIndex: 105,
    },
    uid: 'wt99i58rklnvkyc07m82y6w1',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 39.404_652_381_063_9,
      height: 62.943_109_879_558_534,
    },
    transform: {
      position: {
        x: 3_411.975_063_774_883,
        y: -199.410_443_375_928_48,
      },
      rotation: 0,
      zIndex: 110,
    },
    uid: 'hstf2l4m0fgp83n642llsul8',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 40.738_513_320_392_485,
      height: 68.253_532_668_101_17,
    },
    transform: {
      position: {
        x: 4_145.286_370_631_852,
        y: -197.756_068_138_713_43,
      },
      rotation: 0,
      zIndex: 109,
    },
    uid: 'mc5zi49veaf1vds8sl3knro2',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 865.542_819_716_318_7,
      height: 44.414_116_928_312_53,
    },
    transform: {
      position: {
        x: 2_680.127_368_720_228,
        y: -497.102_359_145_142_8,
      },
      rotation: 0,
      zIndex: 104,
    },
    uid: 'esu9z1t4wg1mudo1di0ko1nq',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_325.027_482_594_358,
      height: 30.633_931_843_166_24,
    },
    transform: {
      position: {
        x: 1_628.264_825_611_379,
        y: 25.895_231_109_802_07,
      },
      rotation: 0,
      zIndex: 102,
    },
    uid: 'kdhbm2bc6by4w7dh4cyq4evz',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 122.258_655_581_007_6,
      height: 27.042_872_847_197_71,
    },
    transform: {
      position: {
        x: 3_267.760_763_176_107_5,
        y: 413.422_800_752_426_16,
      },
      rotation: 0,
      zIndex: 106,
    },
    uid: 'vmpaivytp6ku9zoi3mjobajj',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 97.679_998_528_939,
      height: 37.008_462_127_702_73,
    },
    transform: {
      position: {
        x: 6_981.603_771_527_682,
        y: 414.419_023_035_502_1,
      },
      rotation: 0,
      zIndex: 113,
    },
    uid: 'gxtkbfzru1lyws3h6kjh9vix',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 175.395_858_708_889_14,
      height: 57.003_654_080_389_765,
    },
    transform: {
      position: {
        x: 7_126.856_346_584_808,
        y: 442.159_267_197_071_2,
      },
      rotation: 0,
      zIndex: 114,
    },
    uid: 'icfzuhl7x7cfxq0xrzcy90vb',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 286.663_973_735_317_1,
      height: 54.565_427_998_138_26,
    },
    transform: {
      position: {
        x: 6_992.968_714_037_274,
        y: 208.257_142_256_311_4,
      },
      rotation: 0,
      zIndex: 115,
    },
    uid: 'pnti0sqj9pcyvyutxwyzmvqq',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_324.457_695_800_895_2,
      height: 50.208_443_271_768_03,
    },
    transform: {
      position: {
        x: 1_629.022_871_226_355,
        y: -336.415_269_598_513_13,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'vemecqmv4c0rnnvtror72u8v',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_221.712_401_055_409,
      height: 36.488_126_649_076_55,
    },
    transform: {
      position: {
        x: 5_717.186_292_963_131,
        y: -239.114_565_176_789_9,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'sbv5pflynx1mpmit5rnxa1gy',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_075.406_332_453_825_6,
      height: 55.770_448_548_812_74,
    },
    transform: {
      position: {
        x: 8_069.202_435_890_322,
        y: -319.993_914_822_901_96,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'p8wsi8bgm7q4huynzda10n9q',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_752.368_733_509_233_6,
      height: 116.963_060_686_015_52,
    },
    transform: {
      position: {
        x: -5_861.995_826_082_360_5,
        y: 8_084.457_455_069_323,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ol3pultk3eouz4zhmmemobet',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 971.976_253_298_153_2,
      height: 118.803_865_450_975_54,
    },
    transform: {
      position: {
        x: -7_869.814_820_803_459,
        y: 7_857.872_029_793_969,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'wfr0qjdus28avlyeng43y3je',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 402.395_778_364_116_27,
      height: 58.860_158_311_345_91,
    },
    transform: {
      position: {
        x: -6_772.440_642_035_351,
        y: 7_488.039_503_906_187,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'x2fmnoh1pybnb28m99kork93',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 516.709_762_532_982_5,
      height: 62.092_348_284_960_28,
    },
    transform: {
      position: {
        x: -7_461.787_152_841_943,
        y: 7_159.781_824_024_356,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'gj0pyeernrp8ut9rki4dj2vq',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_866.705_458_644_423,
      height: 112.092_217_191_780_96,
    },
    transform: {
      position: {
        x: -5_189.147_948_316_137,
        y: 6_936.247_819_944_108,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'rdvn6himc36oknrkktbne57h',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 610.366_754_617_414_7,
      height: 97.965_699_208_443_77,
    },
    transform: {
      position: {
        x: -2_790.843_232_032_056,
        y: 6_622.766_258_479_309,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 't08x0folcnwu3x1x8dkqdqji',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 3_531.961_117_863_157_6,
      height: 121.905_908_507_732_42,
    },
    transform: {
      position: {
        x: -2_795.787_791_881_878_5,
        y: 5_484.355_285_458_072,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'k2yjwik4kcgalz40ij22vh7y',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 4_338.067_770_638_298,
      height: 122.613_829_034_929_04,
    },
    transform: {
      position: {
        x: -10_602.053_587_521_06,
        y: 7_266.756_853_238_727,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'hatwg6fawsmpwjii8eldz15p',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 226.197_889_182_058_13,
      height: 99.553_764_086_144_84,
    },
    transform: {
      position: {
        x: -4_617.875_210_971_768,
        y: 5_322.213_415_716_36,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'djoftnoqylbsbdg6drp4jpqy',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 685.833_940_418_353_4,
      height: 88.873_219_828_493_35,
    },
    transform: {
      position: {
        x: -16_066.805_003_777_348,
        y: 8_095.094_924_722_627,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'y7qoigfwsemp0o1r7g5c6r0b',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_166.105_540_897_093_3,
      height: 131.738_786_279_683_15,
    },
    transform: {
      position: {
        x: -14_237.262_911_249_987,
        y: 7_879.894_462_565_237,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'wcnyp10d6il8pukfepwchewb',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 250.936_066_711_898_1,
      height: 112.768_998_192_069_38,
    },
    transform: {
      position: {
        x: -13_720.333_846_980_61,
        y: 7_577.661_547_413_249,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'lg3spsuuk3yslmouhc8lsqpb',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 373.635_264_317_561_45,
      height: 169.160_818_771_744_74,
    },
    transform: {
      position: {
        x: -14_057.213_269_810_143,
        y: 7_245.697_028_198_276,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'n6vw591g6r2gdjdfhp2he8n5',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_708.120_916_896_339_6,
      height: 155.327_785_579_281_23,
    },
    transform: {
      position: {
        x: -15_628.581_099_887_64,
        y: 6_879.649_016_547_788,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'mnqkthy23gtt7drstlbefwe3',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 1_058.519_788_918_205_4,
      height: 103.658_495_714_072_16,
    },
    transform: {
      position: {
        x: -12_614.390_760_729_27,
        y: 8_041.691_863_783,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'yzk7qyr3epe9ikwepjd7w3yh',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 618.136_464_191_515_6,
      height: 108.878_773_763_574_84,
    },
    transform: {
      position: {
        x: 3_160.527_834_372_266_6,
        y: 8_078.291_876_124_16,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'cv5uzj7bzli15omyfpotwwne',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 2_209.021_695_699_616_4,
      height: 121.898_725_546_770_95,
    },
    transform: {
      position: {
        x: 5_227.497_299_002_136,
        y: 7_769.331_063_882_254,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'le0hmtb3ksep73lrwsqnl0zu',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 671.607_073_140_554_3,
      height: 86.036_939_313_986_3,
    },
    transform: {
      position: {
        x: 6_963.135_448_985_074,
        y: 7_395.485_351_898_224_5,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ecvbgh3ct02rsyweab6xtog0',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 503.319_876_141_549_7,
      height: 83.012_883_950_877_95,
    },
    transform: {
      position: {
        x: 7_413.171_702_846_333,
        y: 7_151.867_652_226_371,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ws9jsbr08lf78iisiygab0vj',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 363.189_806_983_466_04,
      height: 60.596_745_822_339_47,
    },
    transform: {
      position: {
        x: 6_627.592_779_905_084,
        y: 6_795.250_593_539_603,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'tzhyk55w7mc0e10g0kearcut',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 885.432_717_678_100_7,
      height: 64.324_538_258_574_65,
    },
    transform: {
      position: {
        x: 5_407.852_141_592_022,
        y: 6_617.807_691_387_386_5,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'nii33fx2lbz35ghel64zg7f1',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 3_274.413_071_817_566_6,
      height: 99.427_309_539_238_2,
    },
    transform: {
      position: {
        x: 3_415.769_176_483_589_5,
        y: 6_431.568_729_622_579,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'a8zg9mzymkybs9yeogxvprq5',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 618.898_614_997_670_8,
      height: 59.405_386_779_870_24,
    },
    transform: {
      position: {
        x: 5_743.358_233_838_029,
        y: 6_076.388_117_230_669,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'en1kdy4egtzwb0uxmpan4f8y',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 810.713_159_741_580_1,
      height: 49.700_054_867_507_79,
    },
    transform: {
      position: {
        x: 7_075.529_818_321_669,
        y: 5_787.526_947_023_245,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ceud8uehm94q2bul1933ipsy',
    tags: [],
  },
  {
    entity: '@dreamlab/Platform',
    args: {
      width: 969.865_435_356_201_5,
      height: 102.152_041_519_447_27,
    },
    transform: {
      position: {
        x: -6_110.283_020_316_719,
        y: 5_880.402_140_953_574,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'k2qfimuc0be6as8ig2rtzzzl',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 21_718.933_082_313_393,
      height: 59.764_584_970_080_82,
    },
    transform: {
      position: {
        x: 10_206.621_886_183_384,
        y: 599.768_455_984_519,
      },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'jtgnqqzvcf81bfn8dvxve5ld',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 5_579.260_715_955_342,
      height: 58.916_988_630_769_08,
    },
    transform: {
      position: {
        x: -1_015.031_451_973_430_4,
        y: 3_367.687_115_974_53,
      },
      rotation: 90,
      zIndex: 0,
    },
    uid: 'eydc375n6kgxu4sdunbusbye',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 5_586.833_153_187_934,
      height: 68.678_913_231_603_47,
    },
    transform: {
      position: {
        x: -676.630_795_356_064_5,
        y: 3_366.782_971_820_580_3,
      },
      rotation: 90,
      zIndex: 0,
    },
    uid: 'ruvttcm884ct5luzv67270av',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 37_527.194_489_394_68,
      height: 205.228_542_897_599_25,
    },
    transform: {
      position: {
        x: 248.621_295_252_371_06,
        y: 8_453.436_305_742_476,
      },
      rotation: 0,
      zIndex: 0,
    },
    uid: 'cxmz94liwbz7uda4pjdkk2sj',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 190.495_376_623_239_28,
      height: 1_128.178_820_080_632_2,
    },
    transform: {
      position: {
        x: 11_664.113_474_913_042,
        y: 14.262_340_883_805_166,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ks16ze1amc8kmjn0rpr1xpws',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 73.766_359_398_851_48,
      height: 189.363_853_925_418_43,
    },
    transform: {
      position: {
        x: -683.134_249_817_495_6,
        y: 482.295_897_035_316_8,
      },
      rotation: -0.903_440_835_362_379,
      zIndex: 100,
    },
    uid: 'svegk6cwg7n3v1p7a4quj17l',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 76.470_481_079_505_02,
      height: 199.257_427_360_420_93,
    },
    transform: {
      position: {
        x: -1_010.761_104_415_244_9,
        y: 482.499_952_669_738_4,
      },
      rotation: -0.689_757_852_130_013_4,
      zIndex: 100,
    },
    uid: 'pkxc7i1gtw14twq7pr4jli17',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 14_383.477_153_249_76,
      height: 67.164_742_758_611_06,
    },
    transform: {
      position: {
        x: -8_228.020_388_065_765,
        y: 603.103_921_245_622_2,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'uh3vkf4myr8k10ey7997chvz',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 66.837_669_475_999_06,
      height: 15.316_965_921_582_778,
    },
    transform: {
      position: {
        x: 2_291.169_616_890_133,
        y: 37.333_846_124_558_25,
      },
      rotation: 37.987_372_246_680_68,
      zIndex: 100,
    },
    uid: 'o1off2hi2av8wjmjpmlnxu96',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 44.245_584_320_460_694,
      height: 402.498_616_156_815_84,
    },
    transform: {
      position: {
        x: -1_155.144_115_472_718_8,
        y: 6_131.159_806_622_591,
      },
      rotation: 45.706_790_284_749_204,
      zIndex: 100,
    },
    uid: 'nvhev75cznyjzu23iqv70wog',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 364.474_523_109_040_55,
      height: 54.418_815_569_922_12,
    },
    transform: {
      position: {
        x: -1_451.087_898_334_153_6,
        y: 6_347.682_466_429_699,
      },
      rotation: -26.089_269_841_777_785,
      zIndex: 100,
    },
    uid: 'jhxva17214i4shssn7e852uu',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 812.893_462_308_818,
      height: 98.308_023_775_273_8,
    },
    transform: {
      position: {
        x: 8_539.449_794_149_115,
        y: 5_480.817_008_785_678,
      },
      rotation: -18.152_705_886_650_875,
      zIndex: 100,
    },
    uid: 'ahajdlruayhkuj8obhgnjj1q',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 216.744_039_462_866_57,
      height: 889.859_961_633_324_1,
    },
    transform: {
      position: {
        x: -13_789.367_555_728_102,
        y: 129.223_802_123_228_15,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'xu1hqh39urmcgvaaikhegmc5',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 187.177_719_923_267_43,
      height: 12_155.638_174_755_768,
    },
    transform: {
      position: {
        x: -18_572.256_089_404_636,
        y: 2_262.826_310_312_304_5,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'ci4a7un2v6jspwti16yw1lwq',
    tags: [],
  },
  {
    entity: '@dreamlab/Solid',
    args: {
      width: 160.865_168_539_325_17,
      height: 7_717.370_923_540_696,
    },
    transform: {
      position: {
        x: 11_657.262_103_065_324,
        y: 4_492.568_871_139_309,
      },
      rotation: 0,
      zIndex: 100,
    },
    uid: 'xh6ktuib0off5t8c9v49bht0',
    tags: [],
  },
]
