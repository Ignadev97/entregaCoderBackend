export class UserDTO {
  constructor(usuario) {
    this.id = usuario._id;
    this.name = usuario.nombre;
    this.email = usuario.email;
    this.role = usuario.role;
  }
}
