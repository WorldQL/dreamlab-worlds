import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    "entity": "@dreamlab/InventoryItem",
    "args": {
      "width": 200,
      "height": 200,
      "displayName": "Basic Bow",
      "animationName": "bow",
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/bow-1702293278974.png",
      "damage": 1,
      "lore": "Once wielded by 'Sharp-Eye' Sam, the fastest archer in the West, this bow's arrows are said to whistle with the winds of the prairie and never miss a zombie's heart.",
      "bone": "handRight",
      "anchorX": 0.5,
      "anchorY": 0.5,
      "rotation": 0,
      "projectileType": "SINGLE_SHOT"
    },
    "transform": {
      "position": {
        "x": 800,
        "y": 300
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "hed17ymwbvrywm2ib5ei7pf4"
  },
  {
    "entity": "@dreamlab/InventoryItem",
    "args": {
      "width": 200,
      "height": 200,
      "displayName": "Scatter Shot Shotgun",
      "animationName": "shoot",
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/hand_cannon-1702293310960.png",
      "damage": 1,
      "lore": "Forged in a lawless frontier town, this shotgun's scatter shot was the bane of undead hordes, turning any cowboy into a one-person army against the zombie outbreak.",
      "bone": "handLeft",
      "anchorX": 0.29,
      "anchorY": 0.58,
      "rotation": 45,
      "projectileType": "SCATTER_SHOT"
    },
    "transform": {
      "position": {
        "x": 1300,
        "y": 300
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "clxd8mnwzde5zw6l9lz3jx31"
  },
  {
    "entity": "@dreamlab/InventoryItem",
    "args": {
      "width": 200,
      "height": 200,
      "displayName": "Burst Revolver",
      "animationName": "shoot",
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/classic_revolver-1702293335440.png",
      "damage": 1,
      "lore": "Crafted by the legendary gunsmith 'Bullseye' Betty, this revolver's rapid bursts made it a favorite among cowboys holding the line in the great zombie sieges of the Old West.",
      "bone": "handLeft",
      "anchorX": 0.24,
      "anchorY": 0.6,
      "rotation": 60,
      "projectileType": "BURST_SHOT"
    },
    "transform": {
      "position": {
        "x": 1800,
        "y": 300
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "dyvqv4qv8z1i3oou0334gd4a"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 200,
      "height": 100
    },
    "transform": {
      "position": {
        "x": 800,
        "y": 475
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "fscrggsjjdnkqe4t753qm02q"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 200,
      "height": 100
    },
    "transform": {
      "position": {
        "x": 1300,
        "y": 475
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "pxuhvvyt5yf3q8jxqo5dni2y"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 200,
      "height": 100
    },
    "transform": {
      "position": {
        "x": 1800,
        "y": 475
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "nvoqs8v3heo33ka8j83z1svk"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 2004.8725104173352,
      "height": 2004.8725104173352,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/house-1702315676825.png"
    },
    "transform": {
      "position": {
        "x": -3978.302828128957,
        "y": 228.9959692194941
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "dzbswpsob31y0l3xfkaomam5"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 707.9912664402166,
      "height": 707.9912664402166,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/well-1702315700504.png"
    },
    "transform": {
      "position": {
        "x": -858.6975370837622,
        "y": 272.905102513001
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "tyh7kgvgmxvj6piaa21b9rz1"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 2715.6788291297125,
      "height": 2066.25137412972,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/saloon-1702315686818.png"
    },
    "transform": {
      "position": {
        "x": 6386.6391637121405,
        "y": -104.66910049176278
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "kefez2nqgl39tt5xbkbt5cil"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 1788.5120084917253,
      "height": 1892.7079516306353,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/house2-1702315679205.png"
    },
    "transform": {
      "position": {
        "x": 11592.249455811052,
        "y": 162.68157741223166
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "n0ebhp9ac5zk9g6rl5va8znu"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 1187.3407475265667,
      "height": 1187.3407475265667,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/sandstorm-1702315724505.png"
    },
    "transform": {
      "position": {
        "x": 13149.115374475236,
        "y": -530.073478551811
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "d5z5iy7cd9xf03vabrzw9pes"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 2921.7649723255927,
      "height": 2921.7649723255927,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/clouds3-1702315741331.png"
    },
    "transform": {
      "position": {
        "x": 12910.48964336852,
        "y": -1492.452960710683
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "tmn4qpwlijfyz5cbf8umr4cz"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 2300.622938805427,
      "height": 2300.622938805427,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/house3-1702315681242.png"
    },
    "transform": {
      "position": {
        "x": 9449.184532799854,
        "y": -274.4487075734194
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "o63fkph34lc455bn5mukqmtn"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 1611.1396115793332,
      "height": 1611.1396115793332,
      "spriteSource": "https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1701998278789.png"
    },
    "transform": {
      "position": {
        "x": -896.3308544068495,
        "y": -1178.2703351959149
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "utjss59qijl87o93ewt2dj5h"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 946.3814584096732,
      "height": 946.3814584096732,
      "spriteSource": "https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1702241095704.png"
    },
    "transform": {
      "position": {
        "x": 1305.7665074213355,
        "y": 388.311077063489
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "wo7xyvz6d6hp1hh0eeh72zwn"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 2804.238443087931,
      "height": 2804.238443087931
    },
    "transform": {
      "position": {
        "x": 1443.0866882585988,
        "y": -1605.093100290853
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "zaffccj7z3d8tskq1j2mtj5l"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 1662.7336020520345,
      "height": 921.802858189813,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/desert1-1702315672978.png"
    },
    "transform": {
      "position": {
        "x": -1999.6297842573888,
        "y": 3925.182452074518
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "ntrqii9ndfog7icdgdjfwvvf"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 1373.4334921216564,
      "height": 1373.4334921216564,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/ground1-1702315694241.png"
    },
    "transform": {
      "position": {
        "x": -1664.6876830354445,
        "y": 4806.431459243002
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "sc10rxezt5ismhmltrdisi6r"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 946.6625835596278,
      "height": 946.6625835596278,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/underground-1702315769040.png"
    },
    "transform": {
      "position": {
        "x": -220.89846971463064,
        "y": 1375.5685196866116
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "wq3s1zsgqkf17ylmmzeaglxe"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 953.5994349194698,
      "height": 953.5994349194698,
      "spriteSource": "https://dreamlab-user-assets.s3.us-east-1.amazonaws.com/uploaded-from-editor/1702241555772.png"
    },
    "transform": {
      "position": {
        "x": -218.638125070991,
        "y": 429.88172110097616
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "qf53dgdwhi2ib8m300hj3poq"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 100,
      "height": 100
    },
    "transform": {
      "position": {
        "x": -871.4412683088628,
        "y": 1231.276713611232
      },
      "rotation": -0.2067964113426024,
      "zIndex": 100
    },
    "uid": "vhvy2t374m149nq8gt1nmm7s"
  },
  {
    "entity": "@dreamlab/Nonsolid",
    "args": {
      "width": 334.2694411590519,
      "height": 334.2694411590519,
      "spriteSource": "https://s3-assets.dreamlab.gg/uploaded-from-editor/brick-1702315735760.png"
    },
    "transform": {
      "position": {
        "x": -2406.426852214552,
        "y": 3432.7074531913163
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "p8ar1ycsx4f65gdbmm4k3wnt"
  },
  {
    "entity": "@dreamlab/Region",
    "args": {
      "width": 4000,
      "height": 1100
    },
    "transform": {
      "position": {
        "x": 0,
        "y": 4000
      },
      "rotation": 0,
      "zIndex": 0
    }
  },
  {
    "entity": "@dreamlab/Region",
    "args": {
      "width": 4000,
      "height": 1100
    },
    "transform": {
      "position": {
        "x": -5000,
        "y": 4000
      },
      "rotation": 0,
      "zIndex": 0
    }
  },
  {
    "entity": "@dreamlab/Region",
    "args": {
      "width": 4000,
      "height": 1100
    },
    "transform": {
      "position": {
        "x": 5000,
        "y": 4000
      },
      "rotation": 0,
      "zIndex": 0
    }
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 21782.98488570166,
      "height": 123.83328909336842
    },
    "transform": {
      "position": {
        "x": 10190.106266031516,
        "y": 611.7259069256127
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "jtgnqqzvcf81bfn8dvxve5ld"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 3000,
      "height": 100
    },
    "transform": {
      "position": {
        "x": -1000,
        "y": 2170
      },
      "rotation": 90,
      "zIndex": 0
    },
    "uid": "eydc375n6kgxu4sdunbusbye"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 3000,
      "height": 100
    },
    "transform": {
      "position": {
        "x": -650,
        "y": 2170
      },
      "rotation": 90,
      "zIndex": 0
    },
    "uid": "ruvttcm884ct5luzv67270av"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 25000,
      "height": 200
    },
    "transform": {
      "position": {
        "x": 550,
        "y": 4620
      },
      "rotation": 0,
      "zIndex": 0
    },
    "uid": "cxmz94liwbz7uda4pjdkk2sj"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 190.49537662323928,
      "height": 1128.1788200806322
    },
    "transform": {
      "position": {
        "x": 14503.08197372847,
        "y": -30.54984352066407
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "ks16ze1amc8kmjn0rpr1xpws"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 66.16159127819992,
      "height": 179.70468617106712
    },
    "transform": {
      "position": {
        "x": -679.5638439783629,
        "y": 467.18140701759586
      },
      "rotation": -0.903440835362379,
      "zIndex": 100
    },
    "uid": "svegk6cwg7n3v1p7a4quj17l"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 69.38649505680223,
      "height": 170.46382483425623
    },
    "transform": {
      "position": {
        "x": -1016.4726331289852,
        "y": 464.2544037247921
      },
      "rotation": -0.6897578521300134,
      "zIndex": 100
    },
    "uid": "pkxc7i1gtw14twq7pr4jli17"
  },
  {
    "entity": "@dreamlab/Solid",
    "args": {
      "width": 660.8858603738872,
      "height": 95.85447805989315
    },
    "transform": {
      "position": {
        "x": 1364.5643503646534,
        "y": 4142.044253543931
      },
      "rotation": 0,
      "zIndex": 100
    },
    "uid": "nj4dl05qu36qzg7hyf9750dc"
  }
]