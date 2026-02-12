# grid(Maker) para After Effects

**Versão:** v1.2
**Desenvolvedor:** Gino De Sicco & Elton JSON

O grid(Maker) é uma ferramenta de geração de grids dinâmicos para Adobe After Effects que vai muito além de linhas estáticas. Ele constrói um **sistema de grid reativo** controlado por uma única Camada Nula (Effector).

As linhas do grid não são apenas posicionadas; elas vêm equipadas com expressões que permitem que sejam "empurradas" e distorcidas pelo controlador, criando layouts orgânicos e responsivos, perfeitos para UI design, HUDs sci-fi e tipografia cinética.

## 🚀 Funcionalidades

### 1. Sistema de Grid Reativo
- **Controlado por Null:** Gera uma camada nula `Grid Ctrl` que atua como o cérebro do grid.
- **Empurrar & Distorcer:** As linhas do grid reagem à posição do controlador. Mova o controlador para "afastar" as linhas, criando áreas de foco ou animações de "respiração".

### 2. Totalmente Personalizável
- **Entradas Dinâmicas:** Defina o número de linhas Verticais e Horizontais, espessura da linha e alcance da interação diretamente no painel.
- **Ajustes em Tempo Real:** Uma vez criado, você pode ajustar a `Espessura da Linha`, `Empurrão Máximo`, `Alcance do Efeito` e `Cor do Grid` em tempo real através do painel Controle de Efeitos na camada do controlador.

### 3. Células Inteligentes (Auto-Fill)
- **Modo fill(Cells)?:** Quando ativado, o script gera automaticamente camadas de forma para preencher os espaços vazios entre as linhas.
- **Geometria Responsiva:** Essas células se redimensionam e se movem automaticamente conforme você empurra as linhas do grid, mantendo uma estrutura de fundo sólida.

## 📦 Instalação

1. Copie o arquivo `grid(Maker).jsx` para a pasta de Scripts do After Effects:
   - **Mac:** `/Applications/Adobe After Effects [Ano]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [Ano]\Support Files\Scripts\ScriptUI Panels\`
2. Reinicie o After Effects.
3. Abra através do menu **Window**.

## 💡 Como Usar

1. Abra uma composição.
2. No painel **grid(Maker)**, defina seus parâmetros:
   - **Controller Name:** Nome da camada nula (padrão: "Grid Ctrl").
   - **Vertical/Horizontal Lines:** Quantas linhas você quer.
   - **Max Push Distance:** O quanto as linhas podem se mover quando o controlador chega perto.
   - **Effect Range:** O raio de influência do controlador.
   - **fill(Cells)?:** Marque para gerar células de fundo.
3. Clique em **"make(Grid)!"**.
4. Selecione a camada do Controlador recém-criada e mova-a pela tela para ver o grid reagir!

---
*Desenvolvido com ❤️ e ExtendScript.*