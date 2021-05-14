/**
 * See https://prosemirror.net/docs/ref/#model.NodeSpec
 */
export const mentionNode = {
  group: "inline",
  inline: true,
  atom: true,

  attrs: {
    id: "",
    name: "",
    email: "",
    src: ""
  },

  selectable: false,
  draggable: false,

  toDOM: node => {
    return [
      "img",
      {
        "data-mention-id": node.attrs.id,
        "data-mention-name": node.attrs.name,
        "id": node.attrs.id,
        "data-mention-email": node.attrs.email,
        "data-mention-src": node.attrs.src,
        "src": node.attrs.src,
        class: "prosemirror-mention-node"
      }
    ];
  },

  parseDOM: [
    {
      // match tag with following CSS Selector
      tag: "img[data-mention-id][id][data-mention-name][data-mention-email][data-mention-src]",

      getAttrs: dom => {
        var id = dom.getAttribute("data-mention-id");
        var name = dom.getAttribute("data-mention-name");
        var email = dom.getAttribute("data-mention-email");
        var src = dom.getAttribute("data-mention-src");
        return {
          id: id,
          name: name,
          email: email,
          src:src
        };
      }
    }
  ]
};


