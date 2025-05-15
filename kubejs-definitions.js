export const kubeJSDefinitions = {
    // Basic KubeJS event types
    eventTypes: [
        'ServerEvents',
        'ClientEvents',
        'StartupEvents',
        'WorldEvents',
        'PlayerEvents',
        'BlockEvents',
        'ItemEvents',
        'EntityEvents',
        'RecipeEvents'
    ],

    // Common KubeJS methods and their descriptions
    methods: {
        'ServerEvents.recipes': {
            completion: 'ServerEvents.recipes(event => { ... })',
            description: 'Register recipe modifications'
        },
        'ServerEvents.tags': {
            completion: 'ServerEvents.tags(event => { ... })',
            description: 'Modify item/block/fluid tags'
        },
        'StartupEvents.registry': {
            completion: 'StartupEvents.registry(event => { ... })',
            description: 'Register custom items, blocks, etc.'
        },
        'ClientEvents.init': {
            completion: 'ClientEvents.init(event => { ... })',
            description: 'Runs when the client is initializing'
        }
    },

    // Common KubeJS properties
    properties: {
        'event.remove': {
            completion: 'event.remove({id: "minecraft:..."})',
            description: 'Removes recipes matching the filter'
        },
        'event.shaped': {
            completion: 'event.shaped(output, [pattern], {key: value})',
            description: 'Adds a shaped crafting recipe'
        },
        'event.smelting': {
            completion: 'event.smelting(output, input)',
            description: 'Adds a smelting recipe'
        },
        'event.create': {
            completion: 'event.create("id").displayName("Name")',
            description: 'Creates a new custom item'
        }
    },

    // Templates for different script types
    templates: {
        startup: `// Startup scripts run once during game startup
// Use this for things like item/block registration

StartupEvents.registry('item', event => {
  // Register new items
  event.create('example_item')
    .displayName('Example Item')
    .tooltip('This is an example item')
    .maxStackSize(16)
})

StartupEvents.registry('block', event => {
  // Register new blocks
  event.create('example_block')
    .displayName('Example Block')
    .material('stone')
    .hardness(1.5)
    .resistance(3.0)
})
`,
        server: `// Server scripts run when a world is loaded
// Use this for things like recipe modifications

ServerEvents.recipes(event => {
  // Remove recipes
  event.remove({id: 'minecraft:furnace'})

  // Add shaped recipes
  event.shaped(
    Item.of('minecraft:diamond', 1), // output
    [
      'AAA', // crafting pattern
      'A A',
      'AAA'
    ],
    {
      A: 'minecraft:iron_ingot' // pattern key
    }
  )

  // Add smelting recipes
  event.smelting('minecraft:gold_ingot', 'minecraft:iron_ingot')
})

ServerEvents.tags('item', event => {
  // Add items to tags
  event.add('minecraft:planks', 'minecraft:stone')
  
  // Remove items from tags
  event.remove('minecraft:logs', 'minecraft:oak_log')
})
`,
        client: `// Client scripts run on the client side only
// Use this for things like JEI integration, tooltips, etc.

ClientEvents.init(event => {
  console.log('Client initialization')
})

ItemEvents.tooltip(event => {
  // Add tooltip to an item
  event.add('minecraft:diamond', '§bVery shiny!')
})

ClientEvents.lang(event => {
  // Change displayed item names
  event.add('item.minecraft.diamond', 'Shiny Mineral')
})
`,
        craftingShapedRecipe: `// Shaped crafting recipe template

ServerEvents.recipes(event => {
  event.shaped(
    Item.of('minecraft:diamond', 1), // output item with count
    [
      'AAA', // crafting pattern (3x3 grid)
      'B B', // A, B, C, etc. represent items in the pattern
      'CCC'
    ],
    {
      A: 'minecraft:iron_ingot',  // A = iron ingot
      B: 'minecraft:gold_ingot',  // B = gold ingot
      C: 'minecraft:copper_ingot' // C = copper ingot
    }
  )
})`,
        craftingShapelessRecipe: `// Shapeless crafting recipe template

ServerEvents.recipes(event => {
  event.shapeless(
    Item.of('minecraft:diamond', 1), // output item with count
    [
      'minecraft:iron_ingot',  // List all ingredients
      'minecraft:gold_ingot',
      'minecraft:emerald'
    ]
  )
})`,
        smeltingRecipe: `// Smelting recipe template

ServerEvents.recipes(event => {
  event.smelting(
    'minecraft:gold_ingot',  // output item
    'minecraft:iron_ingot'   // input item
  ).xp(1.0)                  // optional: set XP
   .cookingTime(100)         // optional: cook time in ticks (200 = 10 seconds)
})`,
        blastingRecipe: `// Blasting recipe template

ServerEvents.recipes(event => {
  event.blasting(
    'minecraft:gold_ingot',  // output item
    'minecraft:iron_ingot'   // input item
  ).xp(0.7)                  // optional: set XP
   .cookingTime(50)          // optional: cook time in ticks (100 = 5 seconds)
})`,
        smokingRecipe: `// Smoking recipe template

ServerEvents.recipes(event => {
  event.smoking(
    'minecraft:cooked_beef',  // output item
    'minecraft:beef'          // input item
  ).xp(0.35)                  // optional: set XP
   .cookingTime(100)          // optional: cook time in ticks
})`,
        campfireCookingRecipe: `// Campfire cooking recipe template

ServerEvents.recipes(event => {
  event.campfireCooking(
    'minecraft:cooked_chicken',  // output item
    'minecraft:chicken'          // input item
  ).cookingTime(600)             // cooking time in ticks (600 = 30 seconds)
})`,
        stonecuttingRecipe: `// Stonecutting recipe template

ServerEvents.recipes(event => {
  event.stonecutting(
    'minecraft:stone_brick_stairs', // output item
    'minecraft:stone_bricks'        // input item
  ).id('kubejs:stone_brick_stairs_from_stone_bricks') // optional: recipe ID
})`,
        smithingRecipe: `// Smithing recipe template

ServerEvents.recipes(event => {
  event.smithing(
    'minecraft:netherite_sword',  // output item
    'minecraft:diamond_sword',    // base item
    'minecraft:netherite_ingot'   // addition item
  )
})`,
        customRecipeRemoval: `// Recipe removal template

ServerEvents.recipes(event => {
  // Remove by recipe ID
  event.remove({id: 'minecraft:furnace'})
  
  // Remove by output item
  event.remove({output: 'minecraft:golden_shovel'})
  
  // Remove by input
  event.remove({input: 'minecraft:diamond'})
  
  // Remove by mod
  event.remove({mod: 'examplemod'})
  
  // Remove by type
  event.remove({type: 'minecraft:crafting_shaped'})
  
  // Complex removal (AND condition)
  event.remove({
    output: 'minecraft:iron_ingot',
    type: 'minecraft:smelting'
  })
})`,
        lootTableModification: `// Loot table modification template

LootJS.modifiers(event => {
  // Add an item to grass drops
  event.addBlockLootModifier('minecraft:grass')
    .addWeightedLoot([
      Item.of('minecraft:diamond').withChance(0.01),  // 1% chance
      Item.of('minecraft:emerald').withChance(0.02)   // 2% chance
    ])
  
  // Modify mob drops
  event.addEntityLootModifier('minecraft:zombie')
    .addLoot('minecraft:emerald')         // Always drops
    .removeLoot('minecraft:rotten_flesh') // Remove original drop
})`,
        itemRegistration: `// Item registration template

StartupEvents.registry('item', event => {
  // Basic item
  event.create('example_item')
    .displayName('Example Item')        // Display name
    .tooltip('This is my custom item')  // Tooltip
    .rarity('epic')                     // Rarity (common, uncommon, rare, epic)
    .glow(true)                         // Add enchantment glint
    .maxStackSize(16)                   // Set stack size
  
  // Food item
  event.create('example_food')
    .displayName('Example Food')
    .food(food => {
      food.hunger(8)           // Hunger points
          .saturation(0.8)     // Saturation modifier
          .effect('speed', 200, 1, 1.0)  // Potion effect: id, duration, amplifier, probability
          .alwaysEdible()      // Can eat even when not hungry
    })
})`,
        blockRegistration: `// Block registration template

StartupEvents.registry('block', event => {
  // Basic block
  event.create('example_block')
    .displayName('Example Block')  // Display name
    .material('stone')            // Material type
    .hardness(1.5)                // Mining hardness
    .resistance(3.0)              // Explosion resistance
    .requiresTool(true)           // Requires correct tool to drop
    .tagBlock('minecraft:mineable/pickaxe') // Mining tag
    
  // Light emitting block
  event.create('glowing_block')
    .displayName('Glowing Block')
    .material('glass')
    .lightLevel(15)              // Light level (0-15)
    .transparent(true)           // Is transparent
})`,
        probeJsBasic: `// ProbeJS template - Basic usage
// Required ProbeJS mod

// This will output all Minecraft items to the console on startup
StartupEvents.startup(event => {
  console.log('ProbeJS Basic Template')
  
  // Print all iron-related items to console
  console.log(Item.getList().filter(item => item.id.includes('iron')))
  
  // Print all block-related tags
  console.log(Tag.getType('block').getTagKeys())
})`,
        probeJsRecipeExplorer: `// ProbeJS template - Recipe Explorer
// Required ProbeJS mod

StartupEvents.postInit(event => {
  // Get and print all recipes with gold ingot as output
  const goldRecipes = Recipe.getRecipes().filter(recipe => {
    const output = recipe.getOriginalResultItem()
    return output && output.id === 'minecraft:gold_ingot'
  })
  
  // Print each recipe's inputs
  goldRecipes.forEach(recipe => {
    console.log('Recipe inputs for ' + recipe.getId() + ':')
    console.log(recipe.getIngredients())
  })
})`,
        createMechanical: `// KubeJS Create Template - Mechanical Crafting

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Add a mechanical crafting recipe
  event.recipes.createMechanicalCrafting(
    Item.of('minecraft:diamond_sword', '{display:{Name:\'{"text":"Mechanical Blade"}\',Lore:[\'{"text":"Crafted with precision"}\']},"Enchantments":[{"id":"minecraft:sharpness","lvl":5}]}'), 
    [
      '  A',
      ' A ',
      'B  '
    ],
    {
      A: 'create:precision_mechanism',
      B: 'minecraft:diamond_sword'
    }
  )
  
  // Add a crushing recipe
  event.recipes.createCrushing(
    [
      Item.of('minecraft:diamond').withChance(0.75),
      Item.of('minecraft:diamond_dust').withChance(0.25).toResultJson()
    ],
    'minecraft:diamond_ore'
  )
})`,
        createMixing: `// KubeJS Create Template - Mixing and Processing

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Mixing recipe - heated (smelting)
  event.recipes.createMixing(
    Fluid.of('minecraft:lava', 500),
    [
      'minecraft:cobblestone',
      'minecraft:cobblestone',
      'minecraft:cobblestone',
      'minecraft:cobblestone'
    ]
  ).heated()
  
  // Mixing recipe - superheated (blasting)
  event.recipes.createMixing(
    '3x minecraft:gold_ingot',
    [
      '2x minecraft:iron_ingot',
      'minecraft:redstone',
      Fluid.of('minecraft:lava', 250)
    ]
  ).superheated()
  
  // Mixing recipe - no heat
  event.recipes.createMixing(
    Fluid.of('minecraft:water', 1000),
    [
      'minecraft:ice'
    ]
  )
})`,
        createSequencedAssembly: `// KubeJS Create Template - Sequenced Assembly

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Sequenced assembly recipe
  event.recipes.createSequencedAssembly(
    [
      'create:precision_mechanism' // Output item
    ],
    'create:golden_sheet', // Input item
    [
      // Sequence of operations
      event.recipes.createDeploying(
        'create:incomplete_precision_mechanism',
        ['create:incomplete_precision_mechanism', 'create:cogwheel']
      ),
      event.recipes.createDeploying(
        'create:incomplete_precision_mechanism',
        ['create:incomplete_precision_mechanism', 'create:large_cogwheel']
      ),
      event.recipes.createDeploying(
        'create:incomplete_precision_mechanism',
        ['create:incomplete_precision_mechanism', 'minecraft:iron_nugget']
      ),
      event.recipes.createPressing(
        'create:incomplete_precision_mechanism',
        'create:incomplete_precision_mechanism'
      )
    ]
  ).transitionalItem('create:incomplete_precision_mechanism')
   .loops(3) // Number of loops through the sequence
})`,
        createCompacting: `// KubeJS Create Template - Compacting

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic compacting recipe
  event.recipes.createCompacting(
    'minecraft:diamond',
    ['9x minecraft:coal_block']
  )
  
  // Compacting with fluids
  event.recipes.createCompacting(
    'minecraft:blue_ice',
    [
      '4x minecraft:packed_ice',
      Fluid.of('minecraft:water', 250)
    ]
  )
  
  // Heated compacting (like pressing but with heat)
  event.recipes.createCompacting(
    'minecraft:netherite_ingot',
    [
      '4x minecraft:netherite_scrap', 
      '4x minecraft:gold_ingot'
    ]
  ).heated()
})`,
        createCutting: `// KubeJS Create Template - Cutting

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic cutting recipe
  event.recipes.createCutting(
    ['4x minecraft:oak_planks'],
    'minecraft:oak_log'
  )
  
  // Cutting with multiple outputs
  event.recipes.createCutting(
    [
      '6x minecraft:stick',
      Item.of('minecraft:sawdust').withChance(0.5)
    ],
    'minecraft:oak_planks'
  )
  
  // Cutting with processing time
  event.recipes.createCutting(
    'minecraft:stripped_dark_oak_log',
    'minecraft:dark_oak_log'
  ).processingTime(50) // 50 ticks processing time
})`,
        createFilling: `// KubeJS Create Template - Filling

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic filling recipe
  event.recipes.createFilling(
    'minecraft:water_bucket',
    [
      'minecraft:bucket',
      Fluid.of('minecraft:water', 1000)
    ]
  )
  
  // Complex filling recipe
  event.recipes.createFilling(
    'minecraft:potion{Potion:"minecraft:healing"}',
    [
      'minecraft:glass_bottle',
      Fluid.of('create:honey', 250)
    ]
  )
  
  // Filling recipe with nbt data
  event.recipes.createFilling(
    Item.of('minecraft:potion').withNBT({Potion:"minecraft:strong_swiftness"}),
    [
      'minecraft:potion{Potion:"minecraft:swiftness"}',
      Fluid.of('minecraft:experience', 100)
    ]
  )
})`,
        createItemApplication: `// KubeJS Create Template - Item Application

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic item application (like crafting with a deployer)
  event.recipes.createItemApplication(
    'minecraft:pumpkin_pie',
    [
      'minecraft:pumpkin',
      'minecraft:sugar'
    ]
  )
  
  // Tool application
  event.recipes.createItemApplication(
    'minecraft:stripped_oak_log',
    [
      'minecraft:oak_log',
      'minecraft:iron_axe'
    ]
  )
  
  // NBT-sensitive application
  event.recipes.createItemApplication(
    'minecraft:enchanted_golden_apple',
    [
      'minecraft:golden_apple',
      Item.of('minecraft:enchanted_book').withNBT({StoredEnchantments:[{id:"minecraft:protection",lvl:4}]})
    ]
  )
})`,
        mekanismGasProcessing: `// KubeJS Mekanism Template - Gas Processing

// Required mod: KubeJS Mekanism

ServerEvents.recipes(event => {
  // Gas conversion recipe
  event.recipes.mekanismGasConversion(
    { gas: 'mekanism:oxygen', amount: 100 },
    { gas: 'mekanism:hydrogen', amount: 200 }
  )
  
  // Oxidizing recipe
  event.recipes.mekanismOxidizing(
    { gas: 'mekanism:oxygen', amount: 10 },
    '#forge:ingots/copper'
  )
  
  // Chemical infusing recipe
  event.recipes.mekanismChemicalInfusing(
    { gas: 'mekanism:sulfuric_acid', amount: 1 },
    { gas: 'mekanism:hydrogen', amount: 1 },
    { gas: 'mekanism:hydrogen_chloride', amount: 1 }
  )
})`,
        mekanismEnrichment: `// KubeJS Mekanism Template - Enrichment and Processing

// Required mod: KubeJS Mekanism

ServerEvents.recipes(event => {
  // Enriching recipe
  event.recipes.mekanismEnriching(
    '3x minecraft:glowstone_dust',
    'minecraft:glowstone'
  )
  
  // Crushing recipe
  event.recipes.mekanismCrushing(
    '4x minecraft:sand',
    'minecraft:sandstone'
  )
  
  // Purifying recipe
  event.recipes.mekanismPurifying(
    '3x minecraft:netherite_scrap',
    'minecraft:ancient_debris',
    { gas: 'mekanism:oxygen', amount: 10 }
  )
  
  // Metallurgic infusing recipe
  event.recipes.mekanismMetallurgicInfusing(
    'minecraft:netherite_ingot',
    'minecraft:diamond',
    { infuse_type: 'mekanism:diamond', amount: 80 }
  )
})`,
        mekanismReactors: `// KubeJS Mekanism Template - Fission and Fusion

// Required mod: KubeJS Mekanism

ServerEvents.recipes(event => {
  // Fission reactor recipe
  event.recipes.mekanismFission(
    { gas: 'mekanism:nuclear_waste', amount: 2 },
    { gas: 'mekanism:fissile_fuel', amount: 1 }
  ).coolingRate(50)
  
  // Fusion reactor recipe
  event.recipes.mekanismFusion(
    'mekanism:tritium',
    'mekanism:deuterium',
    'mekanism:helium'
  ).energy(1000000)
})`,
        customEvent: `// KubeJS Custom Event Template

// Define a custom event
StartupEvents.registry('item', event => {
  // Create a wand that will trigger our custom event
  event.create('magic_wand')
    .displayName('Magic Wand')
    .tooltip('Right-click to cast a spell')
})

// Listen for the wand being used
ItemEvents.rightClicked('kubejs:magic_wand', event => {
  // Trigger our own custom event
  event.server.runCommandSilent(\`execute as \${event.player.username} at @s run function kubejs:trigger_spell\`)
  
  // Add cooldown
  event.item.cooldown = 20 // 1 second cooldown
})

// Custom event handler for spell casting
ServerEvents.command('kubejs:trigger_spell', event => {
  // Cast spell effects
  const player = event.player
  const level = player.level
  
  // Create particle effects
  level.spawnParticle('minecraft:end_rod', player.x, player.y + 1, player.z, 30, 0.5, 0.5, 0.5, 0.1)
  
  // Apply potion effects
  player.potionEffects.add('minecraft:regeneration', 200, 1)
  player.potionEffects.add('minecraft:speed', 400, 0)
  
  // Play sound
  level.playSound('minecraft:entity.illusioner.cast_spell', player.x, player.y, player.z, 1.0, 1.0)
})`,
        playerEvents: `// KubeJS Player Events Template

// Player login event
PlayerEvents.loggedIn(event => {
  // Get the player
  const player = event.player
  
  // Check if this is the first time logging in
  if (!player.stages.has('first_login')) {
    // Send welcome message
    player.tell([
      Text.of('Welcome to the server, ').gold(),
      Text.of(player.name).darkGreen(),
      Text.of('! Here\'s a starter kit.').gold()
    ])
    
    // Give starter items
    player.give('minecraft:stone_sword')
    player.give('minecraft:bread', 16)
    player.give('minecraft:torch', 32)
    
    // Mark player as having logged in
    player.stages.add('first_login')
  } else {
    // Send welcome back message
    player.tell([
      Text.of('Welcome back, ').aqua(),
      Text.of(player.name).darkGreen(),
      Text.of('!').aqua()
    ])
  }
})

// Player tick event (runs every tick for each player)
PlayerEvents.tick(event => {
  // Get the player
  const player = event.player
  
  // Every 5 seconds (100 ticks) on average
  if (Math.random() < 0.01) {
    // Heal player slightly if they're below max health
    if (player.health < player.maxHealth) {
      player.heal(1)
      player.sendData('kubejs:heal_effect', {})
    }
  }
})

// Player death event
PlayerEvents.died(event => {
  // Get the player and death location
  const player = event.player
  const x = Math.floor(player.x)
  const y = Math.floor(player.y)
  const z = Math.floor(player.z)
  
  // Send death coordinates
  player.tell([
    Text.of('You died at coordinates: ').red(),
    Text.of(\`\${x}, \${y}, \${z}\`).yellow()
  ])
})`,
        commandRegistration: `// KubeJS Command Registration Template

// Register a custom command
ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  // Register a basic command
  event.register(
    Commands.literal('heal')
      .requires(src => src.hasPermission(2)) // Requires permission level 2 (usually op)
      .executes(ctx => {
        // Get the player from context
        const player = ctx.source.player
        
        // Heal player to max health
        player.health = player.maxHealth
        
        // Send confirmation message
        player.tell('You have been healed!')
        
        return 1
      })
  )
  
  // Command with arguments
  event.register(
    Commands.literal('award')
      .requires(src => src.hasPermission(2))
      .then(Commands.argument('player', Arguments.PLAYER.create(event))
        .then(Commands.argument('item', Arguments.ITEM_STACK.create(event))
          .then(Commands.argument('count', Arguments.INTEGER.create(event))
            .executes(ctx => {
              // Get arguments
              const player = Arguments.PLAYER.getResult(ctx, 'player')
              const item = Arguments.ITEM_STACK.getResult(ctx, 'item')
              const count = Arguments.INTEGER.getResult(ctx, 'count')
              
              // Clone the item and set count
              const itemToGive = item.withCount(count)
              
              // Give item to player
              player.give(itemToGive)
              
              // Send confirmation
              ctx.source.sendSuccess(
                Text.of(\`Gave \${count}x \${item.id} to \${player.name}\`),
                true
              )
              
              return count
            })
          )
        )
      )
  )
})`,
        worldGeneration: `// KubeJS World Generation Template

// Modify ore generation
WorldgenEvents.add(event => {
  // Add custom ore to overworld
  event.addOre(ore => {
    ore.id = 'kubejs:example_ore_generation'      // Optional: Custom ID
    
    // Where to generate
    ore.biomes = '#minecraft:is_overworld'        // Biome tag or specific biome
    
    // What to place
    ore.addBlock('minecraft:emerald_ore', 1)      // Block with weight
    ore.addBlock('minecraft:diamond_ore', 0.2)    // Block with 20% chance
    
    // Generation settings
    ore.count([5, 8])                             // Veins per chunk (min, max)
    ore.size = 5                                  // Vein size
    
    // Height range settings (y level)
    ore.squared = true                            // Squared distribution
    ore.minY = -64                                // Min Y level
    ore.maxY = 32                                 // Max Y level
    
    // Optional: Placement settings
    ore.noSurface = 0.4                           // 40% chance to discard if exposed to air
    ore.worldgenLayer = 'underground_ores'        // Generation layer
  })
})

// Add custom placed features (like trees, rocks, etc)
WorldgenEvents.add(event => {
  // Add a feature that places diamond blocks on mountain tops
  event.addFeature('kubejs:diamond_peaks', feature => {
    feature.biomes = '#minecraft:is_mountain'
    
    // Configuration
    feature.count = 1                             // Features per chunk
    feature.chance = 0.03                         // 3% chance per chunk
    
    // What to place
    feature.block = 'minecraft:diamond_block'
    
    // Placement configuration
    feature.placement = 'minecraft:heightmap'     // Place at the highest point
    feature.minY = 120                            // Min Y level restriction
    feature.maxY = 256                            // Max Y level restriction
  })
})`
    }
};