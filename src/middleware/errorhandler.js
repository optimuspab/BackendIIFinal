export const errorHandler = (error, req, res, next) => {
    if (!error) {
        error = new Error('Error desconocido');
        error.statusCode = 500;
    }

    const status = error.statusCode || 500;
    console.error(error);

    res.status(status).json({
        status,
        error: error.name || 'Error',
        message: error.message || 'Ocurrió un error',
        path: req.url
    });
};

