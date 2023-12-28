// Definición de la lista de administradores
var adminList = () => {
    var list = [
        'LRMqsgqizLa2rGcI054Oi18ryl83'
    ];
    return list;
};

// Función para verificar si el usuario actual es un administrador
var checkIfUserAdmin = () => {
    return adminList().includes(valorCookieId);
};

// Exportar ambas funciones para que estén disponibles para otros módulos
export { checkIfUserAdmin };