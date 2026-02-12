# Wiggle Master para After Effects

**Versão:** v4.0
**Criador:** Pedro Isaias
**Co-Desenvolvedores:** Gino De Sicco & Elton JSON

O Wiggle Master é uma ferramenta de automação para Adobe After Effects que revoluciona a forma de aplicar wiggles (tremidas). Em vez de lidar com expressões isoladas em cada camada, o Wiggle Master conecta tudo a um objeto "Master Null" central.

Isso permite alterar a frequência, amplitude e—o mais importante—**criar loops perfeitos** para todas as camadas conectadas de uma só vez.

## 🚀 Funcionalidades

### 1. Controle Centralizado
- **Um Null para Todos Governar:** O script cria uma camada "Wiggle Master" na sua composição.
- **Ajustes Globais:** Altere a Frequência ou a Amplitude (Amount) de Posição, Escala, Rotação e Opacidade para *todas* as camadas vinculadas instantaneamente através de Sliders.

### 2. Loop Perfeito
- **Sem Cortes:** Ao contrário da expressão wiggle padrão, o Wiggle Master foi feito para "loopar". Basta definir o slider **Loop Duration** (em segundos) na camada Master, e o movimento caótico se repetirá perfeitamente.

### 3. Controles Avançados
- **Desunir Escala (Unlink):** Escolha entre escala uniforme (X/Y travados) ou wiggle independente (efeito de "esmagar e esticar").
- **Posterize Time:** Efeito de "Stop Motion" embutido. Ajuste a taxa de quadros do wiggle diretamente na camada Master sem precisar de camadas de ajuste extras.

### 4. Ferramentas de Fluxo
- **Limpar Tudo (Nuke 'Em):** Um botão de pânico para remover expressões de todas as propriedades das camadas selecionadas.
- **Limpar Marcados:** Remove expressões apenas das propriedades que você marcou na interface.

## 📦 Instalação

1. Copie o arquivo `Wiggle Master.jsx` para a pasta de Scripts do After Effects:
   - **Mac:** `/Applications/Adobe After Effects [Ano]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Ano]\Support Files\Scripts\ScriptUI Panels\`
2. Reinicie o After Effects.
3. Abra através do menu **Window**.

## 💡 Como Usar

1. Selecione uma ou mais camadas na sua composição.
2. Marque as propriedades que deseja animar (Posição, Escala, Rotação, Opacidade).
3. Clique em **"Wiggle it!"**.
4. O script criará uma camada **"Wiggle Master"** (se ela ainda não existir).
5. Selecione a camada **"Wiggle Master"** e vá ao painel **Controle de Efeitos** para ajustar a velocidade, intensidade e duração do loop.

---
*Conceito original por Pedro Isaias. Desenvolvido com ❤️ e ExtendScript.*