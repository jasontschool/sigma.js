//heavily modified from: https://github.com/jacomyal/sigma.js/pull/291/files
;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  /**
   * This label renderer will display the label according to labelAlignment.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize,
        fontStyle = node['fontStyle'] || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        labelWidth = 0,
        labelPlacementX,
        labelPlacementY,
        alignment;

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    //jteoh - modified to per-node setting
    if (node['labelAlignment'] === undefined){ 
      alignment = settings('defaultLabelAlignment');
    } else {
      alignment = node['labelAlignment'];
    }

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (fontStyle ? fontStyle + ' ' : '') +  fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

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

    context.fillText(
      node.label,
      labelPlacementX,
      labelPlacementY
    );
  };
}).call(this);
