
export function hexToRgb(hex) {
  // 去掉前导 #
  hex = hex.replace(/^#/, '');

  // 分解成R、G、B分量
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // 返回RGB格式的颜色
  return `rgb(${r}, ${g}, ${b})`;
}



export function hexToRgba(hex,opacity) {
  // 去掉前导 #
  hex = hex.replace(/^#/, '');

  // 分解成R、G、B分量
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // 返回RGB格式的颜色
  return `rgba(${r}, ${g}, ${b},${opacity})`;
}
