document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 10. JAVASCRIPT & GEMINI API INTEGRATION
  // ==========================================================

  // --- LAYER 4: API KEY STORAGE ---
  const GEMINI_API_KEY = 'AIzaSyB6rno1Bcj04_UiI_YTgT_2CblSajCO_jA';

  // Emojis mapping to add delightful updates to the inputs
  const inputIcons = {
    'ingredient1': ['🍞', '🥖', '🥯', '🍕', '🥬', '🥦', '🌽', '🍕'],
    'ingredient2': ['🥚', '🍎', '🍅', '🥔', '🥕', '🫑', '🧅', '🍇'],
    'ingredient3': ['🍯', '🧀', '🥛', '🧈', '🥩', '🍗', '🐟', '🥛']
  };

  // Search dictionary for dynamic emoji popup matches
  const emojiMap = {
    "bread": "🍞", "beard": "🍞", "toast": "🍞", "bun": "🍞", "flour": "🍞", "wheat": "🍞",
    "roti": "🍞", "naan": "🍞", "tortilla": "🍞", "croissant": "🥐",
    "egg": "🥚", "eggs": "🥚", "egges": "🥚", "scramble": "🥚",
    "peanut": "🥜", "peanuts": "🥜", "peanut butter": "🥜", "peanutbutter": "🥜", "almond": "🥜", "nut": "🥜", "nuts": "🥜",
    "tomato": "🍅", "tomatoes": "🍅", "tomatoe": "🍅", "ketchup": "🍅",
    "honey": "🍯", "sugar": "🧂", "maple": "🍯", "syrup": "🍯",
    "potato": "🥔", "potatoes": "🥔", "potatoe": "🥔",
    "cheese": "🧀", "chese": "🧀", "chees": "🧀", "mozarella": "🧀", "mozzarella": "🧀", "cheddar": "🧀",
    "milk": "🥛", "milck": "🥛", "cream": "🥛", "yogurt": "🥛", "butter": "🧈", "ghee": "🧈",
    "chicken": "🍗", "chiken": "🍗", "meat": "🥩", "beef": "🥩", "pork": "🥩", "steak": "🥩", "fish": "🐟", "salmon": "🐟", "tuna": "🐟", "shrimp": "🍤",
    "bacon": "🥓", "sausage": "🌭",
    "apple": "🍎", "apples": "🍎", "banana": "🍌", "bananas": "🍌", "strawberry": "🍓", "berry": "🍓", "berries": "🍓", "orange": "🍊", "lemon": "🍋", "lime": "🍋", "avocado": "🥑", "grape": "🍇", "grapes": "🍇",
    "carrot": "🥕", "carrots": "🥕", "spinach": "🥬", "salad": "🥬", "lettuce": "🥬", "cabbage": "🥬", "onion": "🧅", "onions": "🧅", "garlic": "🧅", "mushroom": "🍄", "mushrooms": "🍄", "pepper": "🫑", "bell pepper": "🫑", "chili": "🌶️", "chilli": "🌶️", "cucumber": "🥒", "corn": "🌽", "broccoli": "🥦",
    "rice": "🍚", "pasta": "🍝", "noodle": "🍝", "noodles": "🍝", "spaghetti": "🍝", "oats": "🥣", "oatmeal": "🥣"
  };

  // Grab DOM Elements
  const ingredient1Input = document.getElementById('ingredient1');
  const ingredient2Input = document.getElementById('ingredient2');
  const ingredient3Input = document.getElementById('ingredient3');
  const cookBtn = document.getElementById('cook-btn');
  const loader = document.getElementById('loader');
  const recipeCard = document.getElementById('recipe-card');
  const errorCard = document.getElementById('error-card');
  const errorMsg = document.getElementById('error-msg');
  const apiKeyHelp = document.getElementById('api-key-help');

  const recipeDishTitle = document.getElementById('recipe-dish-title');
  const recipeStep1 = document.getElementById('recipe-step-1');
  const recipeStep2 = document.getElementById('recipe-step-2');
  const recipeStep3 = document.getElementById('recipe-step-3');

  // Additional DOM Elements for styling and settings
  const recipeForm = document.getElementById('recipe-form');
  const inputCard = document.getElementById('input-card');
  const emoji1El = document.getElementById('emoji1');
  const emoji2El = document.getElementById('emoji2');
  const emoji3El = document.getElementById('emoji3');
  const dishDescriptionEl = document.getElementById('dish-description');
  const servingTipEl = document.getElementById('serving-tip-text');
  const copyBtn = document.getElementById('copy-recipe-btn');
  const newRecipeBtn = document.getElementById('new-recipe-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalClose = document.getElementById('modal-close');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const cancelKeyBtn = document.getElementById('cancel-key-btn');

  // Load API Key (prefers saved key, falls back to hardcoded GEMINI_API_KEY)
  let apiKey = localStorage.getItem('gemini_api_key') || GEMINI_API_KEY || '';
  if (apiKey && apiKey !== 'AIzaSyB6rno1Bcj04_UiI_YTgT_2CblSajCO_jA') {
    apiKeyInput.value = apiKey;
    settingsBtn.classList.remove('has-indicator');
  } else {
    // If it's using the default hardcoded key, keep it clean
    settingsBtn.classList.remove('has-indicator');
  }

  // Set default starting emojis
  emoji1El.textContent = '🍞';
  emoji2El.textContent = '🍅';
  emoji3El.textContent = '🍯';

  // Match emoji function for typing checks
  function matchEmoji(text, defaultEmoji) {
    const val = text.toLowerCase().trim();
    if (!val) return defaultEmoji;

    if (emojiMap[val]) {
      return emojiMap[val];
    }

    if (val.endsWith('s') && val.length > 2) {
      const stripped = val.slice(0, -1);
      if (emojiMap[stripped]) {
        return emojiMap[stripped];
      }
    }

    if (val.length >= 2) {
      for (const key in emojiMap) {
        if (val.includes(key) || key.includes(val)) {
          return emojiMap[key];
        }
      }
    }

    return defaultEmoji;
  }

  // Update input emoji with pop scale animation
  function updateInputEmoji(inputEl, emojiEl, defaultEmoji) {
    const text = inputEl.value;
    const newEmoji = matchEmoji(text, defaultEmoji);

    if (emojiEl.textContent !== newEmoji) {
      emojiEl.textContent = newEmoji;
      emojiEl.classList.remove('emoji-pop');
      void emojiEl.offsetWidth; // Force redraw
      emojiEl.classList.add('emoji-pop');
    }
  }

  // Listeners for input text typing (dynamic emoji popups)
  ingredient1Input.addEventListener('input', () => {
    updateInputEmoji(ingredient1Input, emoji1El, '🍞');
    if (ingredient1Input.value.trim().length > 0) {
      setInputValid(ingredient1Input);
    }
  });

  ingredient2Input.addEventListener('input', () => {
    updateInputEmoji(ingredient2Input, emoji2El, '🍅');
    if (ingredient2Input.value.trim().length > 0) {
      setInputValid(ingredient2Input);
    }
  });

  ingredient3Input.addEventListener('input', () => {
    updateInputEmoji(ingredient3Input, emoji3El, '🍯');
    if (ingredient3Input.value.trim().length > 0) {
      setInputValid(ingredient3Input);
    }
  });

  // Settings Modal controls
  function openSettingsModal() {
    settingsModal.classList.add('active');
    apiKeyInput.focus();
  }

  function closeSettingsModal() {
    settingsModal.classList.remove('active');
  }

  settingsBtn.addEventListener('click', openSettingsModal);
  modalClose.addEventListener('click', closeSettingsModal);
  cancelKeyBtn.addEventListener('click', closeSettingsModal);

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeSettingsModal();
    }
  });

  saveKeyBtn.addEventListener('click', () => {
    const keyVal = apiKeyInput.value.trim();
    if (keyVal) {
      localStorage.setItem('gemini_api_key', keyVal);
      apiKey = keyVal;
      closeSettingsModal();
      clearGlobalError();
    } else {
      localStorage.removeItem('gemini_api_key');
      apiKey = GEMINI_API_KEY;
      closeSettingsModal();
    }
  });

  // Validation functions
  function setInputInvalid(inputEl, message) {
    inputEl.classList.add('is-invalid');
    const errorMsgEl = inputEl.parentElement.nextElementSibling;
    if (errorMsgEl && errorMsgEl.classList.contains('error-message')) {
      errorMsgEl.querySelector('.error-text').textContent = message;
      errorMsgEl.classList.add('show');
    }
  }

  function setInputValid(inputEl) {
    inputEl.classList.remove('is-invalid');
    const errorMsgEl = inputEl.parentElement.nextElementSibling;
    if (errorMsgEl && errorMsgEl.classList.contains('error-message')) {
      errorMsgEl.classList.remove('show');
    }
  }

  function showGlobalError(message) {
    errorCard.style.display = 'flex';
    errorMsg.textContent = message;
    errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearGlobalError() {
    errorCard.style.display = 'none';
    errorMsg.textContent = '';
  }

  // Get the best available generative model
  async function getBestModel(apiKey) {
    const preferredModels = [
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-pro'
    ];

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const models = data.models || [];
        const supportedModels = models
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));

        for (const preferred of preferredModels) {
          if (supportedModels.includes(preferred)) {
            return preferred;
          }
        }

        const anyFlash = supportedModels.find(name => name.includes('flash'));
        if (anyFlash) return anyFlash;
        if (supportedModels.length > 0) return supportedModels[0];
      }
    } catch (e) {
      console.warn("Error checking model list, using default:", e);
    }
    return 'gemini-2.5-flash';
  }

  // Generate recipe via Gemini API
  async function generateRecipe(ing1, ing2, ing3) {
    const modelName = await getBestModel(apiKey);
    console.log(`Cooking with model: ${modelName}`);

    const prompt = `You are a creative, professional chef assistant.
The user has these 3 ingredients in their fridge:
1. ${ing1}
2. ${ing2}
3. ${ing3}

Create a fun, appetizing, and creative dish using mainly or entirely these ingredients.
You may assume standard pantry staples (salt, pepper, oil, water, butter) are available.

Return your response strictly in the following JSON format. Do not wrap the JSON in markdown code blocks:
{
  "dishName": "A fancy, appetizing name for the dish",
  "description": "A short, mouthwatering description of the dish (1-2 sentences)",
  "steps": [
    "Step 1: First clear cooking instruction",
    "Step 2: Second clear cooking instruction",
    "Step 3: Third clear cooking instruction"
  ],
  "servingTip": "One premium serving tip, plating suggestion, or optional ingredient addition"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errMessage);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("No content received from AI.");
    }

    const cleanJson = rawText.replace(/^\s*```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleanJson);
  }

  // Cook Magic submit handler
  recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearGlobalError();

    const ing1 = ingredient1Input.value.trim();
    const ing2 = ingredient2Input.value.trim();
    const ing3 = ingredient3Input.value.trim();

    // Input validations
    let isValid = true;
    if (!ing1) {
      setInputInvalid(ingredient1Input, 'Please enter your first ingredient.');
      isValid = false;
    } else {
      setInputValid(ingredient1Input);
    }

    if (!ing2) {
      setInputInvalid(ingredient2Input, 'Please enter your second ingredient.');
      isValid = false;
    } else {
      setInputValid(ingredient2Input);
    }

    if (!ing3) {
      setInputInvalid(ingredient3Input, 'Please enter your third ingredient.');
      isValid = false;
    } else {
      setInputValid(ingredient3Input);
    }

    if (!isValid) {
      const firstInvalid = recipeForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!apiKey) {
      showGlobalError("Please check your settings. Key is empty.");
      openSettingsModal();
      return;
    }

    // Toggle loaders
    inputCard.classList.add('hidden');
    loader.classList.remove('hidden');
    loader.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
      // Get Recipe
      const recipe = await generateRecipe(ing1, ing2, ing3);

      // Inject recipe data into the UI
      recipeDishTitle.textContent = recipe.dishName || 'AI Gourmet Creation';
      dishDescriptionEl.textContent = recipe.description || 'A unique and tasty combination of your ingredients.';

      // Assign texts to pre-rendered HTML step elements directly
      recipeStep1.textContent = recipe.steps[0] || 'Toast the bread until golden brown.';
      recipeStep2.textContent = recipe.steps[1] || 'Spread butter and layer ingredients.';
      recipeStep3.textContent = recipe.steps[2] || 'Serve warm with a touch of magic.';

      // Serving Tip
      servingTipEl.innerHTML = `<strong>Plating Tip:</strong> ${recipe.servingTip || 'Serve fresh and enjoy!'}`;

      // Set copy text content
      copyBtn.dataset.clipboardText = `
🍽️ ${recipe.dishName}
✨ ${recipe.description}

👩‍🍳 RECIPE STEPS:
1. ${recipe.steps[0]}
2. ${recipe.steps[1]}
3. ${recipe.steps[2]}

💡 SERVING SUGGESTION:
${recipe.servingTip || 'Serve hot and fresh!'}
      `.trim();

      // Show recipe card
      loader.classList.add('hidden');
      recipeCard.classList.remove('hidden');
      recipeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      console.error(error);
      loader.classList.add('hidden');
      inputCard.classList.remove('hidden');

      if (error.message.includes('API key not valid')) {
        showGlobalError("Invalid API Key. Please click the settings gear icon to verify your key.");
        openSettingsModal();
      } else {
        showGlobalError(`Cooking failed! ${error.message}. Please try again.`);
      }
    }
  });

  // Copy Recipe Button functionality
  copyBtn.addEventListener('click', () => {
    const textToCopy = copyBtn.dataset.clipboardText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
        Copied!
      `;
      copyBtn.style.background = 'var(--color-secondary)';
      copyBtn.style.color = 'var(--color-text-light)';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });

  // Cook Another Button (Go back to inputs)
  newRecipeBtn.addEventListener('click', () => {
    recipeCard.classList.add('hidden');
    inputCard.classList.remove('hidden');

    ingredient1Input.value = '';
    ingredient2Input.value = '';
    ingredient3Input.value = '';
    emoji1El.textContent = '🍞';
    emoji2El.textContent = '🍅';
    emoji3El.textContent = '🍯';

    inputCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ingredient1Input.focus();
  });
});
