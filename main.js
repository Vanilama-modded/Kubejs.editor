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
    const selectedValue = templateSelect.value;
    
    if (selectedValue) {
        // Map template types to specific wiki pages
        const urlMap = {
            'startup': 'startup-scripts',
            'server': 'server-scripts',
            'client': 'client-scripts',
            'craftingShapedRecipe': 'recipes/shaped',
            'craftingShapelessRecipe': 'recipes/shapeless',
            'smeltingRecipe': 'recipes/smelting',
            'blastingRecipe': 'recipes/blasting',
            'smokingRecipe': 'recipes/smoking',
            'campfireCookingRecipe': 'recipes/campfire',
            'stonecuttingRecipe': 'recipes/stonecutting',
            'smithingRecipe': 'recipes/smithing',
            'customRecipeRemoval': 'recipes/removal',
            'lootTableModification': 'loot-tables',
            'itemRegistration': 'registry/item',
            'blockRegistration': 'registry/block'
        };
        
        if (urlMap[selectedValue]) {
            return baseUrl + urlMap[selectedValue];
        }
    }
    
    // If no specific template is selected, try to determine from content
    const content = editor?.getValue() || '';
    
    if (content.includes('ServerEvents.recipes')) {
        return baseUrl + 'recipes';
    } else if (content.includes('StartupEvents.registry')) {
        return baseUrl + 'registry';
    } else if (content.includes('ClientEvents')) {
        return baseUrl + 'client-scripts';
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize editor
    initEditor();
    
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