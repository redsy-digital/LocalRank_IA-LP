// ====================================================================================
// 1. CONFIGURAÇÃO DO FORMSPREE E WHATSAPP
// ====================================================================================

// ENDPOINT DO FORMSPREE FORNECIDO PELO UTILIZADOR
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mbdjnlla";

const WHATSAPP_LINKS = {
    "pt": "https://chat.whatsapp.com/JqIdHgnF9MRJbByMN75J5T",
    "en": "https://chat.whatsapp.com/Gzzm9aTrvlI2cWxcBDSbS2",
    "es": "https://chat.whatsapp.com/IgKclvV1KT03VaEyilAjMd"
};

// ====================================================================================
// 2. LÓGICA DO FORMULÁRIO
// ====================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prelaunchForm');
    const submitButton = form ? form.querySelector('.btn') : null;

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'A Enviar...';
        }

        const formData = new FormData(form);
        
        // Adicionar metadados úteis ao FormData para o Formspree
        formData.append('timestamp', new Date().toLocaleString());
        formData.append('browserLang', navigator.language);
        
        // Obter o idioma da página para o redirecionamento
        const pageLang = localStorage.getItem('currentLang') || 'pt';
        formData.append('pageLang', pageLang);
        
        // Obter o idioma preferido do utilizador (se selecionado)
        const preferredLang = formData.get('language') || pageLang;

        // 1. Envio para o Formspree
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData, // Formspree aceita FormData diretamente
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                console.log("Dados enviados para o Formspree com sucesso.");
                
                // 2. Redirecionamento Inteligente para o WhatsApp
                const whatsappLink = WHATSAPP_LINKS[preferredLang] || WHATSAPP_LINKS[pageLang] || WHATSAPP_LINKS['pt'];

                // Mostrar mensagem de sucesso antes de redirecionar
                alert(translations.formSuccess[pageLang] || translations.formSuccess['pt']);
                
                window.location.href = whatsappLink;

            } else {
                // Se o Formspree retornar um erro (ex: email não verificado)
                const errorData = await response.json();
                console.error('Erro ao enviar para o Formspree:', errorData);
                alert(translations.formError[pageLang] || translations.formError['pt'] + ": " + (errorData.error || "Erro desconhecido."));
            }

        } catch (error) {
            console.error('Erro de rede ao enviar o formulário:', error);
            alert(translations.formError[pageLang] || translations.formError['pt']);
            
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = translations.btnSubmitForm[pageLang] || translations.btnSubmitForm['pt'];
            }
        }
    });
});
