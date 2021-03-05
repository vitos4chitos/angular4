export class TableValues {
  ingress;
  r_value;
  x_value;
  y_value;
  constructor(x_value: number, y_value: number, r_value: number, ingress: string) {
    this.x_value = x_value;
    this.y_value = y_value;
    this.r_value = r_value;
    this.ingress = ingress;
  }
}
