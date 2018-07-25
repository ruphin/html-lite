/**
 * @license
 * MIT License
 *
 * Copyright (c) 2017 Goffert van Gool
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { commentMarker, nodeMarker, attributeMarker } from './lib/markers.js';

import { TemplateResult, TemplateInstance } from './lib/templates.js';

export const html = (strings, ...values) => {
  return new TemplateResult(strings, values);
};

export const render = (templateResult, target) => {
  let instance = target.__templateInstance;
  if (!instance || instance.template !== templateResult.template) {
    instance = new TemplateInstance(templateResult.template);
    target.__templateInstance = instance;

    removeNodes(target, target.firstChild);
    instance.update(templateResult.values);
    target.appendChild(instance.fragment);
  } else {
    instance.update(templateResult.values);
  }
};

const removeNodes = (target, startNode, endNode) => {
  let node = startNode;
  if (node) {
    while (node !== endNode) {
      const nextNode = node.nextSibling;
      target.removeChild(node);
      node = nextNode;
    }
  }
};
