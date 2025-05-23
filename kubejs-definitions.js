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
})

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
})`,
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
})`,
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
        createCrushing: `// KubeJS Create Template - Crushing

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic crushing recipe
  event.recipes.createCrushing(
    'minecraft:gravel',
    'minecraft:cobblestone'
  )
  
  // Crushing with multiple outputs and chances
  event.recipes.createCrushing(
    [
      Item.of('minecraft:diamond').withChance(0.1),
      Item.of('minecraft:emerald').withChance(0.05),
      Item.of('minecraft:coal', 2).withChance(0.4)
    ],
    'minecraft:diamond_ore'
  )
  
  // Crushing with processing time
  event.recipes.createCrushing(
    '3x minecraft:bone_meal',
    'minecraft:bone'
  ).processingTime(150) // 150 ticks processing time
})`,
        createMilling: `// KubeJS Create Template - Milling

// Required mod: KubeJS Create

ServerEvents.recipes(event => {
  // Basic milling recipe
  event.recipes.createMilling(
    'minecraft:wheat',
    'minecraft:hay_block'
  )
  
  // Milling with multiple outputs
  event.recipes.createMilling(
    [
      'minecraft:sugar',
      Item.of('minecraft:sugar').withChance(0.25)
    ],
    'minecraft:sugar_cane'
  )
  
  // Milling with processing time
  event.recipes.createMilling(
    'minecraft:bone_meal',
    'minecraft:white_dye'
  ).processingTime(200) // 200 ticks processing time
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
      Item.of('minecraft:enchanted_book').withNBT({StoredEnchantments:[{id:"minecraft:protection","lvl":4}]})
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
})`,
        enchantmentModification: `// KubeJS Enchantment Modification Template

// Listen for enchantment table events
ItemEvents.enchanted(event => {
  // Get information about the enchantment
  const player = event.player
  const item = event.item
  const enchantsMap = event.enchantments
  
  // Log enchantment info
  console.log(\`\${player.username} enchanted \${item.id} with:\`)
  enchantsMap.forEach((level, enchant) => {
    console.log(\` - \${enchant.id} level \${level}\`)
  })
  
  // Modify enchantment results - for example, boost all enchantments by 1 level
  let modified = false
  enchantsMap.forEach((level, enchant) => {
    if (level < enchant.maxLevel) {
      enchantsMap.put(enchant, level + 1)
      modified = true
    }
  })
  
  // Add a bonus enchantment
  if (Math.random() < 0.25) { // 25% chance
    // Find a suitable enchantment not already on the item
    const possibleEnchants = Registry.ENCHANTMENT.getValues().filter(e => 
      e.canEnchant(item) && !enchantsMap.contains(e)
    )
    
    if (possibleEnchants.length > 0) {
      const randomEnchant = possibleEnchants[Math.floor(Math.random() * possibleEnchants.length)]
      enchantsMap.put(randomEnchant, 1)
      modified = true
    }
  }
  
  if (modified) {
    player.tell([
      Text.of('The enchantment table seems to favor you today!').gold(),
      Text.of(' Your item received bonus enchantments!').darkPurple()
    ])
  }
})`,
        enchantmentRegistration: `// KubeJS Custom Enchantment Registration Template

// Register a custom enchantment during startup
StartupEvents.registry('enchantment', event => {
  // Basic custom enchantment
  event.create('lightning_striker')
    .displayName('Lightning Striker')
    .maxLevel(3)
    .rarity('rare')
    .allowedOn('weapon')
    .allowedOnBooks()
    .conflictsWith('minecraft:fire_aspect')
    .treasureOnly()
    .addCategory('weapon', 'breakable', 'vanishable')
})

// Handle the custom enchantment's functionality
EntityEvents.hurt(event => {
  // Check if the damage was from an entity
  const source = event.source
  const attacker = source.player
  
  if (!attacker) return
  
  // Check if the attacker's item has our enchantment
  const item = attacker.mainHandItem
  
  if (!item.hasEnchantment('kubejs:lightning_striker')) return
  
  // Get the enchantment level
  const level = item.getEnchantmentLevel('kubejs:lightning_striker')
  
  // Get the target entity
  const target = event.entity
  
  // 15% chance per level to summon lightning
  if (Math.random() < 0.15 * level) {
    // Summon lightning at the target's position
    event.entity.level.lightning(target.x, target.y, target.z)
    
    // Apply additional damage based on level
    target.attack(level * 2)
    
    // Create particle effects
    event.level.spawnParticle(
      'minecraft:flash',
      target.x, target.y + 1, target.z,
      10, 0.5, 1.0, 0.5, 0.1
    )
  }
})`,
        xpModification: `// KubeJS XP and Level Modification Template

// Modify XP dropped by blocks
BlockEvents.broken(event => {
  // Get information about the block and player
  const block = event.block
  const player = event.player
  
  if (!player) return
  
  // Increase XP for certain blocks
  if (block.hasTag('minecraft:ores')) {
    // Get the player's position
    const x = player.x
    const y = player.y
    const z = player.z
    
    // Base XP amount
    let xpAmount = 1
    
    // Increase XP based on ore type
    if (block.id.includes('diamond')) {
      xpAmount = 7
    } else if (block.id.includes('emerald')) {
      xpAmount = 6
    } else if (block.id.includes('gold')) {
      xpAmount = 4
    } else if (block.id.includes('iron') || block.id.includes('redstone') || block.id.includes('lapis')) {
      xpAmount = 2
    }
    
    // Spawn XP orbs
    player.level.spawnOrb(x, y, z, xpAmount)
  }
})

// Modify XP from mobs
EntityEvents.death(event => {
  // Get information about the entity and player
  const entity = event.entity
  const source = event.source
  const player = source.player
  
  if (!player || entity.isPlayer()) return
  
  // Get the default XP drop
  let xpDropped = entity.getExperienceDrop(player)
  
  // Modify XP based on conditions
  if (entity.isBoss()) {
    // Double XP for boss mobs
    xpDropped *= 2
    
    // Notify player of bonus XP
    player.tell([
      Text.of('Boss bonus: ').gold(),
      Text.of('+' + xpDropped + ' XP!').green()
    ])
  } else if (entity.level.isThundering() && entity.isMonster()) {
    // 50% more XP during thunderstorms for monsters
    const bonus = Math.floor(xpDropped * 0.5)
    xpDropped += bonus
    
    // Notify player of weather bonus
    player.tell([
      Text.of('Storm bonus: ').blue(),
      Text.of('+' + bonus + ' XP!').green()
    ])
  }
  
  // Override the XP drop amount
  entity.setExperienceDrop(xpDropped)
})`,
        levelSystem: `// KubeJS Custom Level System Template

// Initialize player data
const SKILL_KEY = 'kubejs.skills'

// You can define multiple skills
const SKILLS = {
  MINING: {
    name: 'Mining',
    maxLevel: 100,
    xpPerLevel: level => Math.floor(100 * Math.pow(1.1, level))
  },
  COMBAT: {
    name: 'Combat',
    maxLevel: 100,
    xpPerLevel: level => Math.floor(150 * Math.pow(1.12, level))
  },
  FARMING: {
    name: 'Farming',
    maxLevel: 100,
    xpPerLevel: level => Math.floor(80 * Math.pow(1.09, level))
  }
}

// Initialize player skills on first join
PlayerEvents.loggedIn(event => {
  const { player, server } = event
  
  // Initialize player skills data structure if not present
  let data = player.persistentData
  if (!data.contains(SKILL_KEY)) {
    data.putObject(SKILL_KEY)
    let skills = data.getObject(SKILL_KEY)
    
    // Initialize each skill with level 1 and 0 XP
    Object.keys(SKILLS).forEach(skillId => {
      let skillData = {}
      skillData.level = 1
      skillData.xp = 0
      skills.put(skillId, skillData)
    })
    
    player.tell([
      Text.of('Welcome! ').aqua(),
      Text.of('Your skills have been initialized.').white()
    ])
  }
})

// Function to add XP to a skill
function addSkillXP(player, skillId, amount) {
  if (!player || !SKILLS[skillId]) return false
  
  let data = player.persistentData
  if (!data.contains(SKILL_KEY)) return false
  
  let skills = data.getObject(SKILL_KEY)
  let skillData = skills.get(skillId)
  
  if (!skillData) return false
  
  // Add XP
  skillData.xp += amount
  
  // Check for level up
  const currentLevel = skillData.level
  const xpRequired = SKILLS[skillId].xpPerLevel(currentLevel)
  
  if (skillData.xp >= xpRequired && currentLevel < SKILLS[skillId].maxLevel) {
    // Level up!
    skillData.level++
    skillData.xp -= xpRequired
    
    // Notify player
    player.tell([
      Text.of('Level Up! ').gold(),
      Text.of(SKILLS[skillId].name).green(),
      Text.of(' is now level ').white(),
      Text.of(skillData.level).yellow(),
      Text.of('!').white()
    ])
    
    // Level up effects
    player.playSound('minecraft:entity.player.levelup', 1, 1)
    player.level.spawnParticle(
      'minecraft:totem_of_undying',
      player.x, player.y + 1, player.z,
      20, 0.5, 0.5, 0.5, 0.1
    )
    
    return true
  }
  
  return false
}

// Award mining XP
BlockEvents.broken(event => {
  const { block, player } = event
  if (!player) return
  
  // Award XP based on block type
  if (block.hasTag('minecraft:ores')) {
    let xpAmount = 5
    if (block.id.includes('diamond')) xpAmount = 20
    else if (block.id.includes('gold')) xpAmount = 10
    
    addSkillXP(player, 'MINING', xpAmount)
  }
})

// Award combat XP
EntityEvents.death(event => {
  const { entity, source } = event
  const player = source.player
  if (!player || entity.isPlayer()) return
  
  // Award XP based on entity type
  let xpAmount = 5
  if (entity.isBoss()) xpAmount = 50
  else if (entity.id === 'minecraft:ender_dragon') xpAmount = 200
  else if (entity.id === 'minecraft:wither') xpAmount = 150
  
  addSkillXP(player, 'COMBAT', xpAmount)
})

// Award farming XP
ItemEvents.rightClicked(event => {
  const { item, player } = event
  if (!player) return
  
  // Check if using a hoe
  if (item.hasTag('minecraft:hoes')) {
    addSkillXP(player, 'FARMING', 1)
  }
})

// Command to check skill levels
ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event
  
  event.register(
    Commands.literal('skills')
      .executes(ctx => {
        const player = ctx.source.player
        if (!player) return 0
        
        const data = player.persistentData
        if (!data.contains(SKILL_KEY)) return 0
        
        const skills = data.getObject(SKILL_KEY)
        
        // Display all skills
        player.tell(Text.of('==== Your Skills ====').gold())
        
        Object.keys(SKILLS).forEach(skillId => {
          const skillData = skills.get(skillId)
          const skillInfo = SKILLS[skillId]
          const xpRequired = skillInfo.xpPerLevel(skillData.level)
          
          player.tell([
            Text.of(skillInfo.name + ': ').aqua(),
            Text.of('Level ' + skillData.level).yellow(),
            Text.of(' (' + skillData.xp + '/' + xpRequired + ' XP)').gray()
          ])
        })
        
        return 1
      })
  )
})`,
        thermalExpansionTemplate: `// KubeJS Thermal Expansion Template

// Require mod: KubeJS Thermal

ServerEvents.recipes(event => {
    // Alloy Smelter recipe
    event.recipes.thermalExpansionAlloySmelter(
        Item.of('thermal:signalum_ingot', 1), // output
        [
         ' I I',
         ' C C',
         ' G G'
        ],
        {
            I: 'thermal:invar_plate',
            G: 'minecraft:glowstone',
            C: 'minecraft:copper_ingot'
        }
    );

    // Pulverizer
    event.recipes.thermalExpansionPulverizer(
        [Item.of('thermal:lead_dust', 2), Item.of('minecraft:gold_dust').withChance(0.15)],
        'minecraft:gold_ore'
    );
    
    // Induction Smelter
    event.recipes.thermalExpansionInductionSmelter(
        Item.of('thermal:lumium_ingot', 1),
        'thermal:silver_ingot',
        [Fluid.of('minecraft:lava', 250)]
    );
})`,
        dimStorageTemplate: `// Dimensional Storage template
// Required mod: KubeJS Dimensional Storage

WorldgenEvents.add(event => {
    // Create a new dimension for storage
    event.addDimensionType('kubejs:storage', {
        ultrawarm: false,
        natural: false,
        piglin_safe: false,
        respawn_anchor_works: false,
        bed_works: true,
        has_raids: false,
        height: 384,
        min_y: -64,
        logical_height: 384,
        infiniburn: '#minecraft:infiniburn_overworld',
        effects: 'minecraft:the_end',
        ambient_light: 0.5
    });

    // Create dimension biome
    event.addBiome('kubejs:storage_void', {
        precipitation: 'none',
        generation_settings: {
            structures: {
                stronghold: { distance: 0 },
                mineshaft: { type: 'normal' }
            }
        },
        spawn_settings: {
            monster_spawns: [],
            creature_spawns: []
        }
    });

    // Create dimension
    event.addDimension('kubejs:storage_dimension', {
        type: 'kubejs:storage',
        generator: {
            type: 'minecraft:noise',
            seed: 0,
            settings: 'minecraft:void',
            biome_source: {
                type: 'minecraft:fixed',
                biome: 'kubejs:storage_void'
            }
        }
    });
});

// Storage portal creation recipe
ServerEvents.recipes(event => {
    event.shaped(
        Item.of('dimensional_storage:storage_core', 1),
        [
            ' D ',
            'SES',
            ' D '
        ],
        {
            D: 'minecraft:diamond_block',
            S: 'minecraft:nether_star',
            E: 'minecraft:ender_eye'
        }
    );
});

// Handle storage dimension teleport
ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event;

    event.register(
        Commands.literal('storage')
            .requires(src => src.hasPermission(2))
            .executes(ctx => {
                const player = ctx.source.player;
                const dim = player.server.getLevel('kubejs:storage_dimension');
                
                if (player.dimension === dim) {
                    player.teleportTo('minecraft:overworld');
                    player.tell('Teleported to overworld!');
                } else {
                    player.teleportTo('kubejs:storage_dimension');
                    player.tell('Teleported to storage dimension!');
                }
                
                return 1;
            })
    );
})`,
        customVillagersTemplate: `// Custom Villagers and Trades template

StartupEvents.postInit(event => {
    // Register custom villager profession
    const EXAMPLE_PROFESSION = VillagerProfessionJS.create('example')
        .id('kubejs:example')
        .workstation('minecraft:lectern')
        .build();

    // Register custom villager type
    const EXAMPLE_TYPE = VillagerTypeJS.create('example')
        .id('kubejs:example')
        .texture('kubejs:textures/entity/villager/example.png')
        .build();

    // Register custom wandering trader type
    const EXAMPLE_TRADER = WanderingTraderTypeJS.create('example')
        .id('kubejs:example_trader')
        .texture('kubejs:textures/entity/wandering_trader/example.png')
        .build();
});

// Custom villager trades
VillagerTradesEvents.addCustomTrades('example', trades => {
    // Level 1 trades
    trades.level(1)
        .add((buyA, buyB, sell, maxUses, xp) => {
            return { buyA: Item.of('minecraft:emerald', 1), 
                    buyB: null, 
                    sell: Item.of('minecraft:diamond', 1), 
                    maxUses: 12, 
                    xp: 1 }
        })
        .add((buyA, buyB, sell, maxUses, xp) => {
            return { buyA: Item.of('minecraft:emerald', 5), 
                    buyB: Item.of('minecraft:stick', 1), 
                    sell: Item.of('minecraft:netherite_ingot', 1), 
                    maxUses: 3, 
                    xp: 5 }
        });

    // Level 2 trades
    trades.level(2)
        .add((buyA, buyB, sell, maxUses, xp) => {
            return { buyA: Item.of('minecraft:emerald', 10), 
                    sell: Item.of('minecraft:enchanted_golden_apple', 1), 
                    maxUses: 5, 
                    xp: 10 }
        });
});

// Custom wandering trader trades
WanderingTraderTradesEvents.addCustomTrades('example_trader', trades => {
    trades.add((buyA, buyB, sell, maxUses, xp) => {
        return { buyA: Item.of('minecraft:emerald', 20), 
                sell: Item.of('minecraft:nether_star', 1), 
                maxUses: 1, 
                xp: 20 }
    });
})`,
        customPaintingsTemplate: `// Custom Paintings Template

StartupEvents.postInit(event => {
    // Register custom paintings
    PaintingVariantJS.create('sunset')
        .id('kubejs:sunset')
        .dimensions(32, 32) // Width, height in pixels
        .texture('kubejs:textures/painting/sunset.png')
        .build();

    PaintingVariantJS.create('landscape')
        .id('kubejs:landscape')
        .dimensions(16, 32)
        .texture('kubejs:textures/painting/landscape.png')
        .build();

    PaintingVariantJS.create('portrait')
        .id('kubejs:portrait')
        .dimensions(16, 16)
        .texture('kubejs:textures/painting/portrait.png')
        .build();
});

// Add painting recipe
ServerEvents.recipes(event => {
    event.shaped(
        Item.of('minecraft:painting', '{variant:"kubejs:sunset"}'),
        [
            'SSS',
            'SPS',
            'SSS'
        ],
        {
            S: 'minecraft:stick',
            P: 'minecraft:paper'
        }
    );
})`,
        customSoundsTemplate: `// Custom Sounds Template

StartupEvents.postInit(event => {
    // Register custom sound event
    SoundEventJS.create('custom_sound')
        .id('kubejs:custom_sound')
        .subtitle('A mysterious sound')
        .build();

    // Register custom music disc
    MusicDiscJS.create('custom_record')
        .id('kubejs:custom_record')
        .sound('kubejs:custom_sound')
        .duration(180) // Duration in seconds
        .build();
});

// Add music disc recipe
ServerEvents.recipes(event => {
    event.shaped(
        Item.of('minecraft:music_disc_custom', '{CustomModelData:1}'),
        [
            ' D ',
            'DRD',
            ' D '
        ],
        {
            D: 'minecraft:diamond',
            R: 'minecraft:redstone'
        }
    );
});

// Play custom sound on player tick
PlayerEvents.tick(event => {
    if (event.player.ticks % 600 == 0) { // Every 30 seconds
        event.player.level.playSound(
            'kubejs:custom_sound',
            event.player.x,
            event.player.y,
            event.player.z,
            1.0,
            1.0
        );
    }
})`,
        customParticlesTemplate: `// Custom Particles Template

StartupEvents.postInit(event => {
    // Register custom particle type
    ParticleTypeJS.create('custom_particle')
        .id('kubejs:custom_particle')
        .texture('kubejs:textures/particle/custom_particle.png')
        .build();
});

// Spawn particles on block break
BlockEvents.broken(event => {
    if (event.block.hasTag('minecraft:leaves')) {
        event.block.level.spawnParticle(
            'kubejs:custom_particle',
            event.block.x + 0.5,
            event.block.y + 0.5,
            event.block.z + 0.5,
            20, // Count
            0.5, // Spread X
            0.5, // Spread Y
            0.5, // Spread Z
            0.1  // Speed
        );
    }
});

// Create particle spawner item
StartupEvents.registry('item', event => {
    event.create('particle_wand')
        .displayName('Particle Wand')
        .maxStackSize(1)
        .rightClick(event => {
            const player = event.player;
            player.level.spawnParticle(
                'kubejs:custom_particle',
                player.x,
                player.y + 1,
                player.z,
                100,
                1.0,
                1.0,
                1.0,
                0.2
            );
        });
})`,
        customBiomesTemplate: `// Custom Biomes Template

WorldgenEvents.add(event => {
    // Create custom biome
    event.addBiome('kubejs:crystal_forest', {
        precipitation: 'rain',
        temperature: 0.7,
        downfall: 0.8,
        category: 'forest',
        generation_settings: {
            surface_builder: {
                type: 'default',
                config: {
                    top_material: {
                        Name: 'minecraft:grass_block'
                    },
                    under_material: {
                        Name: 'minecraft:dirt'
                    },
                    underwater_material: {
                        Name: 'minecraft:gravel'
                    }
                }
            },
            structures: {
                mineshaft: {
                    type: 'normal'
                },
                stronghold: {
                    distance: 8,
                    spread: 3
                },
                village: {
                    size: 6,
                    type: 'plains'
                }
            },
            carvers: {
                air: 'minecraft:cave',
                liquid: 'minecraft:canyon'
            },
            features: [
                // Crystal clusters
                {
                    feature: 'ore',
                    config: {
                        target: {
                            predicate: {
                                block: 'minecraft:stone'
                            },
                            type: 'minecraft:tag_match'
                        },
                        state: {
                            Name: 'minecraft:prismarine'
                        },
                        size: 12
                    }
                },
                // Crystal patches
                {
                    feature: 'disk',
                    config: {
                        tries: 20,
                        xz_spread: 7,
                        y_spread: 3,
                        state_provider: {
                            type: 'simple',
                            state: 'minecraft:quartz_block'
                        }
                    }
                }
            ]
        },
        spawn_settings: {
            creature_spawns: [
                {
                    type: 'minecraft:sheep',
                    weight: 12,
                    minCount: 4,
                    maxCount: 4
                },
                {
                    type: 'minecraft:fox',
                    weight: 8,
                    minCount: 2,
                    maxCount: 3
                }
            ],
            monster_spawns: [
                {
                    type: 'minecraft:zombie',
                    weight: 95
                }
            ]
        },
        effects: {
            sky_color: 8103167,
            water_color: 4566514,
            water_fog_color: 267827,
            fog_color: 12638463,
            foliage_color: 11634203,
            grass_color: 10197228,
            mood_sound: {
                sound: 'minecraft:ambient.cave',
                tick_delay: 6000,
                block_search_extent: 8,
                offset: 2.0
            }
        }
    });
});

// Add biome to overworld generation
WorldgenEvents.add(event => {
    event.addBiomeModifier('kubejs:crystal_forest_modifier', modifier => {
        modifier.biomes.add('kubejs:crystal_forest')
        modifier.chunk.add()
            .location({
                min_y: 60,
                max_y: 80,
                step: 1
            })
            .rarity(10)
    });
})`,
        customMobsTemplate: `// Custom Mobs Template

// Register custom mob
StartupEvents.registry('mob', event => {
    event.create('crystal_golem')
        .displayName('Crystal Golem')
        .modelLocation('kubejs:crystal_golem')
        .textureLocation('kubejs:textures/entity/crystal_golem')
        .attributes({
            maxHealth: 40,
            attackDamage: 6,
            movementSpeed: 0.3
        })
        .category('monster')
        .sized(1.0, 2.0)
        .defaultAttributes()
});

// Mob spawning configuration
WorldgenEvents.add(event => {
    event.addSpawn('kubejs:crystal_golem', {
        type: 'monster',
        weight: 100,
        minCount: 1,
        maxCount: 3,
        biomes: ['minecraft:plains', 'minecraft:desert']
    });
});

// Custom mob behavior
EntityEvents.tick('kubejs:crystal_golem', event => {
    const entity = event.entity;
    
    // Crystal trail effect
    if (Math.random() < 0.1) {
        entity.level.spawnParticle(
            'minecraft:end_rod',
            entity.x,
            entity.y + 1,
            entity.z,
            3,
            0.2,
            0.2,
            0.2,
            0.02
        );
    }
})`,
        customWeaponsTemplate: `// Custom Weapons Template

StartupEvents.registry('item', event => {
    // Custom sword with special abilities
    event.create('frost_blade')
        .displayName('Frost Blade')
        .tier('diamond')
        .attackDamage(8)
        .attackSpeed(1.6)
        .tooltip('§bFreeze your enemies!')
        .unstackable()
        .glow(true);
});

// Add weapon effects
ItemEvents.entityHit(event => {
    if (event.item.id === 'kubejs:frost_blade') {
        const target = event.target;
        
        // Apply slowness
        target.potionEffects.add('minecraft:slowness', 100, 0, true, false)
        target.potionEffects.add('minecraft:weakness', 100, 0, true, false)
        
        // Ice particle effect
        target.level.spawnParticle(
            'minecraft:snowflake',
            target.x,
            target.y + 1,
            target.z,
            10,
            0.5,
            0.5,
            0.5,
            0.1
        );
        
        // Play freeze sound
        target.level.playSound(
            'minecraft:block.glass.break', 
            target.x, 
            target.y, 
            target.z,
            1.0,
            2.0
        );
    }
})`,
        customArmorTemplate: `// Custom Armor Template

StartupEvents.registry('item', event => {
    // Create custom armor material
    const CRYSTAL_ARMOR = Java.loadClass('net.minecraft.world.item.ArmorMaterial')
        .builder()
        .durability(35)
        .protection(3, 6, 8, 3)
        .enchantability(15)
        .equipSound('minecraft:item.armor.equip_diamond')
        .repairIngredient('minecraft:diamond')
        .name('crystal')
        .build();

    // Register armor pieces
    event.create('crystal_helmet')
        .displayName('Crystal Helmet')
        .armor(CRYSTAL_ARMOR)
        .slot('head')
        .tooltip('§bProtects against harmful effects');

    event.create('crystal_chestplate')
        .displayName('Crystal Chestplate')
        .armor(CRYSTAL_ARMOR)
        .slot('chest')
        .tooltip('§bReflects damage');

    event.create('crystal_leggings')
        .displayName('Crystal Leggings')
        .armor(CRYSTAL_ARMOR)
        .slot('legs')
        .tooltip('§bIncreases movement speed');

    event.create('crystal_boots')
        .displayName('Crystal Boots')
        .armor(CRYSTAL_ARMOR)
        .slot('feet')
        .tooltip('§bNegates fall damage');
});

// Add armor effects
PlayerEvents.tick(event => {
    const player = event.player;
    const armor = player.armor;
    
    // Full set bonus
    if (armor.head?.id === 'kubejs:crystal_helmet' &&
        armor.chest?.id === 'kubejs:crystal_chestplate' &&
        armor.legs?.id === 'kubejs:crystal_leggings' &&
        armor.feet?.id === 'kubejs:crystal_boots') {
        
        // Apply effects
        player.potionEffects.add('minecraft:resistance', 20, 1, true, false);
        player.potionEffects.add('minecraft:night_vision', 220, 0, true, false);
        
        // Particle effects
        if (Math.random() < 0.1) {
            player.level.spawnParticle(
                'minecraft:end_rod',
                player.x,
                player.y + 1,
                player.z,
                3,
                0.2,
                0.2,
                0.2,
                0.02
            );
        }
    }
})`,
        customFoodTemplate: `// Custom Food Template

StartupEvents.registry('item', event => {
    // Basic custom food
    event.create('golden_apple_pie')
        .displayName('Golden Apple Pie')
        .food(food => {
            food.hunger(8)
                .saturation(0.8)
                .effect('regeneration', 100, 1, 1.0)
                .effect('absorption', 2400, 0, 1.0)
                .alwaysEdible();
        });

    // Special effect food
    event.create('mystic_berry')
        .displayName('Mystic Berry')
        .food(food => {
            food.hunger(4)
                .saturation(0.3)
                .effect('night_vision', 300, 0, 1.0)
                .effect('glowing', 300, 0, 1.0)
                .alwaysEdible()
                .fastToEat();
        });
});

// Add eating effects
ItemEvents.foodEaten(event => {
    if (event.item.id === 'kubejs:mystic_berry') {
        const player = event.player;
        
        // Teleport effect
        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * 5;
        const x = player.x + Math.cos(angle) * distance;
        const z = player.z + Math.sin(angle) * distance;
        const y = player.level.getHeight(x, z);
        
        player.teleportTo(x, y, z);
        
        // Visual and sound effects
        player.level.spawnParticle(
            'minecraft:portal',
            player.x,
            player.y,
            player.z,
            20,
            0.5,
            0.5,
            0.5,
            0.1
        );
        
        player.level.playSound(
            'minecraft:entity.enderman.teleport',
            player.x,
            player.y,
            player.z,
            1.0,
            1.0
        );
    }
})`,
        customDungeonTemplate: `// Custom Dungeon Template

WorldgenEvents.add(event => {
    // Register custom structure
    event.addStructure('crystal_dungeon', structure => {
        structure.biomes('#minecraft:is_overworld')
        structure.spacing(32)
        structure.separation(8)
        structure.salt(12345)
        
        // Structure configuration
        structure.structure(structure => {
            structure.piece('kubejs:dungeon/entrance', 1, 1, 1)
            structure.piece('kubejs:dungeon/corridor', 0, 0, 1)
            structure.piece('kubejs:dungeon/room', 0, 0, 2)
            structure.piece('kubejs:dungeon/boss_room', 0, 0, 1)
        });
    });
});

// Custom loot tables for the dungeon
LootJS.modifiers(event => {
    event.addLootTableModifier('kubejs:dungeon/chest')
        .addWeightedLoot([
            Item.of('minecraft:diamond').withChance(0.5),
            Item.of('minecraft:emerald', 3).withChance(0.7),
            Item.of('minecraft:golden_apple').withChance(0.3),
            Item.of('kubejs:crystal_sword').withChance(0.1)
        ]);
});

// Custom mob spawning in dungeon
BlockEvents.placed('minecraft:spawner', event => {
    if (event.block.biome.id === 'kubejs:crystal_dungeon') {
        event.block.createEntity('minecraft:zombie')
            .addTag('dungeon_mob')
            .equipArmor('diamond')
            .glow(true);
    }
});`,
        customQuestTemplate: `// Custom Quest System Template

// Quest data structure
const QUESTS = {
    'gather_resources': {
        title: 'Resource Gatherer',
        description: 'Collect basic resources',
        objectives: {
            'minecraft:log': 32,
            'minecraft:cobblestone': 64,
            'minecraft:iron_ore': 16
        },
        rewards: {
            items: ['minecraft:diamond', 'minecraft:golden_apple'],
            xp: 100
        }
    },
    'slay_monsters': {
        title: 'Monster Hunter',
        description: 'Defeat dangerous creatures',
        objectives: {
            'minecraft:zombie': 10,
            'minecraft:skeleton': 10,
            'minecraft:spider': 10
        },
        rewards: {
            items: ['minecraft:enchanted_book', 'minecraft:diamond_sword'],
            xp: 200
        }
    }
};

// Initialize player quest data
PlayerEvents.loggedIn(event => {
    const player = event.player;
    if (!player.persistentData.contains('quests')) {
        player.persistentData.putObject('quests', {
            active: {},
            completed: []
        });
    }
});

// Track quest progress
BlockEvents.broken(event => {
    const player = event.player;
    if (!player) return;
    
    const questData = player.persistentData.getObject('quests');
    Object.entries(questData.active).forEach(([questId, progress]) => {
        const quest = QUESTS[questId];
        if (quest.objectives[event.block.id]) {
            progress[event.block.id] = (progress[event.block.id] || 0) + 1;
            checkQuestCompletion(player, questId, progress);
        }
    });
});

EntityEvents.death(event => {
    const source = event.source;
    const player = source.player;
    if (!player || event.entity.isPlayer()) return;
    
    const questData = player.persistentData.getObject('quests');
    Object.entries(questData.active).forEach(([questId, progress]) => {
        const quest = QUESTS[questId];
        if (quest.objectives[event.entity.type]) {
            progress[event.entity.type] = (progress[event.entity.type] || 0) + 1;
            checkQuestCompletion(player, questId, progress);
        }
    });
});

function checkQuestCompletion(player, questId, progress) {
    const quest = QUESTS[questId];
    let completed = true;
    
    Object.entries(quest.objectives).forEach(([id, required]) => {
        if ((progress[id] || 0) < required) {
            completed = false;
        }
    });
    
    if (completed) {
        completeQuest(player, questId);
    }
}

function completeQuest(player, questId) {
    const quest = QUESTS[questId];
    const questData = player.persistentData.getObject('quests');
    
    // Remove from active quests
    delete questData.active[questId];
    questData.completed.push(questId);
    
    // Give rewards
    quest.rewards.items.forEach(item => {
        player.give(item);
    });
    player.giveExperienceLevels(quest.rewards.xp);
    
    // Notify player
    player.tell([
        Text.of('Quest Complete: ').gold(),
        Text.of(quest.title).green(),
        Text.of('!').gold()
    ]);
}`,
        thermalExpansionTemplate: `// KubeJS Thermal Expansion Template

// Require mod: KubeJS Thermal

ServerEvents.recipes(event => {
    // Alloy Smelter recipe
    event.recipes.thermalExpansionAlloySmelter(
        Item.of('thermal:signalum_ingot', 1), // output
        [
         ' I I',
         ' C C',
         ' G G'
        ],
        {
            I: 'thermal:invar_plate',
            G: 'minecraft:glowstone',
            C: 'minecraft:copper_ingot'
        }
    );

    // Pulverizer
    event.recipes.thermalExpansionPulverizer(
        [Item.of('thermal:lead_dust', 2), Item.of('minecraft:gold_dust').withChance(0.15)],
        'minecraft:gold_ore'
    );
    
    // Induction Smelter
    event.recipes.thermalExpansionInductionSmelter(
        Item.of('thermal:lumium_ingot', 1),
        'thermal:silver_ingot',
        [Fluid.of('minecraft:lava', 250)]
    );
})`,
        borealisDimensionManipulation: `// KubeJS Borealis Template - Dimension Manipulation

// Required mod: KubeJS Borealis
// Link: https://github.com/Borealis-Studio/kubejs-borealis

ServerEvents.recipes(event => {
    // Create a dimensional shard recipe
    event.shaped(
        Item.of('borealis:dimensional_shard', 1),
        [
            ' S ',
            'SDS',
            ' S '
        ],
        {
            S: 'minecraft:netherite_scrap',
            D: 'minecraft:ender_eye'
        }
    )
})

// Modify dimension properties
ServerEvents.worldgen(event => {
    // Make Nether always peaceful
    event.modifyDimension('minecraft:the_nether', dimension => {
        dimension.isPeaceful = true
        dimension.ambientLight = 0.75
        dimension.biomeAccess = 'end' // Use end-style biome access
    })

    // Modify End dimension
    event.modifyDimension('minecraft:the_end', dimension => {
        dimension.disableEndPortalEffect = true
        dimension.disableEndDragon = true
        dimension.endIslandsScale = 128 // Larger end islands
    })
})`,
        borealisCelestialEvents: `// KubeJS Borealis Template - Celestial Events

// Required mod: KubeJS Borealis

// Register custom celestial event
ServerEvents.celestialEvents(event => {
    event.create('blood_moon')
        .displayName('Blood Moon')
        .eventDuration(24000) // Duration in ticks (20 min)
        .chance(0.05) // 5% chance per night
        .conditions(world => world.isNight && world.isFullMoon)
        .onStart(world => {
            // Change moon color
            world.setMoonColor(0xFF0000)
            
            // Spawn more hostile mobs
            world.setHostileSpawnRate(3.0)
            
            // Play sound
            world.playSound('borealis:blood_moon_rise', world.spawnPoint.x, world.spawnPoint.y, world.spawnPoint.z, 1.0, 1.0)
        })
        .onEnd(world => {
            // Reset moon color
            world.resetMoonColor()
            
            // Reset spawn rates
            world.resetHostileSpawnRate()
        })
})

// Modify player behavior during events
PlayerEvents.tick(event => {
    const world = event.player.level
    
    if (world.isCelestialEventActive('blood_moon')) {
        // Apply effects during blood moon
        event.player.potionEffects.add('minecraft:weakness', 100, 0, true, false)
        event.player.potionEffects.add('minecraft:slowness', 100, 0, true, false)
        
        // Random effects
        if (Math.random() < 0.01) {
            event.player.heal(-1) // Damage player
            world.playSound('minecraft:entity.ghast.scream', event.player.x, event.player.y, event.player.z, 1.0, 1.0)
        }
    }
})`,
        borealisVoidManipulation: `// KubeJS Borealis Template - Void Manipulation

// Required mod: KubeJS Borealis

// Modify void particle effects
ServerEvents.worldgen(event => {
    event.modifyDimension('minecraft:overworld', dimension => {
        dimension.voidParticles = {
            particle: 'minecraft:end_rod',
            frequency: 20, // Particles per second
            density: 0.1, // Density multiplier
            minY: -64,    // Start Y level
            maxY: 0       // End Y level
        }
    })
})

// Create void-resistant block
StartupEvents.registry('block', event => {
    event.create('void_etched_obsidian')
        .displayName('Void-Etched Obsidian')
        .material('stone')
        .hardness(50.0)
        .resistance(2000.0)
        .tagBlock('minecraft:needs_diamond_tool')
        .lightLevel(5)
        .properties(block => {
            block.voidResistance = 10.0 // Higher is more resistant
            block.voidCollapseRadius = 0.5
        })
})

// Void damage modification
EntityEvents.hurt(event => {
    if (event.entity.type === 'player' && 
        event.source === 'borealis:void' && 
        event.entity.hasItem('borealis:void_charm')) {
        // Reduce void damage if player has void charm
        event.amount *= 0.5
        
        // Chance to cancel void damage completely
        if (Math.random() < 0.25) {
            event.cancel()
        }
    }
})`,
        borealisCustomBiomes: `// KubeJS Borealis Template - Custom Biomes

// Required mod: KubeJS Borealis

ServerEvents.worldgen(event => {
    // Create custom biome in void
    event.addBiome('borealis_void_garden', biome => {
        biome.precipitation = 'none'
        biome.temperature = 0.5
        biome.downfall = 0.0
        biome.category = 'none'
        
        // World generation
        biome.surfaceBuilder = {
            type: 'borealis_void',
            config: {
                top: 'minecraft:end_stone',
                filler: 'borealis:void_stone'
            }
        }
        
        // Features
        biome.features = [
            {
                feature: 'ore',
                config: {
                    target: 'minecraft:end_stone',
                    state: 'minecraft:chorus_flower.default',
                    size: 4
                }
            },
            {
                feature: 'random_patch',
                config: {
                    tries: 20,
                    xz_spread: 7,
                    y_spread: 3,
                    state_provider: {
                        type: 'simple',
                        state: 'borealis:void_flower'
                    }
                }
            }
        ]
        
        // Mob spawns
        biome.spawners = {
            monster: [
                {
                    type: 'minecraft:enderman',
                    weight: 10,
                    minCount: 1,
                    maxCount: 3
                }
            ],
            creature: [],
            ambient: [],
            water_creature: [],
            water_ambient: [],
            underground_water_creature: []
        }
        
        // Generation settings
        biome.generation = {
            biomeWeight: 10,
            edgeSize: 5,
            edgeType: 'borealis_void_field'
        }
    })
    
    // Add biome placement
    event.addBiomePlacement('borealis_void_garden', placement => {
        placement.type = 'borealis_void'
        placement.chunkCount = 1
        placement.minY = -64
        placement.maxY = 0
    })
})`,
        borealisSkyboxEffects: `// KubeJS Borealis Template - Skybox Effects

// Required mod: KubeJS Borealis

// Register custom skybox
StartupEvents.postInit(event => {
    const SKYBOX = Java.loadClass('dev.borealis.skybox.Skybox')
        .builder()
        .withTexture('textures/skybox/custom_sky.png')
        .withTransitionTime(24000) // Transition over a full day
        .build()
        
    event.registry('borealis:custom_skybox')
        .set(SKYBOX)
})

// Modify skybox based on conditions
ServerEvents.tick(event => {
    const server = event.server
    const world = server.getLevel('minecraft:overworld')
    
    // Change skybox during storms
    if (world.isRaining && world.isThundering) {
        world.applySkybox('borealis:storm_skybox')
        
        // Add visual effects
        world.setLightningFrequency(0.05) // More frequent lightning
        world.setRainDensity(1.5) // Heavier rain
    } else {
        world.resetSkybox()
    }
})

// Client-side skybox modification
ClientEvents.tick(event => {
    const client = event.player
    if (client.level.isCelestialEventActive('borealis:solar_eclipse')) {
        client.setPostEffect('minecraft:darkness')
    } else {
        client.resetPostEffect()
    }
})`,
        lootjsItemCondition: `// LootJS Item Condition Template
// Requires: LootJS for KubeJS

LootJS.modifiers(event => {
    // Example item condition loot modifier
    event.addLootTableModifier('minecraft:chests/simple_dungeon')
        .matchItems(items => {
            // Only modify diamond drops
            return items.is('minecraft:diamond')
        })
        .modifyLoot(loot => {
            // Double diamond drops from dungeon chests
            loot.count = loot.count * 2
        })
})`,
        lootjsBiomeCondition: `// LootJS Biome Condition Template
// Requires: LootJS for KubeJS

LootJS.modifiers(event => {
    // Example biome-based loot modifier
    event.addLootTableModifier('minecraft:entities/zombie')
        .matchBiomes({
            // Only apply in these biomes
            include: ['minecraft:desert', 'minecraft:badlands'],
            // Exclude villages
            exclude: ['#minecraft:is_village']
        })
        .addLoot('minecraft:gold_nugget', 2) // Always adds 2 gold nuggets
        .removeLoot('minecraft:rotten_flesh') // Removes rotten flesh
})`,
        lootjsPlayerCondition: `// LootJS Player Condition Template
// Requires: LootJS for KubeJS

LootJS.modifiers(event => {
    // Example player-based loot modifier
    event.addLootTableModifier('minecraft:entities/skeleton')
        .matchPlayers(player => {
            // Check player equipment and stats
            return player.hasItem('minecraft:totem_of_undying') && 
                   player.stages.has('boss_fight')
        })
        .addLoot('minecraft:totem_of_undying') // Reward for prepared players
        .addFunction(loot => {
            // Add bonus XP
            if (Math.random() < 0.3) {
                loot.xpBonus = (loot.xpBonus || 0) + 5
            }
        })
})`,
        lootjsRandomDistributions: `// LootJS Random Distributions Template
// Requires: LootJS for KubeJS

LootJS.modifiers(event => {
    // Example with custom random distributions
    event.addLootTableModifier('minecraft:chests/abandoned_mineshaft')
        .randomDistributions(dist => {
            dist.add('common_items', 0.75, 1, 3, [ // 75% chance for 1-3 common items
                'minecraft:coal',
                'minecraft:iron_ingot',
                'minecraft:bread'
            ])
            
            dist.add('rare_items', 0.25, 1, 1, [ // 25% chance for 1 rare item
                'minecraft:gold_ingot',
                'minecraft:diamond'
            ])
        })
})`,
        lootjsComplexModifiers: `// LootJS Complex Modifier Template
// Requires: LootJS for KubeJS

LootJS.modifiers(event => {
    // Example complex loot modifier with multiple conditions
    event.addLootTableModifier('minecraft:blocks/oak_leaves')
        .matchEnvironments(env => {
            // Only during rain
            return env.isRaining
        })
        .matchBlockState(state => {
            // Only for oak leaves with distance > 5
            return state.block === 'minecraft:oak_leaves' && 
                   state.get('distance') > 5
        })
        .addLoot('minecraft:apple')
        .addWeightedLoot([
            Item.of('minecraft:golden_apple').withChance(001),
            Item.of('minecraft:music_disc_11').withChance(0.005)
        ])
})`
    }
};