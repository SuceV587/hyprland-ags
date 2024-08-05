import { setupCursorHover } from "../../lib/cursorhover"

import type GtkType from "gi://Gtk?version=3.0"

interface RestType {
  [key: string]: any; // 表示可以有任意其他属性
}

interface AppButtonProps extends RestType {
  icon: string;
  address: string;
}

interface AppButtonFunc {
  (props: AppButtonProps): GtkType.Revealer;
}

const handleButton = () => {
  const handle = {
    iconInstance: null as GtkType.Widget | null,
    setIconInstance(instace: GtkType.Widget) {
      this.iconInstance = instace
    },
    getIconInstance() {
      return this.iconInstance
    }
  }

  return handle
}

//空的,不显示的
export const dummyItem = (address: string) => Widget.Box({
  attribute: { address },
  visible: false,
})

const appButton = ({ icon, address = "", ...rest }) => {
  const handle = handleButton()
  return Widget.Revealer({
    revealChild: false,
    transition: "slide_right",
    transitionDuration: 600,
    attribute: {
      address,
      handle,
    },
    child: Widget.Button({
      ...rest,
      className: "dock-app-btn",
      child: Widget.Box({
        child: Widget.Overlay({
          child: Widget.Box({
            homogeneous: true,
            className: "dock-app-icon-box",
            child: Widget.Icon({
              className: "dock-app-icon",
              icon: icon,
              setup: (self) => {
                // handle.setIconInstance(self)
                Utils.timeout(1, () => {
                  if (self.is_destroyed) {
                    return;
                  }

                  if (!self.get_parent) {
                    return;
                  }

                  if (self.get_parent() == null) {
                    return;
                  }
                  const styleContext = self.get_parent()?.get_style_context();
                  const width = styleContext?.get_property(
                    "min-width",
                    "NORMAL",
                  );
                  const height = styleContext?.get_property(
                    "min-height",
                    "NORMAL",
                  );
                  self.size = Math.max(width || 0, height || 0, 1);
                })
              },
            })
          }),
        }),
      }),
      setup: (button) => {
        setupCursorHover(button);
      },
    }),
  });
}

export default appButton
