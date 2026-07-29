# 🦈 Shark AeMaster (SHK_AEX) - Versioner & Duplicator Panel (v1.3)

> **Shark AeMaster (`SHK_AEX`)** é um painel nativo acoplável (*Dockable ScriptUI Palette*) para Adobe After Effects, com interface limpa integralmente em inglês e lógica inteligente baseada em tokens para versionar, duplicar e organizar arquivos `.aep` em subpastas configuráveis (`/AE_PROJECTS/SUPERS/`, `/VFX/`, etc.).

---

## ⚡ Funcionalidades Principais (v1.3)

1. **Interface Limpa & Visibilidade Ampliada (v1.3)**:
   - **Título do Painel:** Cabeçalho nativo renomeado para `SHARK AEMASTER`, removendo linhas de texto redundantes na parte superior e despoluindo o layout.
   - **Preview em Negrito e Maior:** O *Live Preview* agora exibe o caminho em **BOLD (11pt)** e o nome final do arquivo em **BOLD (13pt)** com maior espaçamento vertical, garantindo leitura e conferência rápida por parte do operador.
   - **Botão de Ação Direto:** Botão principal limpo como `⚡ Increment & Save`.
2. **Limpeza Inteligente Baseada em Tokens (`cleanBaseName`)**:
   - **Proteção do Núcleo do Projeto:** A partir da estrutura padrão do estúdio (`[NJA]_[FS70X]_[SIZZLE]...`), o algoritmo protege por padrão os **3 primeiros tokens** do nome original (`tokens[0]`, `tokens[1]` e `tokens[2]`), impedindo cortes de siglas curtas como `_SZL`.
   - **Reconhecimento de Tags de Setor:** Identifica tags de estúdio (`SUPERS`, `VFX`, `MGFX`, `REFS`, `SHOTS`, `ASSETS` ou tag customizada), corta qualquer sufixo após a tag e mantém o setor limpo.
   - **Remoção de Iniciais Duplicadas:** Quando um projeto não possui tag de setor, o script faz uma varredura reversa eliminando sufixos de versão (`_V02`), datas (`_YYMMDD`) e **iniciais do operador** (`_GDS`) do final do nome, impedindo duplicações como `_GDS_260729_GDS.aep`.
3. **Layout Responsivo (*Dockable Palette*)**:
   - Layout fluido em coluna única com `alignment = ["fill", "top"]` em todos os elementos e ganchos `onResizing` / `onResized`.
4. **Pasta de Destino / Tag Customizáveis & Persistência**:
   - Defina qualquer subpasta (padrão: `SUPERS`). Memória nativa entre sessões do After Effects via `app.settings`.
5. **Comportamento *Increment & Save***:
   - Salva a nova versão na pasta selecionada e mantém o novo arquivo `.aep` aberto e ativo no workspace do After Effects.

---

## 🛠️ Ambiente de Desenvolvimento & Symlinks

Os symlinks locais estão configurados no macOS apontando diretamente para `Dev/SHK_AEX/SHK_AEX.jsx`:

```bash
# AE 2026
ln -s "/Users/ginosic/Documents/_CodeVault/02_Projects/03_AeScripts/Dev/SHK_AEX/SHK_AEX.jsx" "/Applications/Adobe After Effects 2026/Scripts/ScriptUI Panels/SHK_AEX.jsx"

# AE 2025
ln -s "/Users/ginosic/Documents/_CodeVault/02_Projects/03_AeScripts/Dev/SHK_AEX/SHK_AEX.jsx" "/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/SHK_AEX.jsx"
```

---
*Desenvolvido por Elton JSON - CodeVault Ecosystem* 🎹🦈
