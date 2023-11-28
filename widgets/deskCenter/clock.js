

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Gdk, Gtk } = imports.gi;
const Lang = imports.lang;
const Cairo = imports.cairo


const ClockWidget = (props) => Widget.DrawingArea({
  className: 'bg-graph',
  properties: [
    ['update', (area, times) => {
      area.queue_draw();
      area.connect('draw', Lang.bind(area, (area, cr) => {
        const styleContext = area.get_style_context();
        const cx = Math.round(Math.max(styleContext.get_property('min-width', Gtk.StateFlags.NORMAL), area.get_allocated_width()) / 2);
        const cy = Math.round(Math.max(styleContext.get_property('min-height', Gtk.StateFlags.NORMAL), area.get_allocated_height()) / 2);
        const radius = Math.min(cx, cy);
        const hourHandLength = radius * 0.5;
        const minuteHandLength = radius * 0.7;
        const secondHandLength = radius * 0.9;


        // 绘制表盘
        cr.arc(cx, cy, radius, 0, 2 * Math.PI);
        cr.setSourceRGBA(1, 1, 1, 1);  // White color
        cr.fillPreserve();
        cr.setLineWidth(2);
        cr.setSourceRGBA(0, 0, 0, 1);  // Black color
        cr.stroke();

        // 绘制时针刻度
        cr.setLineCap(Cairo.LineCap.ROUND);
        for (let i = 1; i <= 12; i++) {

          const angle = (Math.PI / 6) * i;
          const x1 = cx + (radius - 10) * Math.sin(angle);
          const y1 = cy - (radius - 10) * Math.cos(angle);
          const x2 = cx + radius * Math.sin(angle);
          const y2 = cy - radius * Math.cos(angle);

          cr.moveTo(x1, y1);
          cr.lineTo(x2, y2);
          cr.setLineWidth(5);
          cr.stroke();

          // 绘制数字
          const textAngle = (Math.PI / 6) * i;

          let textX = cx + (radius - 30) * Math.sin(textAngle)

          const textY = cy - (radius - 30) * Math.cos(textAngle)


          cr.selectFontFace("Sans", Cairo.FontSlant.NORMAL, Cairo.FontWeight.NORMAL);
          cr.setFontSize(16);
          cr.moveTo(textX, textY);
          cr.showText(i.toString());
        }

        //绘制分/秒刻度
        for (let i = 0; i < 60; i++) {
          const angle = (Math.PI / 30) * i;
          const x1 = cx + (radius - 5) * Math.sin(angle);
          const y1 = cy - (radius - 5) * Math.cos(angle);
          const x2 = cx + (radius - 10) * Math.sin(angle);
          const y2 = cy - (radius - 10) * Math.cos(angle);

          cr.moveTo(x1, y1);
          cr.lineTo(x2, y2);
          cr.setLineWidth(2);
          cr.stroke();
        }


        // 绘制时针
        const hour = times.getHours() % 12;
        const minute = times.getMinutes();
        const second = times.getSeconds();
        const angleHour = (Math.PI / 6) * hour + (Math.PI / 360) * minute;
        const angleMinute = (Math.PI / 30) * minute;
        const angleSecond = (Math.PI / 30) * second;

        cr.moveTo(cx, cy);
        cr.lineTo(cx + hourHandLength * Math.sin(angleHour), cy - hourHandLength * Math.cos(angleHour));
        cr.setLineWidth(8);
        cr.stroke();

        // 绘制分针
        cr.moveTo(cx, cy);
        cr.lineTo(cx + minuteHandLength * Math.sin(angleMinute), cy - minuteHandLength * Math.cos(angleMinute));
        cr.setLineWidth(6);
        cr.stroke();


        // 绘制秒针
        cr.setSourceRGBA(1, 128 / 255, 0, 1);  // Yellow color
        cr.moveTo(cx, cy);
        cr.lineTo(cx + secondHandLength * Math.sin(angleSecond), cy - secondHandLength * Math.cos(angleSecond));
        cr.setLineWidth(2);
        cr.stroke();
      }))
    }]
  ],
  connections: [[1000, self => {
    const times = new Date()
    self._update(self, times)
  }]],
});

export const clock = () => {
  const widget = Widget.Box({
    className: 'f-clock-widget',
    homogeneous: true,
    children: [
      ClockWidget()
    ]
  })

  return widget
}
