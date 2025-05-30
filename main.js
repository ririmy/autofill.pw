const translations = {
            en: {
                pageTitle: "Autofill.pw - secure and random password generator",
                themeToggleLabel: "Toggle theme",
                copyButtonDefault: "Copy",
                copyButtonCopied: "Copied!",
                nothingToCopy: "Nothing to copy!",
                failedToCopy: "Failed to copy",
                passwordLengthLabel: "Password length",
                characterTypesLabel: "Character types:",
                uppercaseLabelText: "Uppercase (A-Z)",
                lowercaseLabelText: "Lowercase (a-z)",
                numbersLabelText: "Numbers (0-9)",
                symbolsLabelText: "Symbols (!@#$)",
                mixCyrillicLabelText: "Mix with Cyrillic (а-ш, А-Ш)",
                generateButtonText: "Generate password",
                errorSelectType: "Please select at least one character type.",
                privacyWarningText: "autofill.pw is committed to your privacy. We do not collect, store, or transmit any personal data, including the passwords you generate. All operations are performed entirely within your web browser, on your device.",
                allRightsReservedText: "All rights reserved."
            },
            sr: {
                pageTitle: "Autofill.pw - siguran i nasumični generator lozinki",
                themeToggleLabel: "Promeni temu",
                copyButtonDefault: "Kopiraj",
                copyButtonCopied: "Kopirano!",
                nothingToCopy: "Nema ničega za kopiranje!",
                failedToCopy: "Kopiranje neuspešno",
                passwordLengthLabel: "Dužina lozinke",
                characterTypesLabel: "Tipovi karaktera:",
                uppercaseLabelText: "Velika slova (A-Z)",
                lowercaseLabelText: "Mala slova (a-z)",
                numbersLabelText: "Brojevi (0-9)",
                symbolsLabelText: "Simboli (!@#$)",
                mixCyrillicLabelText: "Pomešaj sa ćirilicom",
                generateButtonText: "Generiši lozinku",
                errorSelectType: "Molimo izaberite bar jedan tip karaktera.",
                privacyWarningText: "autofill.pw je posvećen vašoj privatnosti. Ne prikupljamo, ne čuvamo niti prenosimo bilo kakve lične podatke, uključujući lozinke koje generišete. Sve operacije se u potpunosti izvršavaju unutar vašeg veb pregledača, na vašem uređaju.",
                allRightsReservedText: "Sva prava zadržana."
            }
        };

        let currentLanguage = 'en'; 
        const PREF_LANG_KEY = 'autofillPwPreferredLanguage';
        const PREF_THEME_KEY = 'autofillPwPreferredTheme';

        const logoPwElement = document.getElementById('logoPw');
        const pwStates = ['pw', 'password'];
        let currentPwStateIndex = 0;
        let pwInterval;

        function animatePw() {
            logoPwElement.style.opacity = 0;
            setTimeout(() => {
                currentPwStateIndex = (currentPwStateIndex + 1) % pwStates.length;
                logoPwElement.textContent = pwStates[currentPwStateIndex];
                logoPwElement.style.opacity = 1;
                
                clearInterval(pwInterval);
                pwInterval = setInterval(animatePw, pwStates[currentPwStateIndex] === 'pw' ? 3000 : 1500);
            }, 200); 
        }
        logoPwElement.style.transition = 'opacity 0.2s ease-in-out';
        pwInterval = setInterval(animatePw, 3000);


        const themeToggleButton = document.getElementById('themeToggle');
        const themeIcon = themeToggleButton.querySelector('i');
        const body = document.body;

        function applyTheme(theme) {
            body.classList.toggle('dark-mode', theme === 'dark');
            body.classList.toggle('light-mode', theme === 'light');
            if (theme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            themeToggleButton.setAttribute('aria-label', translations[currentLanguage].themeToggleLabel);
        }
        
        function setInitialTheme() {
            const savedTheme = localStorage.getItem(PREF_THEME_KEY);
            if (savedTheme) {
                applyTheme(savedTheme);
            } else {
                applyTheme('dark'); 
            }
        }
        
        setInitialTheme();

        themeToggleButton.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem(PREF_THEME_KEY, newTheme);
        });

        const lengthSlider = document.getElementById('length');
        const lengthValueDisplay = document.getElementById('lengthValue');
        const includeUppercaseCheckbox = document.getElementById('includeUppercase');
        const includeLowercaseCheckbox = document.getElementById('includeLowercase');
        const includeNumbersCheckbox = document.getElementById('includeNumbers');
        const includeSymbolsCheckbox = document.getElementById('includeSymbols');
        const includeCyrillicCheckbox = document.getElementById('includeCyrillic');
        const generateButton = document.getElementById('generateButton');
        const generatedPasswordDisplay = document.getElementById('generatedPassword');
        const copyButton = document.getElementById('copyButton');
        const copyButtonTextElement = document.getElementById('copyButtonText');
        const copyButtonIcon = copyButton.querySelector('i');
        const copyMessage = document.getElementById('copyMessage');
        const errorMessageDisplay = document.getElementById('errorMessage');

        const LOWERCASE_LATIN = 'abcdefghijklmnopqrstuvwxyz';
        const UPPERCASE_LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const NUMBERS = '0123456789';
        const SYMBOLS = '!@#$%^&*()_+-=[]{};\':"|,.<>/?~';
        const LOWERCASE_SERBIAN_CYRILLIC = 'абвгдђежзијклљмнњопрстћуфхцчџш';
        const UPPERCASE_SERBIAN_CYRILLIC = 'АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ';

        lengthSlider.addEventListener('input', (e) => {
            lengthValueDisplay.textContent = e.target.value;
        });

        function generatePassword() {
            errorMessageDisplay.textContent = '';
            const length = parseInt(lengthSlider.value);
            let charPool = '';
            let effectiveLowercase = LOWERCASE_LATIN;
            let effectiveUppercase = UPPERCASE_LATIN;

            if (includeCyrillicCheckbox.checked) {
                effectiveLowercase += LOWERCASE_SERBIAN_CYRILLIC;
                effectiveUppercase += UPPERCASE_SERBIAN_CYRILLIC;
            }

            if (includeUppercaseCheckbox.checked) charPool += effectiveUppercase;
            if (includeLowercaseCheckbox.checked) charPool += effectiveLowercase;
            if (includeNumbersCheckbox.checked) charPool += NUMBERS;
            if (includeSymbolsCheckbox.checked) charPool += SYMBOLS;

            if (charPool === '') {
                errorMessageDisplay.textContent = translations[currentLanguage].errorSelectType;
                generatedPasswordDisplay.textContent = '';
                return;
            }

            let password = '';
            const cryptoArray = new Uint32Array(length);
            window.crypto.getRandomValues(cryptoArray);

            for (let i = 0; i < length; i++) {
                password += charPool[cryptoArray[i] % charPool.length];
            }
            generatedPasswordDisplay.textContent = password;
        }

        generateButton.addEventListener('click', generatePassword);

        copyButton.addEventListener('click', () => {
            const passwordToCopy = generatedPasswordDisplay.textContent;
            if (!passwordToCopy) {
                copyMessage.textContent = translations[currentLanguage].nothingToCopy;
                copyMessage.style.opacity = 1;
                setTimeout(() => { copyMessage.style.opacity = 0; }, 2000);
                return;
            }

            const textArea = document.createElement('textarea');
            textArea.value = passwordToCopy;
            textArea.style.position = 'fixed'; 
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999); 

            try {
                document.execCommand('copy');
                copyButtonTextElement.textContent = translations[currentLanguage].copyButtonCopied;
                copyButtonIcon.classList.remove('fa-copy');
                copyButtonIcon.classList.add('fa-check');
                copyMessage.textContent = ''; 
            } catch (err) {
                copyMessage.textContent = translations[currentLanguage].failedToCopy;
                copyMessage.style.opacity = 1;
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
            setTimeout(() => {
                copyButtonTextElement.textContent = translations[currentLanguage].copyButtonDefault;
                copyButtonIcon.classList.remove('fa-check');
                copyButtonIcon.classList.add('fa-copy');
                copyMessage.style.opacity = 0;
            }, 2000);
        });
        
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        const langEnButton = document.getElementById('langEnButton');
        const langSrButton = document.getElementById('langSrButton'); 

        function applyTranslations(lang) {
            document.documentElement.lang = lang === 'sr' ? 'sr-Latn' : 'en'; 
            document.title = translations[lang].pageTitle;
            
            themeToggleButton.setAttribute('aria-label', translations[lang].themeToggleLabel);
            copyButtonTextElement.textContent = translations[lang].copyButtonDefault;
            document.getElementById('passwordLengthLabel').textContent = translations[lang].passwordLengthLabel;
            document.getElementById('characterTypesLabel').textContent = translations[lang].characterTypesLabel;
            document.getElementById('uppercaseLabelText').textContent = translations[lang].uppercaseLabelText;
            document.getElementById('lowercaseLabelText').textContent = translations[lang].lowercaseLabelText;
            document.getElementById('numbersLabelText').textContent = translations[lang].numbersLabelText;
            document.getElementById('symbolsLabelText').textContent = translations[lang].symbolsLabelText;
            document.getElementById('mixCyrillicLabelText').textContent = translations[lang].mixCyrillicLabelText;
            generateButton.textContent = translations[lang].generateButtonText;
            document.getElementById('privacyWarningText').textContent = translations[lang].privacyWarningText;
            document.getElementById('allRightsReservedText').textContent = translations[lang].allRightsReservedText;

            if (errorMessageDisplay.textContent !== '') {
                 errorMessageDisplay.textContent = translations[lang].errorSelectType;
            }
        }

        function setLanguage(lang, fromUserAction = false) {
            currentLanguage = lang;
            applyTranslations(lang);
            
            langEnButton.classList.toggle('active', lang === 'en');
            langSrButton.classList.toggle('active', lang === 'sr'); 
            
            if(fromUserAction){
                localStorage.setItem(PREF_LANG_KEY, lang);
            }

            if (generatedPasswordDisplay.textContent === '' && (includeUppercaseCheckbox.checked || includeLowercaseCheckbox.checked || includeNumbersCheckbox.checked || includeSymbolsCheckbox.checked)) {
            } else if (generatedPasswordDisplay.textContent !== '' || errorMessageDisplay.textContent !== '') {
                const charPool = (includeUppercaseCheckbox.checked ? UPPERCASE_LATIN + (includeCyrillicCheckbox.checked ? UPPERCASE_SERBIAN_CYRILLIC : '') : '') +
                                 (includeLowercaseCheckbox.checked ? LOWERCASE_LATIN + (includeCyrillicCheckbox.checked ? LOWERCASE_SERBIAN_CYRILLIC : '') : '') +
                                 (includeNumbersCheckbox.checked ? NUMBERS : '') +
                                 (includeSymbolsCheckbox.checked ? SYMBOLS : '');
                if(charPool === '' && (includeUppercaseCheckbox.checked || includeLowercaseCheckbox.checked || includeNumbersCheckbox.checked || includeSymbolsCheckbox.checked) ){
                     errorMessageDisplay.textContent = translations[currentLanguage].errorSelectType;
                } else if (charPool === ''){
                     errorMessageDisplay.textContent = translations[currentLanguage].errorSelectType;
                }
            }
        }
        
        function initializeLanguage(){
            const savedLang = localStorage.getItem(PREF_LANG_KEY);
            if(savedLang){
                setLanguage(savedLang);
                return;
            }

            const browserLang = navigator.language || navigator.userLanguage;
            if(browserLang && browserLang.toLowerCase().startsWith('sr')){
                setLanguage('sr'); 
            } else {
                setLanguage('en');
            }
        }


        langEnButton.addEventListener('click', () => setLanguage('en', true));
        langSrButton.addEventListener('click', () => setLanguage('sr', true)); 

        initializeLanguage(); 
        generatePassword();
