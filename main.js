import { config } from './config.js';
import { kubeJSDefinitions } from './kubejs-definitions.js';

let editor;
let currentFile = null;

// Initialize the Monaco editor
function initEditor() {
    // Configure Monaco loader
    require.config({
        paths: {
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs'
        }
    });

    require(['vs/editor/editor.main'], function() {
        // Register a new language
        monaco.languages.register({ id: 'kubejs' });

        // Set the language configuration
        monaco.languages.setLanguageConfiguration('kubejs', {
            comments: {
                lineComment: '//',
                blockComment: ['/*', '*/']
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" },
                { open: '`', close: '`' }
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"' },
                { open: "'", close: "'" },
                { open: '`', close: '`' }
            ]
        });

        // Define KubeJS syntax highlighting
        monaco.languages.setMonarchTokensProvider('kubejs', {
            defaultToken: 'invalid',
            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                    [/[A-Z][\w$]*/, 'type.identifier'],
                    { include: '@whitespace' },
                    { include: '@numbers' },
                    { include: '@strings' },
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@[a-zA-Z_$][\w$]*/, 'annotation'],
                    [/(@symbols)/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': 'symbol'
                        }
                    }]
                ],
                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment']
                ],
                comment: [
                    [/[^/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/[/*]/, 'comment']
                ],
                numbers: [
                    [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
                    [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                    [/\d+/, 'number']
                ],
                strings: [
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],
                    [/'/, 'string', '@string_single'],
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/"/, 'string', '@string_double'],
                    [/`/, 'string', '@string_backtick']
                ],
                string_single: [
                    [/[^\\']+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/'/, 'string', '@pop']
                ],
                string_double: [
                    [/[^\\"]+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/"/, 'string', '@pop']
                ],
                string_backtick: [
                    [/[^\\`]+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/`/, 'string', '@pop']
                ]
            },
            keywords: [
                'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
                'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
                'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
                'new', 'null', 'return', 'super', 'switch', 'this', 'throw',
                'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
                'let', 'static', 'async', 'await', 'of'
            ],
            operators: [
                '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
                '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
                '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
                '%=', '<<=', '>>=', '>>>='
            ],
            symbols: /[=><!~?:&|+\-*\/\^%]+/
        });

        // Add KubeJS autocompletion provider
        monaco.languages.registerCompletionItemProvider('kubejs', {
            provideCompletionItems: function(model, position) {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });

                const suggestions = [];

                // Add event type suggestions
                kubeJSDefinitions.eventTypes.forEach(eventType => {
                    suggestions.push({
                        label: eventType,
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: eventType,
                        detail: 'KubeJS Event Type'
                    });
                });

                // Add method suggestions
                Object.keys(kubeJSDefinitions.methods).forEach(method => {
                    const methodInfo = kubeJSDefinitions.methods[method];
                    suggestions.push({
                        label: method,
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: methodInfo.completion,
                        detail: methodInfo.description,
                        documentation: methodInfo.description
                    });
                });

                // Add property suggestions
                Object.keys(kubeJSDefinitions.properties).forEach(prop => {
                    const propInfo = kubeJSDefinitions.properties[prop];
                    suggestions.push({
                        label: prop,
                        kind: monaco.languages.CompletionItemKind.Property,
                        insertText: propInfo.completion,
                        detail: propInfo.description,
                        documentation: propInfo.description
                    });
                });

                return { suggestions };
            }
        });

        // Create editor with KubeJS language
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: `// Welcome to KubeJS Editor!\n// Select a template or start coding...\n`,
            language: 'kubejs',
            theme: config.theme,
            fontSize: config.fontSize,
            tabSize: config.tabSize,
            wordWrap: config.wordWrap,
            minimap: {
                enabled: config.minimap
            },
            lineNumbers: config.lineNumbers ? 'on' : 'off',
            automaticLayout: true
        });

        // Load default template if specified
        if (config.defaultTemplate && kubeJSDefinitions.templates[config.defaultTemplate]) {
            editor.setValue(kubeJSDefinitions.templates[config.defaultTemplate]);
            setStatus(`Loaded ${config.defaultTemplate} template`);
        }

        // Setup resize handling
        window.addEventListener('resize', () => {
            editor.layout();
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('templateSearch');
    const searchResults = document.getElementById('searchResults');
    
    function getTemplateCategories() {
        const categories = {};
        document.querySelectorAll('.sidebar-section').forEach(section => {
            const title = section.querySelector('.sidebar-section-title').textContent;
            const items = Array.from(section.querySelectorAll('.sidebar-item')).map(item => ({
                name: item.textContent,
                template: item.getAttribute('data-template')
            }));
            categories[title] = items;
        });
        return categories;
    }
    
    function showSearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        let currentCategory = '';
        results.forEach(result => {
            if (result.category !== currentCategory) {
                currentCategory = result.category;
                const categoryEl = document.createElement('div');
                categoryEl.className = 'search-result-category';
                categoryEl.textContent = currentCategory;
                searchResults.appendChild(categoryEl);
            }
            
            const itemEl = document.createElement('div');
            itemEl.className = 'search-result-item';
            itemEl.textContent = result.name;
            itemEl.addEventListener('click', () => {
                loadTemplate(result.template);
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            searchResults.appendChild(itemEl);
        });
        
        searchResults.style.display = 'block';
    }
    
    function performSearch(query) {
        const categories = getTemplateCategories();
        const results = [];
        
        Object.entries(categories).forEach(([category, items]) => {
            items.forEach(item => {
                if (item.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        category,
                        name: item.name,
                        template: item.template
                    });
                }
            });
        });
        
        showSearchResults(results);
    }
    
    // Search input event handlers
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        } else {
            searchResults.style.display = 'none';
        }
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch(searchInput.value.trim());
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Set status message
function setStatus(message, isError = false) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = isError ? 'status-error' : 'status-success';
    
    // Clear status after 3 seconds
    setTimeout(() => {
        statusEl.textContent = 'Ready';
        statusEl.className = '';
    }, 3000);
}

// Save file
function saveFile() {
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const filename = currentFile || 'kubejs-script.js';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    setStatus(`Saved as ${filename}`);
}

// Load file
function loadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        currentFile = file.name;
        
        const reader = new FileReader();
        reader.onload = event => {
            editor.setValue(event.target.result);
            setStatus(`Loaded ${file.name}`);
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Load template
function loadTemplate(templateName) {
    if (!templateName || !kubeJSDefinitions.templates[templateName]) {
        return;
    }
    
    editor.setValue(kubeJSDefinitions.templates[templateName]);
    setStatus(`Loaded ${templateName} template`);
}

// Get KubeJS documentation URL based on template or content
function getDocumentationUrl() {
    // Default documentation URL
    let baseUrl = 'https://kubejs.com/wiki/';
    
    // Check if we have a template selected
    const templateSelect = document.getElementById('templateSelect');
    const selectedValue = templateSelect?.value;
    
    // Get content to determine what type of script we're working with
    const content = editor?.getValue() || '';
    
    // Map template names to specific wiki pages
    const urlMap = {
        // Basic templates
        'startup': 'startup-scripts',
        'server': 'server-scripts',
        'client': 'client-scripts',
        
        // Recipe templates
        'craftingShapedRecipe': 'recipes/shaped',
        'craftingShapelessRecipe': 'recipes/shapeless',
        'smeltingRecipe': 'recipes/smelting',
        'blastingRecipe': 'recipes/blasting',
        'smokingRecipe': 'recipes/smoking',
        'campfireCookingRecipe': 'recipes/campfire',
        'stonecuttingRecipe': 'recipes/stonecutting',
        'smithingRecipe': 'recipes/smithing',
        'customRecipeRemoval': 'recipes/removal',
        
        // Content templates
        'lootTableModification': 'loot-tables',
        'itemRegistration': 'registry/item',
        'blockRegistration': 'registry/block',
        
        // Addon templates
        'probeJsBasic': 'https://github.com/Prunoideae/ProbeJS',
        'probeJsRecipeExplorer': 'https://github.com/Prunoideae/ProbeJS',
        'createMechanical': 'https://github.com/AlmostReliable/kubejs-creates',
        'createMixing': 'https://github.com/AlmostReliable/kubejs-creates',
        'createSequencedAssembly': 'https://github.com/AlmostReliable/kubejs-creates',
        'mekanismGasProcessing': 'https://github.com/KubeJS-Mods/KubeJS-Mekanism',
        'mekanismEnrichment': 'https://github.com/KubeJS-Mods/KubeJS-Mekanism',
        'mekanismReactors': 'https://github.com/KubeJS-Mods/KubeJS-Mekanism',
        
        // Advanced templates
        'customEvent': 'custom-events',
        'playerEvents': 'player-events',
        'commandRegistration': 'custom-commands',
        'worldGeneration': 'worldgen'
    };
    
    // Try to determine the current template
    const activeItem = document.querySelector('.sidebar-item.active');
    const activeTemplate = activeItem ? activeItem.getAttribute('data-template') : null;
    
    // Prioritize active template, then selected value, then content analysis
    if (activeTemplate && urlMap[activeTemplate]) {
        // Check if it's a full URL or a path
        return urlMap[activeTemplate].startsWith('http') ? 
            urlMap[activeTemplate] : 
            baseUrl + urlMap[activeTemplate];
    } else if (selectedValue && urlMap[selectedValue]) {
        return urlMap[selectedValue].startsWith('http') ? 
            urlMap[selectedValue] : 
            baseUrl + urlMap[selectedValue];
    }
    
    // Content analysis fallback
    if (content.includes('ServerEvents.recipes')) {
        return baseUrl + 'recipes';
    } else if (content.includes('StartupEvents.registry')) {
        return baseUrl + 'registry';
    } else if (content.includes('ClientEvents')) {
        return baseUrl + 'client-scripts';
    } else if (content.includes('ProbeJS') || content.includes('Recipe.getRecipes()')) {
        return 'https://github.com/Prunoideae/ProbeJS';
    } else if (content.includes('createMechanicalCrafting') || content.includes('createMixing')) {
        return 'https://github.com/AlmostReliable/kubejs-creates';
    } else if (content.includes('mekanism') || content.includes('mekanismEnriching')) {
        return 'https://github.com/KubeJS-Mods/KubeJS-Mekanism';
    }
    
    // Default to main documentation page
    return baseUrl;
}

// Open KubeJS documentation
function openDocumentation() {
    const url = getDocumentationUrl();
    window.open(url, '_blank');
    setStatus(`Opening documentation: ${url}`);
}

// Handle responsive layout based on device aspect ratio
function setupResponsiveLayout() {
    // Initial adjustment
    adjustLayoutForAspectRatio();
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
        adjustLayoutForAspectRatio();
        if (editor) editor.layout();
    });
}

// Adjust layout based on current aspect ratio
function adjustLayoutForAspectRatio() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Wide screen (landscape)
    if (aspectRatio > 1.5) {
        container.style.flexDirection = 'row';
        sidebar.style.width = 'var(--sidebar-width)';
        sidebar.style.height = '100%';
        mainContent.style.width = `calc(100% - var(--sidebar-width))`;
        mainContent.style.height = '100%';
        document.documentElement.style.setProperty('--sidebar-width', '240px');
    } 
    // Square-ish screen
    else if (aspectRatio >= 0.8 && aspectRatio <= 1.5) {
        container.style.flexDirection = 'row';
        document.documentElement.style.setProperty('--sidebar-width', '200px');
        sidebar.style.width = 'var(--sidebar-width)';
        sidebar.style.height = '100%';
        mainContent.style.width = `calc(100% - var(--sidebar-width))`;
        mainContent.style.height = '100%';
    } 
    // Narrow screen (portrait)
    else {
        document.documentElement.style.setProperty('--sidebar-width', '180px');
        sidebar.style.width = 'var(--sidebar-width)';
        
        // Ultra-narrow screen - stack vertically
        if (aspectRatio < 0.6) {
            container.style.flexDirection = 'column';
            sidebar.style.width = '100%';
            sidebar.style.height = '35%';
            mainContent.style.width = '100%';
            mainContent.style.height = '65%';
            
            // Adjust header for smaller width
            document.documentElement.style.setProperty('--header-height', '40px');
            
            // Make sidebar sections side-scrollable
            const sidebarSections = document.querySelectorAll('.sidebar-section');
            sidebarSections.forEach(section => {
                section.style.display = 'flex';
                section.style.overflowX = 'auto';
                section.style.flexWrap = 'nowrap';
                section.style.margin = '8px 0';
            });
            
            // Make sidebar items more compact
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => {
                item.style.whiteSpace = 'nowrap';
                item.style.margin = '0 4px';
                item.style.flex = '0 0 auto';
            });
        } else {
            container.style.flexDirection = 'row';
            sidebar.style.height = '100%';
            mainContent.style.width = `calc(100% - var(--sidebar-width))`;
            mainContent.style.height = '100%';
            
            // Reset header height
            document.documentElement.style.setProperty('--header-height', '48px');
            
            // Reset sidebar layout
            const sidebarSections = document.querySelectorAll('.sidebar-section');
            sidebarSections.forEach(section => {
                section.style.display = 'block';
                section.style.overflowX = 'visible';
                section.style.flexWrap = 'unset';
                section.style.margin = '16px 0';
            });
            
            // Reset sidebar items
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => {
                item.style.whiteSpace = 'normal';
                item.style.margin = '2px 0';
                item.style.flex = 'unset';
            });
        }
    }
    
    // Adjust font size based on screen width
    const baseFontSize = Math.max(12, Math.min(16, window.innerWidth / 80));
    document.documentElement.style.fontSize = `${baseFontSize}px`;
    
    // Adjust editor if it exists
    if (editor) {
        editor.updateOptions({
            fontSize: Math.max(12, Math.min(16, window.innerWidth / 100))
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize editor
    initEditor();
    
    // Initialize search functionality
    initializeSearch();
    
    // Add responsive layout handling
    setupResponsiveLayout();
    
    // Add event listeners
    document.getElementById('saveBtn').addEventListener('click', saveFile);
    document.getElementById('loadBtn').addEventListener('click', loadFile);
    document.getElementById('helpBtn').addEventListener('click', openDocumentation);
    
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            const templateName = item.getAttribute('data-template');
            if (templateName) {
                // Ask for confirmation if there's existing content
                const editorContent = editor.getValue().trim();
                if (editorContent && editorContent !== '// Welcome to KubeJS Editor!\n// Select a template or start coding...') {
                    if (confirm("Loading a template will replace your current code. Continue?")) {
                        loadTemplate(templateName);
                    } else {
                        // If user cancels, remove active class
                        item.classList.remove('active');
                    }
                } else {
                    loadTemplate(templateName);
                }
            }
        });
    });
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
    
    const statusEl = document.getElementById('status-message');
    statusEl.style.transition = 'color 0.3s ease';
});