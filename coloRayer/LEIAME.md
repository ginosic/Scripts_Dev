# coloRayer para After Effects

**Versão:** v2.0
**Desenvolvedores:** Gino De Sicco & Elton JSON

O coloRayer é uma paleta inteligente e sensível ao contexto para Adobe After Effects que agiliza o processo de colorir camadas, keyframes e itens de projeto. Ele lê as preferências locais do seu AE para mostrar **exatamente** as cores que você configurou.

## 🚀 Funcionalidades

### 1. Sistema de Injeção Inteligente (Novo na v2.0)
O script agora identifica automaticamente o melhor alvo para colorir baseado em um sistema de prioridades:
**Keyframes > Camadas > Seleção de Projeto > Composição Ativa.**

#### **🎮 Teclas Modificadoras (O Modo Pro):**
Você pode forçar a lógica manual usando atalhos de teclado:
- **Clique Normal:** Segue a prioridade automática.
- **ALT / OPT + Clique:** Força a pintura na **Seleção do Painel de Projeto** (ignora a timeline).
- **SHIFT + Clique:** Força a pintura na **Composição Ativa** (o item dela no projeto).

### 2. Infectar Hierarquia (Modo Alice Aprimorado)
- **O Núcleo:** Clique no botão **✦** para colorir uma árvore inteira de composições.
- **Alvo Contextual:**
    - Se uma **camada de Pré-comp** estiver selecionada na timeline, o alvo será essa comp e todas as suas sub-comps aninhadas.
    - Se nada estiver selecionado, o alvo será a **Composição Ativa** e sua hierarquia.
- **Poder Recursivo:** Mergulha nas dependências para garantir que ramos inteiros do projeto sejam categorizados visualmente de forma consistente.

## 📦 Instalação

1. Copie o arquivo `coloRayer.jsx` para a pasta de Scripts do After Effects:
   - **Mac:** `/Applications/Adobe After Effects [Ano]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Ano]\Support Files\Scripts\ScriptUI Panels\`
2. Reinicie o After Effects.
3. Abra através do menu **Window**.

## 💡 Dicas de Uso
- **Tooltips:** Passe o mouse sobre qualquer cor para ver os atalhos disponíveis.
- **Rótulo Zero:** O primeiro quadrado (cinza) limpa o rótulo (define como 0/Nenhum).
- **Multiplataforma:** Funciona em Windows e macOS (Option = Alt).

---
*Feito com ❤️ e ExtendScript.*
