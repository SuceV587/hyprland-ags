import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Dock from './dock.js';

export default (monitor) => Widget.Window({
  monitor,
  className: 'f-dock-window',
  name: `dock${monitor}`,
  layer: 'top',
  anchor: ['bottom'],
  margins: [10, 0, 10, 0],
  exclusive: true,
  visible: true,
  child: Dock(),
});
