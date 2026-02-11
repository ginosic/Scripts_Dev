# Pathfinder para After Effects

**Versão:** v2.5.1 (Golden Master)
**Desenvolvedores:** Gino De Sicco & Elton JSON

O Pathfinder é um painel de controle (dashboard) para Adobe After Effects, projetado para auditar a estrutura de arquivos do seu projeto, localizar assets perdidos ou fora do lugar ("fujões") e organizar seu fluxo de trabalho com poucos cliques.

## 🚀 Funcionalidades

### 1. Dashboard de Auditoria
- **Monitoramento em Tempo Real:** Mostra qual pasta raiz está sendo rastreada.
- **Detecção de Fujões (Strays):** Identifica arquivos importados no AE que estão salvos *fora* da pasta do projeto (ex: Downloads, Área de Trabalho).
- **Detecção de Órfãos (Orphans):** Identifica arquivos que estão *dentro* da pasta do projeto, mas que você esqueceu de importar para o AE.

### 2. Gerenciamento de Fujões (Equipe de Resgate)
- **Coletar (Copiar & Reconectar):** Copia arquivos fujões para uma pasta `_Collected_Strays` dentro da raiz do projeto e atualiza os links automaticamente.
- **Auto Relink (Buscar):** Varre a pasta do projeto procurando por arquivos com o mesmo nome e reconecta sem mover nada. Ótimo para corrigir links quebrados após organização manual.
- **O Segurança (The Bouncer):** Pula automaticamente arquivos com camadas (PSD, AI, PDF) durante processos automáticos para evitar perda de seleção de layers.

### 3. Gerenciamento de Órfãos
- **Importar:** Importa arquivos não utilizados em massa para uma pasta `_Pathfinder_Imports` no painel de Projeto.
- **Revelar:** Abre rapidamente a localização do arquivo no Finder/Explorer.

### 4. Ferramentas Avançadas
- **Seleção em Massa:** Botões "Selecionar Tudo" / "Limpar" para agilidade.
- **Feedback Visual:** A lista diminui dinamicamente conforme você resolve os problemas.
- **Sincronia:** Selecione um item na lista para destacá-lo imediatamente no Painel de Projeto do AE.

## 📦 Instalação

1. Copie o arquivo `Pathfinder.jsx` para a pasta de Scripts do After Effects:
   - **Mac:** `/Applications/Adobe After Effects [Ano]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Ano]\Support Files\Scripts\ScriptUI Panels\`
2. Reinicie o After Effects.
3. Abra através do menu **Window** (lá no final da lista).

## ⚠️ Notas
- O script requer permissão de escrita de arquivos (para a função Coletar).
- Sempre salve seu projeto (`.aep`) antes de rodar a auditoria para que a detecção de pasta funcione automaticamente.

---
*Feito com ❤️ e ExtendScript.*