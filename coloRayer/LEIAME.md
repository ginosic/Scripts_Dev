# coloRayer para After Effects

**Versão:** v1.5
**Desenvolvedores:** Gino De Sicco & Elton JSON

O coloRayer é uma paleta inteligente para Adobe After Effects que agiliza o processo de etiquetar (labeling) camadas, keyframes e composições. Diferente de scripts comuns, o coloRayer lê as preferências locais do seu AE para mostrar **exatamente** as cores que você configurou, garantindo que o botão que você clica é a cor que você vê.

## 🚀 Funcionalidades

### 1. Colorização de Camadas
- **Etiquetagem num Clique:** Aplique cores de label às camadas ou keyframes selecionados instantaneamente.
- **Sincronia Real:** O painel lê os códigos hexadecimais das suas "Preferências de Rótulo" do After Effects. Se você usa cores personalizadas, o coloRayer vai mostrá-las corretamente.
- **Espectro Completo:** Acesso a todas as 16 cores de label + "Nenhum" (Cinza) em uma grade compacta.

### 2. Modo "Alice" (Colorização Recursiva)
- **O Buraco do Coelho:** Clique no botão **✦** para entrar no modo Alice.
- **Poder Recursivo:** Selecione uma composição no Painel de Projeto e escolha uma cor. A Alice vai mergulhar nessa composição e etiquetar recursivamente **a comp e todas as suas pré-comps/dependências** com a cor escolhida.
- **Salvador da Organização:** Perfeito para codificar por cor ramos inteiros do projeto (ex: "Todas as Pré-comps do Personagem = Azul", "Todos os BGs = Verde").

## 📦 Instalação

1. Copie o arquivo `coloRayer.jsx` para a pasta de Scripts do After Effects:
   - **Mac:** `/Applications/Adobe After Effects [Ano]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Ano]\Support Files\Scripts\ScriptUI Panels\`
2. Reinicie o After Effects.
3. Abra através do menu **Window** (lá no final da lista).

## 💡 Como Usar

**Para Camadas:**
1. Abra uma composição.
2. Selecione uma ou mais camadas ou keyframes.
3. Clique em um botão colorido no painel coloRayer.

**Para Composições (Modo Alice):**
1. Selecione uma **única composição** no Painel de Projeto.
2. Clique no botão **✦** na parte inferior do painel.
3. Escolha uma cor na janela flutuante que abrir.
4. Veja a composição e todas as suas pré-comps internas serem coloridas automaticamente.

---
*Feito com ❤️ e ExtendScript.*