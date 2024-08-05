const { Gio, Gdk, Gtk } = imports.gi;

function fileExists(filePath) {
  let file = Gio.File.new_for_path(filePath);
  return file.query_exists(null);
}

//计算多个数组的笛卡尔积
function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) {
    return [[]];
  }

  const [head, ...tail] = arrays;
  const tailCartesian = cartesianProduct(tail);
  // const result = [];
 const result: T[][] = [];

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
    ],
    [
      '512x512/',
    ],
    ['apps/', ''],
    [
      app_class + '.png',
      app_class + '.svg',
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

