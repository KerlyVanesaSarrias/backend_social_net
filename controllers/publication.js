export const testPublication = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde el controlador de Publicaciones"
    });
};

export const register = async (req, res) => {
    return res.status(200).json({
        message: "Registro de usuarios",});
}
