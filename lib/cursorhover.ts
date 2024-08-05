const { Gdk, Gtk } = imports.gi;


const CLICK_BRIGHTEN_AMOUNT = 0.13;

export function setupCursorHover(button) {
  const display = Gdk.Display.get_default();
  button.connect('enter-notify-event', () => {
    if (display != null) {
      const cursor = Gdk.Cursor.new_from_name(display, 'pointer');
      button.get_window().set_cursor(cursor);
    }
  });

  button.connect('leave-notify-event', () => {
    if (display != null) {
      const cursor = Gdk.Cursor.new_from_name(display, 'default');
      button.get_window().set_cursor(cursor);
    }
  });
}

export function setupCursorHoverAim(button) {
  button.connect('enter-notify-event', () => {
    const display = Gdk.Display.get_default();
    if (display == null) {
      return
    }
    const cursor = Gdk.Cursor.new_from_name(display, 'crosshair');
    button.get_window().set_cursor(cursor);
  });

  button.connect('leave-notify-event', () => {
    const display = Gdk.Display.get_default();
    if (display == null) {
      return
    }
    const cursor = Gdk.Cursor.new_from_name(display, 'default');
    button.get_window().set_cursor(cursor);
  });
}

export function setupCursorHoverGrab(button) {
  button.connect('enter-notify-event', () => {
    const display = Gdk.Display.get_default();
    if (display == null) {
      return
    }
    const cursor = Gdk.Cursor.new_from_name(display, 'grab');
    button.get_window().set_cursor(cursor);
  });

  button.connect('leave-notify-event', () => {
    const display = Gdk.Display.get_default();
    if (display == null) {
      return
    }
    const cursor = Gdk.Cursor.new_from_name(display, 'default');
    button.get_window().set_cursor(cursor);
  });
}

