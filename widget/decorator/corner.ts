const Cairo = imports.cairo
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Gtk } = imports.gi;
const Lang = imports.lang;

import type GtkType from "gi://Gtk?version=3.0"

type positonWhere = "bottom left" | "bottom right" | "top left" | "top right"


export default (monitor = 0, where: positonWhere = 'bottom left') => {
  const positionString = where.replace(/\s/, ""); // remove space
  const anchor = where.split(' ') as ("bottom" | "left" | "right" | "top")[];
  return Widget.Window({
    monitor,
    name: `corner${positionString}${monitor}`,
    layer: 'overlay',
    anchor,
    exclusivity: 'ignore',
    visible: true,
    child: RoundedCorner(positionString, { className: 'corner-black', }),
    setup: enableClickthrough,
  });
}


const RoundedCorner = (place: string, props: any) => Widget.DrawingArea({
  ...props,
  css: `
      background-color: black;
      border-radius: 1.5rem;
      -gtk-outline-radius: 1.5rem; 
      `,
  hpack: place.includes('left') ? 'start' : 'end',
  vpack: place.includes('top') ? 'start' : 'end',
  setup: (widget) => Utils.timeout(1, () => {
    // const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
    const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
    widget.set_size_request(r, r);
    widget.connect('draw', (Lang as any).bind(widget, (widget: any, cr: any) => {
      const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
      const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
      // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
      // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway
      widget.set_size_request(r, r);

      switch (place) {
        case 'topleft':
          cr.arc(r, r, r, Math.PI, 3 * Math.PI / 2);
          cr.lineTo(0, 0);
          break;

        case 'topright':
          cr.arc(0, r, r, 3 * Math.PI / 2, 2 * Math.PI);
          cr.lineTo(r, 0);
          break;

        case 'bottomleft':
          cr.arc(r, 0, r, Math.PI / 2, Math.PI);
          cr.lineTo(0, r);
          break;

        case 'bottomright':
          cr.arc(0, 0, r, 0, Math.PI / 2);
          cr.lineTo(r, r);
          break;
      }

      cr.closePath();
      cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
      cr.fill();
    }));
  }),
});

const dummyRegion = new Cairo.Region();
const enableClickthrough = (self: GtkType.Widget) => self.input_shape_combine_region(dummyRegion);
