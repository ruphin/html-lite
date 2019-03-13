import { parseStrings } from '../src/lib/template-parser.js';
import { marker } from '../src/lib/markers.js';

const html = s => s;
const input = html`
  <div>
    <style attr=${1}>
      div {
        color: ${'red'};
        font-weight: ${'bold'};
      }
    </style>
    <style>
      /* <!-- ${1} --> */
    </style>
    Text <span thing attr=${1}></span>
    <div font="fine" color='"red ${1} blue ${1} yellow' name="bob" hue="cyan${1}">More ${1}Text</div>
    ${1}<!-- Things${1} More things${1} -->
    After${1}
    <!---->
    Text
  </div>
`;

// const input = html`
//   <!-- This is a comment --><style bare=${1} test="${1} e ${1}">
//     div {
//       margin: ${'red'};
//     }
//   </style>
//   <div><!---->${1}</div>
// `;

let { htmlString, parts } = parseStrings(input);

document.getElementById('container').innerText = htmlString;
console.log(parts);

const template = document.createElement('template');
template.innerHTML = htmlString;
console.log(template);

const printFragment = template.content.cloneNode(true);
const printNode = document.createElement('div');
printNode.appendChild(printFragment);
document.getElementById('container2').innerText = printNode.innerHTML;

const fragment = template.content.cloneNode(true);

const walker = document.createTreeWalker(fragment, 128 /* NodeFilter.SHOW_COMMENT */, null, false);

parts.forEach(partList => {
  let commentNode = walker.nextNode();
  while (commentNode.data !== marker) {
    commentNode = walker.nextNode();
  }
  partList.forEach(part => {
    let parts;
    console.log('DESCRIPTION', part);
    if (part.committer) {
      parts = new part.committer({ node: commentNode, ...part }).parts;
    } else {
      parts = [new part.part({ node: commentNode, ...part })];
    }
    console.log('PARTS', parts);
    parts.forEach((part, index) => {
      part.setValue(index);
    });
    parts.forEach(part => {
      part.commit();
    });
  });
});

document.getElementById('container3').appendChild(fragment);
