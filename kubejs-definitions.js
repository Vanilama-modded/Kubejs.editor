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
    }
};