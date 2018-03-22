const levels = [
  'debug',
  'info',
  'warning',
  'error',
];

function createRecord(context, message) {
  if (typeof context == 'string') {
    return {message: context};
  } else if (context instanceof Error) {
    return {error: context};
  }
  return context;
};

export function create(opts) {
  const logger = {};
  const handle = opts.handler;
  const context = opts.context || {};

  for (const level of levels) {
    logger[level] = (logContext, message) => {
      const record = createRecord(logContext, message);

      handle({
        level,
        ...context,
        ...record,
      });
    };
  }

  logger.child = name => {
    return create({
      ...opts,
      context: {
        ...context,
        name,
      },
    });
  };

  return logger;
};
