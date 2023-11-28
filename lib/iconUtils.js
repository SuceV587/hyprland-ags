const { Gio, Gdk, Gtk } = imports.gi;

function fileExists(filePath) {
  let file = Gio.File.new_for_path(filePath);
  return file.query_exists(null);
}

//计算多个数组的笛卡尔积
function cartesianProduct(arrays) {
  if (arrays.length === 0) {
    return [[]];
  }

  const [head, ...tail] = arrays;
  const tailCartesian = cartesianProduct(tail);
  const result = [];

  for (const item of head) {
    for (const tailItem of tailCartesian) {
      result.push([item, ...tailItem]);
    }
  }
  return result;
}

export const find_icon = (app_class) => {
  //主题路径 x 可能的尺寸大小 x apps x app的名称 x icon文件类型
  const themPath = [
    [
      '/usr/share/icons/awesome-icons/',
      '/usr/share/icons/hicolor/'
    ],
    [
      '512x512/',
      '128x128/',
      '64x64/',
      '96x96/',
      '72x72/',
      '48x48/',
      '36x36/',
    ],
    ['apps/', ''],
    [
      app_class + '.png',
      app_class + '.svg',
      app_class + '.xpm',
    ],
  ]


  let real_path = ''
  const all_icon_dir = cartesianProduct(themPath)

  for (let index = 0; index < all_icon_dir.length; index++) {
    const pathItem = all_icon_dir[index];
    const icon_path = pathItem.join('')
    if (fileExists(icon_path)) {
      real_path = icon_path
      break
    }
  }

  return real_path
}

