;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.hovers');

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.hovers.def = function(node, context, settings) {
    var x,
        y,
        w,
        h,
        e,
        v,
        fontStyle = node['hoverFontStyle'] || settings('hoverFontStyle') || node['fontStyle'] || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        fontSize = (settings('labelSize') === 'fixed') ?
          settings('defaultLabelSize') :
          settings('labelSizeRatio') * size,
        labelWidth = 0,
        labelPlacementX,
        labelPlacementY,
        alignment;


    if (node['labelAlignment'] === undefined){ 
      alignment = settings('defaultLabelAlignment');
    } else {
      alignment = node['labelAlignment'];
    }


    // Label background:
    context.font = (fontStyle ? fontStyle + ' ' : '') +
      fontSize + 'px ' + (settings('hoverFont') || settings('font'));

    context.beginPath();
    context.fillStyle = settings('labelHoverBGColor') === 'node' ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultHoverLabelBGColor');

    if (node.label && settings('labelHoverShadow')) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = settings('labelHoverShadowColor');
    }

    //TODO - going to need to figure out the border drawing...
    // need to understand how context drawing works...
    //TODO figure out where to inject the hovers type
    labelWidth = context.measureText(node.label).width;

    if (alignment === 'inside') {
      if (labelWidth > size * 2) {
        //too large to fit in node, use default value
        alignment = settings('defaultLabelAlignment');
        if (alignment === 'inside') {
          //don't use the default
          alignment = undefined;
        }
      } else {
        alignment = 'center';
      } 
    }

    labelPlacementY = Math.round(node[prefix + 'y'] + fontSize / 3);
    switch (alignment) {
      case 'center':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2 );
        break;
      case 'left':
        labelPlacementX = Math.round(node[prefix + 'x'] - size - labelWidth - 3 );
        break;
      case 'top':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2 );
        labelPlacementY = labelPlacementY - size - fontSize;
        break;
      case 'bottom':
        labelPlacementX = Math.round(node[prefix + 'x'] - labelWidth / 2 );
        labelPlacementY = labelPlacementY + size + fontSize;
        break;
      case 'right':
      default:
        // Default is aligned 'right'
        labelPlacementX = Math.round(node[prefix + 'x'] + size + 3);
        break;
    }
    //END hack edit


    if (node.label && typeof node.label === 'string') {
      x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
      y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
      w = Math.round(
        context.measureText(node.label).width  + size + 5
      );
      h = Math.round(fontSize + 4);
      e = Math.round(fontSize / 2 + 2);
      v = size - 4;
      //the hover code is hardcoded to default node type :(
      switch(alignment) {
        case 'center':
          if (labelWidth <= size * 2) {
            //completely inside:
            //this should hover larger than the outline
            context.arc(x + e,y + e, size + settings('borderSize') + 2, 0, Math.PI * 2);
          } else {
            //top left corner of rect
            context.moveTo(x + e - w / 2, y + e - h / 2);
            //top of rect
            context.lineTo(x + e + w / 2, y + e - h / 2);
            //right side
            context.lineTo(x + e + w / 2, y + e + h / 2);
            //bottom
            context.lineTo(x + e - w / 2, y + e + h / 2);
            //left
            context.lineTo(x + e - w / 2, y + e - h / 2);
          }
          break;
        case 'left':
          //right half of circle
          context.arc(x + e,y + e, e, Math.PI * 0.5, Math.PI * 1.5, true);
          //top of semi-circle
          context.moveTo(x+e, y);
          //top of rect
          context.lineTo(x + e - w, y);
          //right side of rect
          context.lineTo(x + e - w, y + h);
          //bottom of rect
          context.lineTo(x + e, y + h);
          break;
        case 'top': 
          //bottom half of circle
          context.arc(x + e,y + e, e, 0, Math.PI);
          //left side of semi-circle
          context.moveTo(x, y+e);
          //botLeft of rectangle - refactor size w/ fontSize
          context.lineTo(x + e - w / 2, y - v);
          //left side
          context.lineTo(x + e - w / 2, y - v - h);
          // top
          context.lineTo(x + e + w / 2, y - v - h);
          // right side
          context.lineTo(x + e + w / 2, y - v);
          //back to semi-circle, right side
          context.lineTo(x + 2 * e, y + e);
          break;
        case 'bottom':
          //top half of circle
          context.arc(x + e,y + e, e, 0, Math.PI, true);
          //left side of semi-circle
          context.moveTo(x, y+e);
          //topLeft of rectangle - refactor size w/ fontSize
          context.lineTo(x + e - w / 2, y + 2*e + v);
          //left side
          context.lineTo(x + e - w / 2, y + 2*e + v + h);
          // top
          context.lineTo(x + e + w / 2, y + 2*e + v + h);
          // right side
          context.lineTo(x + e + w / 2, y + 2*e + v);
          //back to semi-circle, right side
          context.lineTo(x + 2 * e, y + e);
          break;
        case 'right':
        default:
          //left half of circle
          context.arc(x + e,y + e, e, Math.PI * 0.5, Math.PI * 1.5);
          //top of semi-circle
          context.moveTo(x + e, y);
          //top of rect
          context.lineTo(x + e + w, y);
          //right side of rect
          context.lineTo(x + e + w, y + h);
          //bottom of rect
          context.lineTo(x + e, y + h);
          break;
      }
            

      context.closePath();
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
    }

    // Node border: note this is hardcoded for the default circle node
    if (settings('borderSize') > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        size + settings('borderSize'),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();
    }

    // Node:
    var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
    nodeRenderer(node, context, settings);

    // Display the label:
    if (node.label && typeof node.label === 'string') {
      context.fillStyle = (settings('labelHoverColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelHoverColor');

      context.fillText(
        node.label,
        labelPlacementX,
        labelPlacementY
      );
    }
  };
}).call(this);
