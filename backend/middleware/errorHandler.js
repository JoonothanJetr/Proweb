// Error logger
const errorLogger = (err, req, res, next) => {
    console.error('\x1b[31m%s\x1b[0m', `[${new Date().toISOString()}] ERROR:`, {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });
    next(err);
};

// Error handler
const errorHandler = (err, req, res, next) => {
    // Tangani error berdasarkan jenisnya
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validasi gagal',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'DatabaseError') {
        return res.status(503).json({
            status: 'error',
            message: 'Database error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
};

// Not found handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.path}`
    });
};

module.exports = {
    errorLogger,
    errorHandler,
    notFoundHandler
}; 