window.addEventListener('load', function () {
  'use strict';

  const pgm = window.PrebakedGeoJSONMap;
  const map = pgm.add();

  function clearExistingData(map) {
    map.fire("resetOverlayLayers");
    map.eachLayer(layer => { if (!layer._url) map.removeLayer(layer) });
  }

  function render(event) {
    const rawData = event.target.result;
    const json = JSON.parse(rawData);

    clearExistingData(map);

    pgm.renderPaths(json, map);
    pgm.renderPoints(json, map);

    let bounds = null;
    map.eachLayer(layer => {
      if (layer._url) return;
      if (!layer.getBounds) return;

      if (bounds) bounds.extend(layer.getBounds());
      else bounds = layer.getBounds();
    });

    if (bounds) map.flyToBounds(bounds);
  }

  function dragNoop(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  function dragEnter(event) {
    dragNoop(event);

    document.body.classList.add('drag-hover');
  }

  function drop(event) {
    dragNoop(event);

    const dt = event.dataTransfer;
    const file = dt.files[0];

    const reader = new FileReader();
    reader.onload = render;
    reader.readAsText(file);

    document.body.classList.remove('drag-hover');
  }

  document.addEventListener('dragenter', dragEnter, false);
  document.addEventListener('dragover', dragNoop, false);
  document.addEventListener('drop', drop, false);
});
