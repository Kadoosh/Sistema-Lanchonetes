import { validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Middleware de validação
 * Verifica se há erros de validação e retorna formatado
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    // Log detalhado dos erros de validação
    logger.warn('Erro de validação', {
      url: req.url,
      method: req.method,
      body: req.body,
      errors: formattedErrors,
    });

    // Criar mensagem amigável
    const errorMessages = formattedErrors.map(e => `${e.field}: ${e.message}`).join(', ');
    
    throw new AppError(`Erro de validação: ${errorMessages}`, 400, formattedErrors);
  }

  next();
};

// Alias para compatibilidade
export const validarErros = validate;
